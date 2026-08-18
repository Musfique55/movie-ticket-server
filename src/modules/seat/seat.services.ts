import { prisma } from "@/lib/prisma";
import { CreateSeatDTO, UpdateSeatDTO } from "./seat.schema";
import AppError from "@/helper/AppError";

const createSeat = async (data: CreateSeatDTO) => {
  try {
    const seat = await prisma.seat.createMany({
      data,
    });
    return seat;
  } catch (error) {
    throw error;
  }
};

const updateSeat = async (id: string, data: UpdateSeatDTO) => {
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
