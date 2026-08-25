import { NextFunction, Request, Response } from "express";
import { sendResponse } from "@/helper/sendResponse";

export const notFound = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  sendResponse(res, {
    message: `${req.originalUrl} not found`,
    statusCode: res.statusCode || 404,
    success: false,
  });
  next();
};
