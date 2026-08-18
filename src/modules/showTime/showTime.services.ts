import { prisma } from "@/lib/prisma";
import { ShowTimeDTO, UpdateShowTimeDTO } from "./showTime.schema";
import { SeatStatus, ShowSeatStatus } from "@/generated/prisma/client";

const createShowTime = async (data: ShowTimeDTO) => {
  try {
    //create showtime
    const result = await prisma.showTime.create({
      data,
    });

    // fetch all physical seats
    const seats = await prisma.seat.findMany({
      where: {
        status: SeatStatus.AVAILABLE,
      },
    });

    // show seat payload
    const showSeats = seats.map((seat) => ({
      seatId: seat.id,
      showTimeId: result.id,
      status: ShowSeatStatus.AVAILABLE,
    }));

    // create bulk show seat
    await prisma.showSeat.createMany({
      data: showSeats,
    });

    return result;
  } catch (error) {
    throw error;
  }
};

const getAllShowTimes = async () => {
  try {
    const result = await prisma.showTime.findMany();
    return result;
  } catch (error) {
    throw error;
  }
};

const getShowTimeById = async (id: string) => {
  try {
    const result = await prisma.showTime.findUnique({
      where: {
        id,
      },
    });
    return result;
  } catch (error) {
    throw error;
  }
};

const updateShowTime = async (id: string, data: UpdateShowTimeDTO) => {
  try {
    const result = await prisma.showTime.update({
      where: {
        id,
      },
      data,
    });

    return result;
  } catch (error) {
    throw error;
  }
};

const deleteShowTime = async (id: string) => {
  try {
    const result = await prisma.showTime.delete({
      where: {
        id,
      },
    });
    return result;
  } catch (error) {
    throw error;
  }
};

export const showTimeServices = {
  createShowTime,
  getAllShowTimes,
  getShowTimeById,
  updateShowTime,
  deleteShowTime,
};
