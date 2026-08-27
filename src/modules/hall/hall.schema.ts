import z from "zod";

export const createHallDTO = z.object({
  name: z.string(),
  theatreId: z.string(),
});

export type createHallDTO = z.infer<typeof createHallDTO>;

export const updateHallDTO = z.object({
  name: z.string(),
});

export type updateHallDTO = z.infer<typeof updateHallDTO>;
