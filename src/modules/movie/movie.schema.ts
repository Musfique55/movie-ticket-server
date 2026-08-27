import z from "zod";

export const createMovieDTO = z.object({
  name: z.string(),
  duration: z.string(),
});

export const updateMovieDTO = createMovieDTO.partial();

export type createMovieDTO = z.infer<typeof createMovieDTO>;
export type updateMovieDTO = z.infer<typeof updateMovieDTO>;
