import z from "zod";

export const createReservationDTO = z.object({
  userId: z.string(),
  discount: z.number().optional(),
  seatIds: z.array(z.string(), {
    error: "Seat IDs must be an array of strings",
  }),
  showTimeId: z.string(),
});

export type CreateReservationDTO = z.infer<typeof createReservationDTO>;
