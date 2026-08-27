import { catchAsync } from "@/helper/catchAsync";
import { Request, Response } from "express";
import { movieServices } from "./movie.services";
import { sendResponse } from "@/helper/sendResponse";

const createMovie = catchAsync(async (req: Request, res: Response) => {
  const result = await movieServices.createMovie(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Movie created successfully",
    data: result,
  });
});

const updateMovie = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await movieServices.updateMovie(id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Movie updated successfully",
    data: result,
  });
});

const deleteMovie = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  await movieServices.deleteMovie(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Movie deleted successfully",
  });
});

export const movieController = {
  createMovie,
  updateMovie,
  deleteMovie,
};
