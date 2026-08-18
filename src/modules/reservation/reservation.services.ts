import { ShowSeatStatus } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { CreateReservationDTO } from "./reservation.schema";
import AppError from "@/helper/AppError";

const createReservation = async (data: CreateReservationDTO) => {
  const HOLD_DURATION_MINUTES = 10;
  const expiresAt = new Date(Date.now() + HOLD_DURATION_MINUTES * 60 * 1000);
  try {
    const { seatIds, showTimeId, ...dataWithoutSeatIds } = data;
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
                type: true,
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
      {
        maxWait: 10000,
      },
    );

    return {
      reservation,
      seatIds,
    };
  } catch (error) {
    throw error;
  }
};

export const ReservationServices = {
  createReservation,
};
