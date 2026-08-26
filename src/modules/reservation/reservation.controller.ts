import { catchAsync } from "@/helper/catchAsync";
import { NextFunction, Request, Response } from "express";
import { ReservationServices } from "./reservation.services";
import { sendResponse } from "@/helper/sendResponse";

const createReservation = catchAsync(async (req: Request, res: Response) => {
  const result = await ReservationServices.createReservation(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Reservation created successfully",
    data: result,
  });
});

export const ReservationController = {
  createReservation,
};
