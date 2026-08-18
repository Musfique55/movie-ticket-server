import z from "zod";

export const createTicketDTO = z.object({
  reservationId: z.string(),
  seatIds: z.array(z.string()).min(1),
});

export type createTicketDTO = z.infer<typeof createTicketDTO>;
