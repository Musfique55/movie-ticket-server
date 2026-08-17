import { catchAsync } from "@/helper/catchAsync";
import { UserServices } from "./user.services";
import { sendResponse } from "@/helper/sendResponse";
import { Request, Response } from "express";

const createUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.userServices(req.body);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User created successfully",
    data: result,
  });
});

export const UserController = {
  createUser,
};
