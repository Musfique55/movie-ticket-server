import { catchAsync } from "@/helper/catchAsync";
import { Request, Response } from "express";
import { HallServices } from "./hall.services";
import { sendResponse } from "@/helper/sendResponse";

const createHall = catchAsync(async (req: Request, res: Response) => {
  const result = await HallServices.createHall(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Hall created successfully",
    data: result,
  });
});

const updateHall = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await HallServices.updateHall(id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Hall updated successfully",
    data: result,
  });
});

const deleteHall = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await HallServices.deleteHall(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Hall deleted successfully",
    data: result,
  });
});

const getHall = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await HallServices.getHall(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Hall fetched successfully",
    data: result,
  });
});

const getAllHall = catchAsync(async (req: Request, res: Response) => {
  const result = await HallServices.getAllHall();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Halls fetched successfully",
    data: result,
  });
});

export const HallController = {
  createHall,
  updateHall,
  deleteHall,
  getHall,
  getAllHall,
};
