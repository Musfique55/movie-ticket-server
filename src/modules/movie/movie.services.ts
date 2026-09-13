import { prisma } from "@/lib/prisma";
import AppError from "@/helper/AppError";
import { createMovieDTO, updateMovieDTO } from "./movie.schema";
import {redisClient, scanAndDeleteKeys} from "@/config/redis";

const createMovie = async (data: createMovieDTO) => {
  try {
    const movie = await prisma.movie.create({
      data,
    });

    const key = `theatre:*:movies`;
    await scanAndDeleteKeys(key); // delete cached movies for all theatres
    return movie;
  } catch (error) {
    throw error;
  }
};

const updateMovie = async (id: string, data: Partial<updateMovieDTO>) => {
  try {
    const findMovie = await prisma.movie.findUnique({
      where: {
        id,
      },
    });
    if (!findMovie) {
      throw new AppError("Movie not found", 404);
    }

    const movie = await prisma.movie.update({
      where: {
        id,
      },
      data,
    });

    const key = `theatre:*:movie:${id}:details`;
    await scanAndDeleteKeys(key);
    return movie;
  } catch (error) {
    throw error;
  }
};

const deleteMovie = async (id: string) => {
  try {
    const findMovie = await prisma.movie.findUnique({
      where: {
        id,
      },
    });
    if (!findMovie) {
      throw new AppError("Movie not found", 404);
    }

    const isRelatedToShowTime = await prisma.showTime.findFirst({
      where: {
        movieId: id,
      },
    });
    if (isRelatedToShowTime) {
      throw new AppError("Movie is related to some showtimes", 400);
    }

    const movie = await prisma.movie.delete({
      where: {
        id,
      },
    });

    const key = `theatre:*`;
    await scanAndDeleteKeys(key); // delete cached movies for all theatres
    return movie;
  } catch (error) {
    throw error;
  }
};

export const movieServices = {
  createMovie,
  updateMovie,
  deleteMovie,
};
