import AppError from "@/helper/AppError";
import { generateTicketPDF } from "@/helper/generateTicketPDF";
import { receiveFromQueue, sendToQueue } from "@/lib/queue";
import { sendEmail } from "@/utils/sendEmail";
import { ReservationServices } from "./reservation.services";

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
        html: `<p>Ticket booking confirmation</p>`,
      }).catch((err) => {
        if (!(err instanceof AppError)) {
          sendToQueue(
            "ticket_booking_confirmation_email_queue",
            "ticket_booking_confirmation_email_exchange",
            JSON.stringify(message),
          );
        }
        console.log(err);
      });
    },
  );
};

const initReservationCancelConsumer = async () => {
  await receiveFromQueue(
    "reservation_cancel_queue",
    "reservation_cancel_exchange",
    "reservation_cancel_routing_key",
    async (message: { reservationId: string; showTimeId: string }) => {
      await ReservationServices.cancelExpiredReservation(
        message.reservationId,
        message.showTimeId,
      ).catch((err) => {
        if (!(err instanceof AppError)) {
          sendToQueue(
            "reservation_cancel_queue",
            "reservation_cancel_exchange",
            JSON.stringify(message),
          );
        }
        console.log(err);
      });
    },
  );
};

try {
  initTicketBookingConfirmationPdfConsumer();
  initReservationCancelConsumer();
} catch (error: any) {
  console.warn(
    "⚠️ RabbitMQ worker initialization skipped (running without queue consumer):",
    error.message,
  );
}
