import { ReservationStatus, ShowSeatStatus } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { CreateReservationDTO } from "./reservation.schema";
import AppError from "@/helper/AppError";
import redisClient from "@/config/redis";
import { seatEmitter } from "@/lib/seatEmitter";
import { showTimeServices } from "../showTime/showTime.services";

const LUA_SCRIPT = `
  for i = 1, #KEYS do
    if redis.call('EXISTS', KEYS[i]) == 1 then
      return 0
    end
  end
  for i = 1, #KEYS do
    redis.call("SET", KEYS[i], ARGV[1], "EX", ARGV[2]);
  end;
  return 1;
`;

const createReservation = async (data: CreateReservationDTO) => {
  const HOLD_DURATION_MINUTES = 10;
  const expiresAt = new Date(Date.now() + HOLD_DURATION_MINUTES * 60 * 1000);
  const { seatIds, showTimeId, ...dataWithoutSeatIds } = data;

  const lockKeys = seatIds.map(
    (seatId) => `lock:showSeat:${showTimeId}:seat:${seatId}`,
  );

  const lockValue = JSON.stringify({
    userId: data.userId,
    showTimeId,
    expiresAt,
  });

  const result = await redisClient.eval(
    LUA_SCRIPT,
    lockKeys.length,
    ...lockKeys,
    lockValue,
    HOLD_DURATION_MINUTES * 60,
  );

  if (result !== 1) {
    throw new AppError("One or more selected seats are currently locked", 400);
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
      { maxWait: 5000, timeout: 5000 },
    );

    // emit event for seat availability
    setImmediate(async () => {
      try {
        const updatedShowTime =
          await showTimeServices.getShowTimeById(showTimeId);
        seatEmitter.emit(`seatUpdate:${showTimeId}`, updatedShowTime);
      } catch (error) {
        console.error("Error emitting seat update event:", error);
      }
    });

    return {
      reservation,
      seatIds,
      showTimeId,
    };
  } catch (error) {
    if (lockKeys.length > 0) {
      await redisClient.del(...lockKeys);
    }
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

  const updatedShowTime = await showTimeServices.getShowTimeById(showTimeId);
  seatEmitter.emit(`seatUpdate:${showTimeId}`, updatedShowTime);
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
  unlockSeat,
  cancelExpiredReservation,
};
