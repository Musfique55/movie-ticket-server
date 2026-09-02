import redisClient from "@/config/redis";
import { envVars } from "@/config/envVars";
import { stripe } from "@/config/stripe";
import {
  PaymentStatus,
  ReservationStatus,
  ShowSeatStatus,
} from "@/generated/prisma/client";
import AppError from "@/helper/AppError";
import { prisma } from "@/lib/prisma";
import { sendToQueue } from "@/lib/queue";
import Stripe from "stripe";
import { CreateCheckoutSessionDTO } from "./payment.schema";
import { showTimeServices } from "../showTime/showTime.services";
import { seatEmitter } from "@/lib/seatEmitter";

const createCheckoutSession = async (payload: CreateCheckoutSessionDTO) => {
  const { reservationId, email, showTimeId, name } = payload;

  const reservation = await prisma.reservation.findUnique({
    where: { id: reservationId },
    include: {
      user: {
        select: { authUser: { select: { id: true, name: true, email: true } } },
      },
      showSeats: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!reservation) {
    throw new AppError("Reservation not found", 404);
  }

  if (reservation.status !== ReservationStatus.PENDING) {
    throw new AppError("Reservation is not in pending state", 400);
  }

  if (reservation.expiresAt && reservation.expiresAt < new Date()) {
    throw new AppError("Reservation has expired", 400);
  }

  const seatIds = reservation.showSeats.map((seat) => seat.id);

  const showSeats = await prisma.showSeat.findMany({
    where: {
      id: { in: seatIds },
      status: ShowSeatStatus.LOCKED,
      reservationId,
    },
    select: {
      id: true,
      showTimeId: true,
      seat: {
        select: {
          rowPosition: true,
          columnPosition: true,
          type: true,
          basePrice: true,
        },
      },
    },
  });

  if (showSeats.length !== seatIds.length) {
    throw new AppError(
      "One or more selected seats are no longer locked or available",
      400,
    );
  }

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
    showSeats.map((s) => ({
      price_data: {
        currency: "bdt",
        product_data: {
          name: `Ticket - Row ${s.seat.rowPosition}, Seat ${s.seat.columnPosition} (${s.seat.type})`,
          description: `ShowTime ID: ${s.showTimeId}`,
        },
        unit_amount: Math.round(s.seat.basePrice * 100),
      },
      quantity: 1,
    }));

  const session = await stripe.checkout.sessions.create(
    {
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      customer_email: email,
      success_url: `${envVars.frontendUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${envVars.frontendUrl}/payment/cancel`,
      metadata: {
        reservationId: reservation.id,
        seatIds: JSON.stringify(seatIds),
        userId: reservation?.userId,
        email: email,
        name,
        showTimeId,
      },
    },
    {
      idempotencyKey: `checkout_session_${reservation.id}`,
    },
  );

  return {
    checkoutUrl: session.url,
    sessionId: session.id,
  };
};

const processPaymentSuccess = async (
  stripeEventId: string,
  data: {
    reservationId: string;
    seatIds: string[] | string;
    userId: string;
    email: string;
    name: string;
    showTimeId: string;
  },
  amount: number,
  transactionId: string,
  gatewayData: any,
  invoiceUrl: string | null,
  paymentIntentId?: string | null,
) => {
  const seatIds: string[] =
    typeof data.seatIds === "string" ? JSON.parse(data.seatIds) : data.seatIds;

  try {
    const result = await prisma.$transaction(async (tx) => {
      const reservation = await tx.reservation.findUnique({
        where: { id: data.reservationId },
        include: {
          user: { select: { authUser: { select: { name: true } } } },
        },
      });

      if (!reservation) {
        throw new AppError("Reservation not found", 404);
      }

      if (
        reservation.status !== "PENDING" ||
        (reservation.expiresAt && reservation.expiresAt < new Date())
      ) {
        throw new AppError("RESERVATION_EXPIRED", 400);
      }

      const showSeats = await tx.showSeat.findMany({
        where: {
          id: { in: seatIds },
          status: ShowSeatStatus.LOCKED,
        },
        select: {
          id: true,
          showTimeId: true,
          seat: {
            select: {
              name: true,
              rowPosition: true,
              columnPosition: true,
              type: true,
              basePrice: true,
            },
          },
        },
      });

      if (showSeats.length !== seatIds.length) {
        throw new AppError("SEATS_NO_LONGER_AVAILABLE", 400);
      }

      const showTimeId = showSeats[0]!.showTimeId;

      const updatedReservation = await tx.reservation.update({
        where: {
          id: data.reservationId,
        },
        data: { status: ReservationStatus.CONFIRMED },
      });

      await tx.showSeat.updateMany({
        where: {
          id: { in: seatIds },
          status: ShowSeatStatus.LOCKED,
          showTimeId,
        },
        data: {
          status: ShowSeatStatus.BOOKED,
        },
      });

      const tickets = showSeats.map((s) => ({
        reservationId: data.reservationId,
        price: s.seat.basePrice,
      }));

      await tx.ticket.createMany({
        data: tickets,
      });

      await tx.payment.create({
        data: {
          amount,
          transactionId,
          status: PaymentStatus.PAID,
          stripeEventId,
          name: data.name,
          userId: data.userId,
          email: data.email,
          paymentGatewayData: gatewayData,
          invoiceUrl,
        },
      });

      const lockKeys = seatIds.map(
        (id) => `lock:showSeat:${showTimeId}:seat:${id}`,
      );

      await redisClient.del(lockKeys);

      const reservationKey = `lock:reservation:${data.reservationId}`;
      await redisClient.del(reservationKey);

      return {
        reservation: updatedReservation,
        userName: data.name,
        discount: reservation.discount,
        tickets: showSeats.map((s) => ({
          name: s.seat.name,
          rowPosition: s.seat.rowPosition,
          columnPosition: s.seat.columnPosition,
          seatType: s.seat.type,
          price: s.seat.basePrice,
        })),
      };
    });

    const updatedShowTime = await showTimeServices.getShowTimeById(
      data.showTimeId,
    );
    seatEmitter.emit(`seatUpdate:${data.showTimeId}`, updatedShowTime);

    const pdfData = {
      reservationId: result.reservation.id,
      userName: data.name,
      email: data.email,
      totalAmount: Number(result.reservation.totalAmount),
      discount: Number(result.reservation.discount),
      confirmedAt: result.reservation.updatedAt,
      tickets: result.tickets,
    };

    await sendToQueue(
      "ticket_booking_confirmation_email_queue",
      "ticket_booking_confirmation_email_exchange",
      JSON.stringify(pdfData),
    );
  } catch (error: any) {
    if (
      (error.message === "RESERVATION_EXPIRED" ||
        error.message === "SEATS_NO_LONGER_AVAILABLE") &&
      paymentIntentId
    ) {
      console.log(
        `Reservation ${data.reservationId} expired/unavailable. Issuing full refund for paymentIntent: ${paymentIntentId}`,
      );
      await Promise.all([
        stripe.refunds.create({
          payment_intent: paymentIntentId,
        }),
        prisma.payment.upsert({
          where: {
            stripeEventId,
          },
          update: {
            status: PaymentStatus.FAILED,
          },
          create: {
            amount,
            transactionId,
            status: PaymentStatus.FAILED,
            stripeEventId,
            name: data.name,
            userId: data.userId,
            email: data.email,
            paymentGatewayData: {
              ...gatewayData,
              refundReason: error.message,
            },
            invoiceUrl,
          },
        }),
      ]);

      return;
    }
    throw error;
  }
};

const handlePaymentFulfillment = async (
  eventId: string,
  session: Stripe.Checkout.Session,
) => {
  const existing = await prisma.payment.findUnique({
    where: {
      stripeEventId: eventId,
    },
  });

  if (existing) {
    return;
  }

  const data = session.metadata as unknown as {
    reservationId: string;
    seatIds: string[];
    userId: string;
    email: string;
    name: string;
    showTimeId: string;
  };

  if (data?.reservationId) {
    await processPaymentSuccess(
      eventId,
      data,
      (session.amount_total || 0) / 100,
      (session.payment_intent as string) || session.id,
      session as any,
      session.url || null,
      session.payment_intent as string,
    );
  }
};

const stripeWebhook = async (event: Stripe.Event) => {
  try {
    const existing = await prisma.payment.findUnique({
      where: {
        stripeEventId: event.id,
      },
    });

    if (existing) {
      return;
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        // Delegate payment fulfillment task asynchronously to RabbitMQ queue worker
        await sendToQueue(
          "payment_fulfillment_queue",
          "payment_fulfillment_exchange",
          JSON.stringify({
            eventId: event.id,
            session,
          }),
        );
        break;
      }
      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;
        break;
      }
      case "checkout.session.async_payment_succeeded": {
        break;
      }
      case "charge.updated": {
        break;
      }
      default:
        break;
    }
  } catch (error) {
    throw error;
  }
};

export const paymentServices = {
  createCheckoutSession,
  handlePaymentFulfillment,
  stripeWebhook,
};
