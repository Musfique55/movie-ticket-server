import z from "zod";

export const createTheatreDTO = z.object({
  name: z.string(),
  location: z.string(),
  city: z.string(),
});

export const updateTheatreDTO = createTheatreDTO.partial();

export type createTheatreDTO = z.infer<typeof createTheatreDTO>;
export type updateTheatreDTO = z.infer<typeof updateTheatreDTO>;
