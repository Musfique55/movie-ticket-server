import { catchAsync } from "@/helper/catchAsync";
import { SeatServices } from "./seat.services";
import { sendResponse } from "@/helper/sendResponse";
import { Request, Response } from "express";

const createSeat = catchAsync(async (req: Request, res: Response) => {
  const result = await SeatServices.createSeat(req.body);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Seat created successfully",
    data: result,
  });
});

const getAllSeats = catchAsync(async (req: Request, res: Response) => {
  const result = await SeatServices.getAllSeats();
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Seats fetched successfully",
    data: result,
  });
});

const updateSeat = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await SeatServices.updateSeat(id as string, req.body);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Seat updated successfully",
    data: result,
  });
});

const deleteSeat = catchAsync(async (req: Request, res: Response) => {
  const result = await SeatServices.deleteSeat(req.params.id as string);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Seat deleted successfully",
    data: result,
  });
});

const getSeatById = catchAsync(async (req: Request, res: Response) => {
  const result = await SeatServices.getSeatById(req.params.id as string);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Seat fetched successfully",
    data: result,
  });
});

export const SeatController = {
  createSeat,
  getAllSeats,
  updateSeat,
  deleteSeat,
  getSeatById,
};
