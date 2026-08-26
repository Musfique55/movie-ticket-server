import { z } from "zod";

export const createCheckoutSessionDTO = z.object({
  reservationId: z.string({
    error: "Reservation ID is required",
  }),
  seatIds: z
    .array(z.string(), {
      error: "Seat IDs must be an array of strings",
    })
    .min(1, "At least one seat ID is required"),
  email: z
    .string({
      error: "Email is required",
    })
    .email("Invalid email address"),
});

export type CreateCheckoutSessionDTO = z.infer<
  typeof createCheckoutSessionDTO
>;
