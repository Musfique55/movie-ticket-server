import { Response } from "express";

const setAccessToken = (res: Response, token: string) => {
  res.cookie("accessToken", token, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 15 * 60 * 1000,
  });
};

const setRefreshToken = (res: Response, token: string) => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const cookieUtils = {
  setAccessToken,
  setRefreshToken,
};
