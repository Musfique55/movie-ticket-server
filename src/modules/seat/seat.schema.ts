import { SeatStatus, SeatType } from "@/generated/prisma/client";
import z from "zod";

export const createSeatDTO = z
  .array(
    z.object({
      name: z.string(),
      rowPosition: z.string(),
      columnPosition: z.number(),
      basePrice: z.number(),
      type: z.nativeEnum(SeatType),
      status: z.nativeEnum(SeatStatus).default(SeatStatus.AVAILABLE),
      theatreId: z.string(),
      hallId: z.string(),
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
          message: `Seat type is invalid for ${seat.rowPosition} - ${seat.columnPosition}`,
        });
      }
      if (seat.basePrice <= 0) {
        ctx.addIssue({
          code: "custom",
          message: `Base price must be greater than 0 for ${seat.rowPosition} - ${seat.columnPosition}`,
        });
      }
      if (seat.columnPosition <= 0) {
        ctx.addIssue({
          code: "custom",
          message: `Number must be greater than 0 for ${seat.rowPosition} - ${seat.columnPosition}`,
        });
      }
      // if (seat.rowPosition.length !== 1) {
      //   ctx.addIssue({
      //     code: "custom",
      //     message: `Row must be a single character for ${seat.rowPosition} - ${seat.columnPosition}`,
      //   });
      // }
      // if (
      //   seat.rowPosition.charCodeAt(0) < 65 ||
      //   seat.rowPosition.charCodeAt(0) > 90
      // ) {
      //   ctx.addIssue({
      //     code: "custom",
      //     message: `Row must be an uppercase letter for ${seat.rowPosition} - ${seat.columnPosition}`,
      //   });
      // }
    });
  });

export const updateSeatDTO = createSeatDTO.element.partial();

export type TCreateSeatDTO = z.infer<typeof createSeatDTO.element>;
export type TUpdateSeatDTO = z.infer<typeof updateSeatDTO>;
