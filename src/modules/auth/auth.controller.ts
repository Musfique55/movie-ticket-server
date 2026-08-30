import { catchAsync } from "@/helper/catchAsync";
import { authServices } from "./auth.services";
import { Request, Response } from "express";
import { cookieUtils } from "@/utils/cookieUtils";
import { IRequestUser } from "@/middleware/auth";

const login = catchAsync(async (req: Request, res: Response) => {
  const ip = req.ip || "";
  const userAgent = req.headers["user-agent"] || "";
  const info = { ip, userAgent };
  const result = await authServices.login(req.body, info);
  cookieUtils.setAccessToken(res, result.accessToken);
  cookieUtils.setRefreshToken(res, result.refreshToken);
  res.status(200).json({
    success: true,
    message: "Login successful",
    data: result,
  });
});

const register = catchAsync(async (req: Request, res: Response) => {
  const result = await authServices.register(req.body);
  res.status(200).json({
    success: true,
    message: "Registration successful",
    data: result,
  });
});

const getMe = catchAsync(async (req: Request, res: Response) => {
  const result = await authServices.getMe(req.user as IRequestUser);
  res.status(200).json({
    success: true,
    message: "User profile fetched successfully",
    data: result,
  });
});

const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  const result = await authServices.verifyEmail(req.body);
  res.status(200).json({
    success: true,
    message: "Email verified successfully",
    data: result,
  });
});

export const authController = {
  login,
  register,
  getMe,
  verifyEmail,
};
