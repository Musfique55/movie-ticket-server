import { Response } from "express";

interface DataType<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
}

export const sendResponse = <T>(res: Response, obj: DataType<T>) => {
  res.status(obj.statusCode).json({
    success: obj.success,
    statusCode: obj.statusCode,
    message: obj.message,
    data: obj.data,
  });
};
