import { prisma } from "@/lib/prisma";
import { createTheatreDTO, updateTheatreDTO } from "./theatre.schema";
import AppError from "@/helper/AppError";
import {redisClient, scanAndDeleteKeys} from "@/config/redis";

const createTheatre = async (data: createTheatreDTO) => {
  try {
    const result = await prisma.theatre.create({
      data,
    });

    await scanAndDeleteKeys(`theatre:${result.id}:*`); // delete all cached data for this theatre

    return result;
  } catch (error) {
    throw error;
  }
};

const updateTheatre = async (id: string, data: updateTheatreDTO) => {
  try {
    const exists = await prisma.theatre.findUnique({
      where: {
        id,
      },
    });
    if (!exists) {
      throw new AppError("Theatre not found", 404);
    }
    const result = await prisma.theatre.update({
      where: {
        id,
      },
      data,
    });

    await scanAndDeleteKeys(`theatre:${id}:*`); // delete all cached data for this theatre
    return result;
  } catch (error) {
    throw error;
  }
};

const deleteTheatre = async (id: string) => {
  try {
    const exists = await prisma.theatre.findUnique({
      where: {
        id,
      },
    });
    if (!exists) {
      throw new AppError("Theatre not found", 404);
    }
    const result = await prisma.theatre.delete({
      where: {
        id,
      },
    });

    await scanAndDeleteKeys(`theatre:${id}:*`); // delete all cached data for this theatre
    return result;
  } catch (error) {
    throw error;
  }
};

const getTheatreMovies = async (theatreId: string) => {
  try {

    // redis db
    const key = `theatre:${theatreId}:movies`;
    const cachedMovies = await redisClient.get(key);
    if (cachedMovies) {
      return JSON.parse(cachedMovies);
    }
    const movies = await prisma.movie.findMany({
      where: {
        showTimes: {
          some: {
            theatreId,
          },
        },
      },
    });

    // cache the result in redis
    await redisClient.setex(key, 3600, JSON.stringify(movies)); // cache for 1 hour
    return movies;
  } catch (error) {
    throw error;
  }
};

const getTheatreMovieDetails = async (theatreId: string, movieId: string) => {
  try {

    const key = `theatre:${theatreId}:movie:${movieId}:details`;

    const cachedMovieDetails = await redisClient.get(key);
    if (cachedMovieDetails) {
      return JSON.parse(cachedMovieDetails);
    }

    const movies = await prisma.movie.findUnique({
      where: {
        id: movieId,
        showTimes: {
          some: {
            theatreId,
          },
        },
      },
      select: {
        id: true,
        name: true,
        showTimes: {
          select: {
            id: true,
            startTime: true,
            hall: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    await redisClient.setex(key, 3600, JSON.stringify(movies)); // cache for 1 hour

    return movies;
  } catch (error) {
    throw error;
  }
};

export const theatreServices = {
  createTheatre,
  updateTheatre,
  deleteTheatre,
  getTheatreMovies,
  getTheatreMovieDetails,
};
