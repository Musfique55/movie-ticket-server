import { catchAsync } from "@/helper/catchAsync";
import { ticketServices } from "./ticket.services";
import { sendResponse } from "@/helper/sendResponse";
import { Request, Response } from "express";

const confirmReservation = catchAsync(async (req: Request, res: Response) => {
  const result = await ticketServices.confirmReservation(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Reservation confirmed successfully",
    data: result,
  });
});

export const ticketController = {
  confirmReservation,
};
