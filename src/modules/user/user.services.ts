import { prisma } from "@/lib/prisma";

const getUsers = async () => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        authUserId: true,
        authUser: {
          select: {
            name: true,
            email: true,
            phone: true,
            role: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    return users;
  } catch (error) {
    throw error;
  }
};

const getUserById = async (id: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        authUserId: true,
        authUser: {
          select: {
            name: true,
            email: true,
            phone: true,
            role: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });
    return user;
  } catch (error) {
    throw error;
  }
};

export const UserServices = {
  getUsers,
  getUserById,
};
