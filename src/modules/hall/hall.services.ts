import { prisma } from "@/lib/prisma";
import { createHallDTO, updateHallDTO } from "./hall.schema";
import AppError from "@/helper/AppError";
const createHall = async (payload: createHallDTO) => {
  try {
    const result = await prisma.hall.create({
      data: payload,
    });
    return result;
  } catch (error) {
    throw new Error("Failed to create hall");
  }
};

const updateHall = async (id: string, payload: updateHallDTO) => {
  try {
    const hall = await prisma.hall.findUnique({ where: { id } });

    if (!hall) {
      throw new AppError("Hall not found", 404);
    }
    const result = await prisma.hall.update({
      where: { id },
      data: payload,
    });
    return result;
  } catch (error) {
    throw new Error("Failed to update hall");
  }
};

const deleteHall = async (id: string) => {
  try {
    const hall = await prisma.hall.findUnique({ where: { id } });

    if (!hall) {
      throw new AppError("Hall not found", 404);
    }

    const result = await prisma.hall.delete({
      where: { id },
    });
    return result;
  } catch (error) {
    throw new Error("Failed to delete hall");
  }
};

const getHall = async (id: string) => {
  try {
    const result = await prisma.hall.findUnique({
      where: { id },
    });
    return result;
  } catch (error) {
    throw new Error("Failed to get hall");
  }
};

const getAllHall = async () => {
  try {
    const result = await prisma.hall.findMany();
    return result;
  } catch (error) {
    throw new Error("Failed to get all halls");
  }
};

export const HallServices = {
  createHall,
  updateHall,
  deleteHall,
  getHall,
  getAllHall,
};
