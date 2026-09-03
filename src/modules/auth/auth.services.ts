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
import { envVars } from "@/config/envVars";
import { oauthClient } from "@/config/oAuth";

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

    const tokenPayload = {
      id: user.id,
      role: user.role,
      email: user.email,
      emailVerified: user.emailVerified,
    };

    const accessToken = jwtUtils.generateAccessToken(tokenPayload);
    const refreshToken = jwtUtils.generateRefreshToken(tokenPayload);

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

    setImmediate(async () => {
      await redisClient.del(key);
    });

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

const resendVerificationCode = async (email: string) => {
  try {
    const user = await prisma.authUser.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (user.emailVerified) {
      throw new AppError("User is already verified", 400);
    }

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
  } catch (error) {
    throw error;
  }
};

const getRefreshedToken = async (oldRefreshToken: string) => {
  const verifiedToken = jwtUtils.verifyToken(oldRefreshToken);
  if (!verifiedToken.success) {
    throw new AppError("Invalid or expired refresh token", 401);
  }

  const { exp, iat, ...rest } = verifiedToken.data as Record<string, unknown>;

  const accessToken = jwtUtils.generateAccessToken(rest);
  const refreshToken = jwtUtils.generateRefreshToken(rest);

  return {
    accessToken,
    refreshToken,
  };
};

const googleCallbackHandler = async (
  code: string,
  info: { ip: string; userAgent: string },
) => {
  try {
    const { tokens } = await oauthClient.getToken(code);
    oauthClient.setCredentials(tokens);

    const ticket = await oauthClient.verifyIdToken({
      idToken: tokens.id_token!,
      audience: envVars.googleClientId,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      throw new AppError("Invalid Google token", 401);
    }

    let userData = await prisma.authUser.findUnique({
      where: { email: payload.email },
    });

    if (!userData) {
      const hashedPassword = await bcrypt.hash(
        crypto.randomBytes(12).toString("hex"),
        10,
      );
      userData = await prisma.authUser.create({
        data: {
          name: payload.name!,
          email: payload.email!,
          emailVerified: true,
          password: hashedPassword,
          phone: "",
          user: { create: {} },
        },
      });
    } else if (!userData.emailVerified) {
      userData = await prisma.authUser.update({
        where: { email: payload.email },
        data: { emailVerified: true },
      });
    }

    await prisma.loginHistory.create({
      data: {
        email: payload.email!,
        ipAddress: info.ip,
        userAgent: info.userAgent,
      },
    });

    const tokenPayload = {
      id: userData.id,
      role: userData.role,
      email: userData.email,
      emailVerified: userData.emailVerified,
    };

    const accessToken = jwtUtils.generateAccessToken(tokenPayload);
    const refreshToken = jwtUtils.generateRefreshToken(tokenPayload);

    const { password, ...rest } = userData;
    return {
      user: rest,
      accessToken,
      refreshToken,
    };
  } catch (error) {
    throw error;
  }
};

export const authServices = {
  register,
  login,
  getMe,
  verifyEmail,
  resendVerificationCode,
  getRefreshedToken,
  googleCallbackHandler,
};
