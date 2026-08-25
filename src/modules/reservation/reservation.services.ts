import { ReservationStatus, ShowSeatStatus } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import {
  confirmReservationDTO,
  CreateReservationDTO,
} from "./reservation.schema";
import AppError from "@/helper/AppError";
import redisClient from "@/config/redis";
import { sendToQueue } from "@/lib/queue";

const createReservation = async (data: CreateReservationDTO) => {
  const HOLD_DURATION_MINUTES = 10;
  const expiresAt = new Date(Date.now() + HOLD_DURATION_MINUTES * 60 * 1000);
  const { seatIds, showTimeId, ...dataWithoutSeatIds } = data;

  const acquiredLocks: string[] = [];

  for (const seatId of seatIds) {
    const lockKey = `lock:showSeat:${showTimeId}:seat:${seatId}`;
    const lockValue = JSON.stringify({
      userId: data.userId,
      seatId,
      showTimeId,
      expiresAt,
    });

    // using setnx to acquire the lock
    const result = await redisClient.set(
      lockKey,
      lockValue,
      "EX",
      HOLD_DURATION_MINUTES * 60,
      "NX",
    );

    if (!result) {
      if (acquiredLocks.length > 0) {
        await redisClient.del(...acquiredLocks);
      }
      throw new AppError(
        "One or more selected seats are currently locked",
        400,
      );
    }
    acquiredLocks.push(lockKey);
  }

  try {
    const reservation = await prisma.$transaction(
      async (tx) => {
        const showSeats = await tx.showSeat.findMany({
          where: {
            id: { in: seatIds },
            status: ShowSeatStatus.AVAILABLE,
            showTimeId,
          },
          select: {
            id: true,
            seat: {
              select: {
                basePrice: true,
              },
            },
          },
        });

        if (showSeats.length !== seatIds.length) {
          throw new AppError(
            "One or more selected seats are no longer available",
            400,
          );
        }

        await tx.showSeat.updateMany({
          where: {
            id: { in: seatIds },
          },
          data: {
            status: ShowSeatStatus.LOCKED,
          },
        });

        const totalAmount = showSeats.reduce(
          (acc, showSeat) => acc + showSeat.seat.basePrice,
          0,
        );

        const reservation = await tx.reservation.create({
          data: {
            ...dataWithoutSeatIds,
            totalAmount,
            expiresAt,
          },
        });

        return { reservationId: reservation.id, expiresAt };
      },
      { maxWait: 10000 },
    );

    // Publish event to RabbitMQ
    await sendToQueue(
      "reservation_queue",
      "reservation_exchange",
      JSON.stringify({ reservationId: reservation.reservationId, expiresAt }),
    );

    return {
      reservation,
      seatIds,
      showTimeId,
    };
  } catch (error) {
    if (acquiredLocks.length > 0) {
      await redisClient.del(...acquiredLocks);
    }
    throw error;
  }
};

const confirmReservation = async (data: confirmReservationDTO) => {
  try {
    const result = await prisma.$transaction(async (tx) => {
      const reservation = await tx.reservation.findUnique({
        where: { id: data.reservationId },
        include: {
          user: { select: { name: true } },
        },
      });

      if (!reservation) {
        throw new AppError("Reservation not found", 404);
      }

      if (reservation.status !== "PENDING") {
        throw new AppError("Reservation is not in pending state", 400);
      }

      if (reservation.expiresAt && reservation.expiresAt < new Date()) {
        throw new AppError("Reservation has expired", 400);
      }

      const showSeats = await tx.showSeat.findMany({
        where: {
          id: { in: data.seatIds },
          status: ShowSeatStatus.LOCKED,
        },
        select: {
          id: true,
          showTimeId: true,
          seat: {
            select: {
              row: true,
              number: true,
              type: true,
              basePrice: true,
            },
          },
        },
      });

      if (showSeats.length !== data.seatIds.length) {
        throw new AppError(
          "One or more selected seats are no longer locked or available",
          400,
        );
      }

      const showTimeId = showSeats[0]!.showTimeId;

      const updatedReservation = await tx.reservation.update({
        where: {
          id: data.reservationId,
        },
        data: { status: ReservationStatus.CONFIRMED },
      });

      await tx.showSeat.updateMany({
        where: {
          id: { in: data.seatIds },
          status: ShowSeatStatus.LOCKED,
          showTimeId,
        },
        data: {
          status: ShowSeatStatus.BOOKED,
        },
      });

      const tickets = showSeats.map((s) => ({
        reservationId: data.reservationId,
        showSeatId: s.id,
        price: s.seat.basePrice,
      }));

      await tx.ticket.createMany({
        data: tickets,
      });

      const lockKeys = data.seatIds.map(
        (id) => `lock:showSeat:${showTimeId}:seat:${id}`,
      );

      await redisClient.del(lockKeys);

      return {
        reservation: updatedReservation,
        userName: reservation.user.name,
        discount: reservation.discount,
        tickets: showSeats.map((s) => ({
          seatRow: s.seat.row,
          seatNumber: s.seat.number,
          seatType: s.seat.type,
          price: s.seat.basePrice,
        })),
      };
    });

    const pdfData = {
      reservationId: result.reservation.id,
      userName: result.userName,
      email: data.email,
      totalAmount: Number(result.reservation.totalAmount),
      discount: Number(result.reservation.discount),
      confirmedAt: result.reservation.updatedAt,
      tickets: result.tickets,
    };

    await sendToQueue(
      "ticket_booking_confirmation_email_queue",
      "ticket_booking_confirmation_email_exchange",
      JSON.stringify(pdfData),
    );

    return result;
  } catch (error) {
    throw error;
  }
};

const unlockSeat = async (seatIds: string[], showTimeId: string) => {
  await prisma.showSeat.updateMany({
    where: {
      id: { in: seatIds },
      showTimeId,
      status: ShowSeatStatus.LOCKED,
    },
    data: {
      status: ShowSeatStatus.AVAILABLE,
    },
  });
};

const cancelExpiredReservation = async (reservationId: string) => {
  try {
    const result = await prisma.reservation.update({
      where: {
        id: reservationId,
      },
      data: {
        status: ReservationStatus.CANCELLED,
      },
    });

    return result;
  } catch (error) {
    throw error;
  }
};

export const ReservationServices = {
  createReservation,
  confirmReservation,
  unlockSeat,
  cancelExpiredReservation,
};
