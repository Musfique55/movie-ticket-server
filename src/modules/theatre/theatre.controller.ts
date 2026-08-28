import { catchAsync } from "@/helper/catchAsync";
import { theatreServices } from "./theatre.services";
import { Request, Response } from "express";
import { sendResponse } from "@/helper/sendResponse";

const createTheatre = catchAsync(async (req: Request, res: Response) => {
  const result = await theatreServices.createTheatre(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Theatre created successfully",
    data: result,
  });
});

const updateTheatre = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await theatreServices.updateTheatre(id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Theatre updated successfully",
    data: result,
  });
});

const deleteTheatre = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  await theatreServices.deleteTheatre(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Theatre deleted successfully",
  });
});

const getTheatreMovies = catchAsync(async (req: Request, res: Response) => {
  const theatreId = req.params.id as string;
  const result = await theatreServices.getTheatreMovies(theatreId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Fetched movie list",
    data: result,
  });
});
const getTheatreMovieDetails = catchAsync(
  async (req: Request, res: Response) => {
    const { id, movieId } = req.params;
    const result = await theatreServices.getTheatreMovieDetails(
      id as string,
      movieId as string,
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Fetched movie details",
      data: result,
    });
  },
);

export const theatreController = {
  createTheatre,
  updateTheatre,
  deleteTheatre,
  getTheatreMovieDetails,
  getTheatreMovies,
};
