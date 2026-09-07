import { catchAsync } from "@/helper/catchAsync";
import { sendResponse } from "@/helper/sendResponse";
import { showTimeServices } from "./showTime.services";
import { Request, Response } from "express";
import { seatEmitter } from "@/lib/seatEmitter";

const createShowTime = catchAsync(async (req: Request, res: Response) => {
  const { startTime, movieId, hallId, theatreId } = req.body;

  const result = await showTimeServices.createShowTime({
    startTime,
    movieId,
    hallId,
    theatreId,
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
  const { startTime } = req.body;

  const result = await showTimeServices.updateShowTime(id as string, {
    startTime,
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

const getEventSeats = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  res.write(`data: ${JSON.stringify({ status: "connected" })}\n\n`);

  // send seat availability
  const initialData = await showTimeServices.getShowTimeById(id as string);

  res.write(`data: ${JSON.stringify(initialData)}\n\n`);

  const onSeatUpdate = (data: any) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  seatEmitter.on(`seatUpdate:${id}`, onSeatUpdate);

  req.on("close", () => {
    seatEmitter.off(`seatUpdate:${id}`, onSeatUpdate);
  });
});

export const ShowTimeController = {
  createShowTime,
  getAllShowTimes,
  getShowTimeById,
  updateShowTime,
  deleteShowTime,
  getEventSeats,
};
