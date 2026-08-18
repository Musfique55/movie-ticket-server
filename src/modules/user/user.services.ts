import { prisma } from "@/lib/prisma";
import { CreateUserDTO } from "./user.schema";
import bcrypt from "bcryptjs";
import { Role } from "@/generated/prisma/client";

const userServices = async (data: CreateUserDTO) => {
  try {
    const isUser = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (isUser) {
      throw new Error("User already exists");
    }
    const hashedPassword = await bcrypt.hash(data.password, 12);

    const user = await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
        role: Role.USER,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const UserServices = {
  userServices,
};
