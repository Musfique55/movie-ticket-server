import { catchAsync } from "@/helper/catchAsync";
import { SeatServices } from "./seat.services";
import { sendResponse } from "@/helper/sendResponse";
import { Request, Response } from "express";

const createSeat = catchAsync(async (req: Request, res: Response) => {
  const result = await SeatServices.createSeat(req.body);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Seat created successfully",
    data: result,
  });
});

export const SeatController = {
  createSeat,
};
