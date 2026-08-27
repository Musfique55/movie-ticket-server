import { prisma } from "@/lib/prisma";
import { createTheatreDTO, updateTheatreDTO } from "./theatre.schema";
import AppError from "@/helper/AppError";

const createTheatre = async (data: createTheatreDTO) => {
  try {
    const result = await prisma.theatre.create({
      data,
    });

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
    return result;
  } catch (error) {
    throw error;
  }
};

export const theatreServices = { createTheatre, updateTheatre, deleteTheatre };
