import { SeatStatus, SeatType } from "@/generated/prisma/client";
import z from "zod";

export const createSeatDTO = z
  .array(
    z.object({
      row: z.string(),
      number: z.number(),
      basePrice: z.number(),
      type: z.nativeEnum(SeatType),
      status: z.nativeEnum(SeatStatus).default(SeatStatus.AVAILABLE),
    }),
  )
  .superRefine((data, ctx) => {
    if (data.length === 0)
      ctx.addIssue({
        code: "custom",
        message: "At least one seat is required",
      });

    data.map((seat) => {
      if (!seat.type || !Object.values(SeatType).includes(seat.type)) {
        ctx.addIssue({
          code: "custom",
          message: `Seat type is invalid for ${seat.row} - ${seat.number}`,
        });
      }
      if (seat.basePrice <= 0) {
        ctx.addIssue({
          code: "custom",
          message: `Base price must be greater than 0 for ${seat.row} - ${seat.number}`,
        });
      }
      if (seat.number <= 0) {
        ctx.addIssue({
          code: "custom",
          message: `Number must be greater than 0 for ${seat.row} - ${seat.number}`,
        });
      }
      if (seat.row.length !== 1) {
        ctx.addIssue({
          code: "custom",
          message: `Row must be a single character for ${seat.row} - ${seat.number}`,
        });
      }
      if (seat.row.charCodeAt(0) < 65 || seat.row.charCodeAt(0) > 90) {
        ctx.addIssue({
          code: "custom",
          message: `Row must be an uppercase letter for ${seat.row} - ${seat.number}`,
        });
      }
    });
  });

export const updateSeatDTO = createSeatDTO.element.partial();

export type CreateSeatDTO = z.infer<typeof createSeatDTO>;
export type UpdateSeatDTO = z.infer<typeof updateSeatDTO>;
