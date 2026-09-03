import { catchAsync } from "@/helper/catchAsync";
import { UserServices } from "./user.services";
import { sendResponse } from "@/helper/sendResponse";
import { Request, Response } from "express";

const getUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.getUsers();
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Users fetched successfully",
    data: result,
  });
});

const getUserById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await UserServices.getUserById(id as string);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User fetched successfully",
    data: result,
  });
});

export const UserController = {
  getUsers,
  getUserById,
};
