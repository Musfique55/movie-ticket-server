import { catchAsync } from "@/helper/catchAsync";
import { NextFunction, Request, Response } from "express";
import { ReservationServices } from "./reservation.services";
import { sendResponse } from "@/helper/sendResponse";
import { showTimeServices } from "../showTime/showTime.services";
import { seatEmitter } from "@/lib/seatEmitter";
import { sendToQueue } from "@/lib/queue";

const createReservation = catchAsync(async (req: Request, res: Response) => {
  const result = await ReservationServices.createReservation(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Reservation created successfully",
    data: result,
  });

  console.log("after res");

  // Publish event to RabbitMQ
  await sendToQueue(
    "reservation_queue",
    "reservation_exchange",
    JSON.stringify({
      reservationId: result.reservation.reservationId,
      expiresAt: result.reservation.expiresAt,
    }),
  );
});

export const ReservationController = {
  createReservation,
};
