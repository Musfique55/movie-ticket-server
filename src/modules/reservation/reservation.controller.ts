import { catchAsync } from "@/helper/catchAsync";
import { NextFunction, Request, Response } from "express";
import { ReservationServices } from "./reservation.services";
import { sendResponse } from "@/helper/sendResponse";
import { generateTicketPDF } from "@/helper/generateTicketPDF";
import { sendEmail } from "@/utils/sendEmail";

const createReservation = catchAsync(async (req: Request, res: Response) => {
  const result = await ReservationServices.createReservation(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Reservation created successfully",
    data: result,
  });
});

const confirmReservation = catchAsync(async (req: Request, res: Response) => {
  const result = await ReservationServices.confirmReservation(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Reservation confirmed successfully",
    data: result,
  });

  // await generateTicketPDF({
  //   reservationId: result.reservation.id,
  //   userName: result.userName,
  //   totalAmount: result.reservation.totalAmount,
  //   discount: result.reservation.discount,
  //   confirmedAt: result.reservation.updatedAt,
  //   tickets: result.tickets,
  // }).catch((err) => {
  //   console.error("Failed to generate ticket PDF:", err);
  // });

  // await sendEmail({
  //   to: req.body.email,
  //   subject: "Ticket",
  //   attachment: ticket!,
  // }).catch((err) => {
  //   console.error("Failed to send email:", err);
  // });
});

export const ReservationController = {
  createReservation,
  confirmReservation,
};
