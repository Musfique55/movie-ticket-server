import { prisma } from "@/lib/prisma";
import { ShowTimeDTO, UpdateShowTimeDTO } from "./showTime.schema";
import { SeatStatus, ShowSeatStatus } from "@/generated/prisma/client";
import AppError from "@/helper/AppError";

const createShowTime = async (data: ShowTimeDTO) => {
  try {
    // check theatre
    const theatre = await prisma.theatre.findUnique({
      where: {
        id: data.theatreId,
      },
      select: {
        id: true,
        halls: {
          select: {
            id: true,
          },
          where: {
            id: data.hallId,
          },
        },
      },
    });

    if (!theatre || theatre.halls.length === 0) {
      throw new AppError("Invalid theatre or hall", 400);
    }

    //check movie
    const movie = await prisma.movie.findUnique({
      where: {
        id: data.movieId,
      },
    });

    if (!movie) {
      throw new AppError("Movie not found", 404);
    }

    const result = await prisma.$transaction(async (tx) => {
      //create showtime
      const showtime = await tx.showTime.create({
        data,
      });

      // fetch all physical seats
      const seats = await tx.seat.findMany({
        where: {
          hallId: data.hallId,
          theatreId: data.theatreId,
          status: SeatStatus.AVAILABLE,
        },
      });

      // show seat payload
      const showSeats = seats.map((seat) => ({
        seatId: seat.id,
        showTimeId: showtime.id,
        status: ShowSeatStatus.AVAILABLE,
      }));

      // create bulk show seat
      if (showSeats.length > 0) {
        await tx.showSeat.createMany({
          data: showSeats,
        });
      }

      return showtime;
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
      select: {
        id: true,
        movie: {
          select: {
            id: true,
            name: true,
            duration: true,
          },
        },
        hall: {
          select: {
            id: true,
            name: true,
          },
        },
        showSeats: {
          select: {
            id: true,
            status: true,
            seat: {
              select: {
                rowPosition: true,
                columnPosition: true,
                type: true,
                basePrice: true,
              },
            },
          },
        },
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
