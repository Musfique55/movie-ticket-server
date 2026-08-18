import { catchAsync } from "@/helper/catchAsync";
import { sendResponse } from "@/helper/sendResponse";
import { showTimeServices } from "./showTime.services";
import { Request, Response } from "express";

const createShowTime = catchAsync(async (req: Request, res: Response) => {
  const { startTime, endTime, movieId } = req.body;

  const result = await showTimeServices.createShowTime({
    startTime,
    endTime,
    movieId,
  });

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Showtime created successfully",
    data: result,
  });
});

const getAllShowTimes = catchAsync(async (req: Request, res: Response) => {
  const result = await showTimeServices.getAllShowTimes();

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Showtime retrieved successfully",
    data: result,
  });
});

const getShowTimeById = catchAsync(async (req: Request, res: Response) => {
  const result = await showTimeServices.getShowTimeById(
    req.params.id as string,
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Showtime retrieved successfully",
    data: result,
  });
});

const updateShowTime = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { startTime, endTime } = req.body;

  const result = await showTimeServices.updateShowTime(id as string, {
    startTime,
    endTime,
  });

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Showtime updated successfully",
    data: result,
  });
});

const deleteShowTime = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await showTimeServices.deleteShowTime(id as string);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Showtime deleted successfully",
    data: result,
  });
});

export const ShowTimeController = {
  createShowTime,
  getAllShowTimes,
  getShowTimeById,
  updateShowTime,
  deleteShowTime,
};
