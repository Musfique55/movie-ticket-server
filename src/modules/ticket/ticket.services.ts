import { ShowSeatStatus } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { createTicketDTO } from "./ticket.schema";

const confirmReservation = async (data: createTicketDTO) => {
  try {
    await prisma.$transaction(async (tx) => {
      const showSeats = await tx.showSeat.findMany({
        where: {
          id: { in: data.seatIds },
          status: ShowSeatStatus.LOCKED,
        },
        select: {
          id: true,
          seat: {
            select: {
              type: true,
              basePrice: true,
            },
          },
        },
      });

      const reservation = await tx.reservation.update({
        where: { id: data.reservationId },
        data: { status: "CONFIRMED" },
      });

      await tx.showSeat.updateMany({
        where: {
          id: { in: data.seatIds },
          status: ShowSeatStatus.LOCKED,
        },
        data: {
          status: ShowSeatStatus.BOOKED,
        },
      });

      const tickets = showSeats.map((s) => ({
        reservationId: data.reservationId,
        showSeatId: s.id,
        price: s.seat.basePrice,
      }));

      await tx.ticket.createMany({
        data: tickets,
      });

      return reservation;
    });
  } catch (error) {
    throw error;
  }
};

export const ticketServices = {
  confirmReservation,
};
