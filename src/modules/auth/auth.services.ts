import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import AppError from "@/helper/AppError";
import { CreateUserDTO, LoginUserDTO, VerifyEmailDTO } from "./auth.schema";
import { jwtUtils } from "@/utils/jwtUtils";
import { IRequestUser } from "@/middleware/auth";
import redisClient from "@/config/redis";
import { sendToQueue } from "@/lib/queue";
import { generateVerificationCode } from "@/utils/generateVerificationCode";
import crypto from "crypto";

const register = async (data: CreateUserDTO) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  try {
    const user = await prisma.authUser.create({
      data: {
        ...data,
        password: hashedPassword,
        user: {
          create: {},
        },
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

    const { code, hashedCode } = generateVerificationCode();

    setImmediate(async () => {
      await sendToQueue(
        "email_verification_queue",
        "email_verification_exchange",
        JSON.stringify({
          email: user.email,
          hashedCode,
          code,
        }),
      );
    });
    return user;
  } catch (error) {
    throw error;
  }
};

const login = async (
  data: LoginUserDTO,
  info: { ip: string; userAgent: string },
) => {
  try {
    const user = await prisma.authUser.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      throw new AppError("Invalid credentials", 401);
    }

    if (!user.emailVerified) {
      throw new AppError(
        "You are not verified. Please verify your email.",
        401,
      );
    }

    // store login history
    await prisma.loginHistory.create({
      data: {
        email: user.email,
        ipAddress: info.ip,
        userAgent: info.userAgent,
      },
    });

    const accessToken = jwtUtils.generateToken({
      id: user.id,
      role: user.role,
      email: user.email,
      emailVerified: user.emailVerified,
    });
    const refreshToken = jwtUtils.generateToken({
      id: user.id,
      role: user.role,
      email: user.email,
      emailVerified: user.emailVerified,
    });

    const { password, ...rest } = user;
    return {
      user: rest,
      accessToken,
      refreshToken,
    };
  } catch (error) {
    throw error;
  }
};

const getMe = async (user: IRequestUser) => {
  try {
    const userInfo = await prisma.user.findUnique({
      where: {
        authUserId: user.id,
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
    return userInfo;
  } catch (error) {
    throw error;
  }
};

const verifyEmail = async (data: VerifyEmailDTO) => {
  try {
    const key = `otp:${data.email}`;

    const storedOtp = await redisClient.get(key);

    console.log(storedOtp, "stored otp");

    if (!storedOtp) {
      throw new AppError("Invalid or expired verification code", 400);
    }

    const hashedOtp = crypto
      .createHash("sha256")
      .update(data.code)
      .digest("hex");

    if (hashedOtp !== storedOtp) {
      throw new AppError("Invalid or expired verification code", 401);
    }

    await prisma.authUser.update({
      where: {
        email: data.email,
      },
      data: {
        emailVerified: true,
      },
    });

    await redisClient.del(key);
  } catch (error) {
    throw error;
  }
};

export const authServices = {
  register,
  login,
  getMe,
  verifyEmail,
};
