import z from "zod";

export const createShowTimeDTO = z.object({
  movieId: z.string(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
});

export const updateShowTimeDTO = z.object({
  startTime: z.coerce.date().optional(),
  endTime: z.coerce.date().optional(),
});

export type ShowTimeDTO = z.infer<typeof createShowTimeDTO>;
export type UpdateShowTimeDTO = z.infer<typeof updateShowTimeDTO>;
