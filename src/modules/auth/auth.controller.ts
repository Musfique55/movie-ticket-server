import { catchAsync } from "@/helper/catchAsync";
import { authServices } from "./auth.services";
import { Request, Response } from "express";
import { cookieUtils } from "@/utils/cookieUtils";
import { IRequestUser } from "@/middleware/auth";
import { sendResponse } from "@/helper/sendResponse";
import AppError from "@/helper/AppError";
import { envVars } from "@/config/envVars";
import { oauthClient } from "@/config/oAuth";

const login = catchAsync(async (req: Request, res: Response) => {
  const ip =
    (req.headers["x-forwarded-for"] as string)?.split(",")[0] || req.ip || "";
  const userAgent = req.headers["user-agent"] || "";
  const info = { ip, userAgent };
  const result = await authServices.login(req.body, info);
  cookieUtils.setAccessToken(res, result.accessToken);
  cookieUtils.setRefreshToken(res, result.refreshToken);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Login successful",
    data: result,
  });
});

const register = catchAsync(async (req: Request, res: Response) => {
  const result = await authServices.register(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Registration successful",
    data: result,
  });
});

const getMe = catchAsync(async (req: Request, res: Response) => {
  const result = await authServices.getMe(req.user as IRequestUser);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User profile fetched successfully",
    data: result,
  });
});

const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  await authServices.verifyEmail(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Email verified successfully",
  });
});

const resendVerificationCode = catchAsync(
  async (req: Request, res: Response) => {
    await authServices.resendVerificationCode(req.body.email);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Verification code sent successfully",
    });
  },
);

const getRefreshedToken = catchAsync(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    throw new AppError("Unauthorized", 401);
  }
  const result = await authServices.getRefreshedToken(refreshToken);
  cookieUtils.setAccessToken(res, result.accessToken);
  cookieUtils.setRefreshToken(res, result.refreshToken);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Token refreshed successfully",
    data: result,
  });
});

const googleLogin = catchAsync(async (req: Request, res: Response) => {
  const url = oauthClient.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: ["email", "profile"],
    redirect_uri: envVars.googleRedirectUrl,
  });

  sendResponse(res, {
    statusCode: 301,
    success: true,
    message: "Redirecting to Google",
    data: { url },
  });
});

const handleGoogleCallback = catchAsync(async (req: Request, res: Response) => {
  const { code, error } = req.query;

  if (error) {
    return res.redirect(`${envVars.frontendUrl}/login?error=${error}`);
  }

  if (!code) {
    return res.redirect(
      `${envVars.frontendUrl}/login?error=Google authentication failed`,
    );
  }

  const ip =
    (req.headers["x-forwarded-for"] as string)?.split(",")[0] || req.ip || "";
  const userAgent = req.headers["user-agent"] || "";
  const info = { ip, userAgent };

  const result = await authServices.googleCallbackHandler(code as string, info);
  cookieUtils.setAccessToken(res, result.accessToken);
  cookieUtils.setRefreshToken(res, result.refreshToken);
  res.redirect(`${envVars.frontendUrl}/profile`);
});

export const authController = {
  login,
  register,
  getMe,
  verifyEmail,
  resendVerificationCode,
  getRefreshedToken,
  googleLogin,
  handleGoogleCallback,
};
