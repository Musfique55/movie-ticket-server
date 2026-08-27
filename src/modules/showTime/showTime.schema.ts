import z from "zod";

export const createShowTimeDTO = z.object({
  movieId: z.string(),
  startTime: z.coerce.date(),
  hallId: z.string(),
});

export const updateShowTimeDTO = z.object({
  startTime: z.coerce.date().optional(),
  hallId: z.string().optional(),
});

export type ShowTimeDTO = z.infer<typeof createShowTimeDTO>;
export type UpdateShowTimeDTO = z.infer<typeof updateShowTimeDTO>;
