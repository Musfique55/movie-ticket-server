import { catchAsync } from "@/helper/catchAsync";
import { NextFunction, Request, Response } from "express";
import { ReservationServices } from "./reservation.services";
import { sendResponse } from "@/helper/sendResponse";
import { sendToDelayQueue } from "@/lib/queue";

const createReservation = catchAsync(async (req: Request, res: Response) => {
  const result = await ReservationServices.createReservation(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Reservation created successfully",
    data: result,
  });

  const ttlMs = Math.max(
    1000,
    new Date(result.reservation.expiresAt).getTime() - Date.now(),
  );
  console.log("ttl", ttlMs);

  // Publish event to RabbitMQ
  await sendToDelayQueue(
    "reservation_delay_queue",
    "reservation_delay_exchange",
    "reservation_cancel_exchange",
    "reservation_cancel_routing_key",
    JSON.stringify({
      reservationId: result.reservation.reservationId,
      showTimeId: result.showTimeId,
    }),
    ttlMs,
  );
});

export const ReservationController = {
  createReservation,
};
