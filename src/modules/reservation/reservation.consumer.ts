import redisClient from "@/config/redis";
import AppError from "@/helper/AppError";
import { generateTicketPDF } from "@/helper/generateTicketPDF";
import { receiveFromQueue } from "@/lib/queue";
import { sendEmail } from "@/utils/sendEmail";

const initReservationConsumer = async () => {
  await receiveFromQueue(
    "reservation_queue",
    "reservation_exchange",
    "reservation_queue",
    async (message: { reservationId: string; expiresAt: string | Date }) => {
      const key = `lock:reservation:${message.reservationId}`;
      const ttlSeconds = Math.max(
        1,
        Math.floor((new Date(message.expiresAt).getTime() - Date.now()) / 1000),
      );
      await redisClient.set(key, JSON.stringify(message), "EX", ttlSeconds);
    },
  );
};

const initTicketBookingConfirmationPdfConsumer = async () => {
  await receiveFromQueue(
    "ticket_booking_confirmation_email_queue",
    "ticket_booking_confirmation_email_exchange",
    "ticket_booking_confirmation_email_queue",
    async (message: {
      reservationId: string;
      userName: string;
      email: string;
      totalAmount: number;
      discount: number;
      confirmedAt: Date | string;
      tickets: {
        name: string;
        rowPosition: string;
        columnPosition: number;
        seatType: string;
        price: number;
      }[];
    }) => {
      const ticket = await generateTicketPDF(message).catch((err) => {
        throw new AppError(
          err.message || "Failed to generate ticket PDF:",
          500,
        );
      });

      if (!ticket) {
        throw new AppError("Failed to generate ticket PDF", 500);
      }

      await sendEmail({
        to: message.email,
        subject: "Ticket Booking Confirmation",
        attachment: ticket,
      }).catch((err) => {
        console.log(err);
        throw new AppError(err.message || "Failed to send email", 500);
      });
    },
  );
};

try {
  initReservationConsumer();
  initTicketBookingConfirmationPdfConsumer();
} catch (error: any) {
  console.warn(
    "⚠️ RabbitMQ worker initialization skipped (running without queue consumer):",
    error.message,
  );
}
