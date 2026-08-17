import { prisma } from "@/lib/prisma";
import { CreateSeatDTO } from "./seat.schema";

const createSeat = async (data: CreateSeatDTO) => {
  try {
    const seat = await prisma.seat.createMany({
      data,
    });
    return seat;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const SeatServices = {
  createSeat,
};
