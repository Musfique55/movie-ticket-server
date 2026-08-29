import { prisma } from "@/lib/prisma";
import { TCreateSeatDTO, TUpdateSeatDTO } from "./seat.schema";
import AppError from "@/helper/AppError";

const createSeat = async (data: TCreateSeatDTO[]) => {
  try {
    const firstSeat = data[0];
    if (!firstSeat) {
      throw new AppError("At least one seat is required", 400);
    }
    const { theatreId, hallId } = firstSeat;
    const theatre = await prisma.theatre.findUnique({
      where: {
        id: theatreId,
      },
      select: {
        id: true,
        halls: {
          where: {
            id: hallId,
          },
          select: {
            id: true,
          },
        },
      },
    });

    if (!theatre || theatre.halls.length === 0) {
      throw new AppError("Invalid theatre or hall", 400);
    }

    const existingSeat = await prisma.seat.findMany({
      where: {
        theatreId,
        hallId,
      },
    });

    const seatSet = new Set<string>();
    for (const seat of existingSeat) {
      if (seat.rowPosition && seat.columnPosition) {
        seatSet.add(`${seat.rowPosition}-${seat.columnPosition}`);
      }
    }

    for (const seat of data) {
      if (seat.rowPosition && seat.columnPosition) {
        if (seatSet.has(`${seat.rowPosition}-${seat.columnPosition}`)) {
          throw new AppError(
            `Seat row: ${seat.rowPosition} column: ${seat.columnPosition} already exists`,
            400,
          );
        }
      }
    }

    const seat = await prisma.seat.createMany({
      data,
    });
    return seat;
  } catch (error) {
    throw error;
  }
};

const updateSeat = async (id: string, data: TUpdateSeatDTO) => {
  try {
    const existingSeat = await prisma.seat.findUnique({
      where: {
        id,
      },
    });

    if (!existingSeat) {
      throw new AppError("Invalid seat id", 404);
    }

    const seat = await prisma.seat.update({
      where: {
        id,
      },
      data,
    });
    return seat;
  } catch (error) {
    throw error;
  }
};

const getAllSeats = async () => {
  try {
    const seat = await prisma.seat.findMany();
    return seat;
  } catch (error) {
    throw error;
  }
};

const deleteSeat = async (id: string) => {
  try {
    const existingSeat = await prisma.seat.findUnique({
      where: {
        id,
      },
    });

    if (!existingSeat) {
      throw new AppError("Invalid seat id", 404);
    }

    const seat = await prisma.seat.delete({
      where: {
        id,
      },
    });
    return seat;
  } catch (error) {
    throw error;
  }
};

const getSeatById = async (id: string) => {
  try {
    const seat = await prisma.seat.findUnique({
      where: {
        id,
      },
    });
    return seat;
  } catch (error) {
    throw error;
  }
};

export const SeatServices = {
  createSeat,
  updateSeat,
  getAllSeats,
  deleteSeat,
  getSeatById,
};
