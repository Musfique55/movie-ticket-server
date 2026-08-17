import { NextFunction, Request, Response } from "express";
import AppError from "@/helper/AppError";
import { ZodError } from "zod";

export const globalErrorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  let statusCode = 500;
  let message = "Something went wrong!";
  let errors = [
    {
      path: "",
      message: err.message,
    },
  ];

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = [
      {
        path: "",
        message: err.message,
      },
    ];
  } else if (err instanceof ZodError) {
    statusCode = 400;
    message = err.issues.map((issue) => issue.message).join(", ");
    console.log(err);
    errors = err.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    }));
  } else if (err instanceof Error) {
    statusCode = 500;
    message = err.message;
    errors = [
      {
        path: "",
        message: err.message,
      },
    ];
  }

  const errorResponse = {
    success: false,
    message,
    errors,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  };

  res.status(statusCode).json(errorResponse);
};
