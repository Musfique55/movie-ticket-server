import z from "zod";

export const createReservationDTO = z.object({
  userId: z.string(),
  discount: z.number().optional(),
  seatIds: z.array(z.string(), {
    error: "Seat IDs must be an array of strings",
  }),
  showTimeId: z.string(),
});

export const confirmReservationDTO = z.object({
  reservationId: z.string(),
  email: z.string().email(),
  name: z.string(),
  seatIds: z.array(z.string()).min(1),
});

export type CreateReservationDTO = z.infer<typeof createReservationDTO>;

export type confirmReservationDTO = z.infer<typeof confirmReservationDTO>;
