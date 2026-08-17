import AppError from "@/helper/AppError";
import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const requestValidator = (schema: ZodSchema) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsedBody = schema.safeParse(req.body);

      if (!parsedBody.success) {
        const message = parsedBody.error.issues
          .map((issue) => issue.message)
          .join(", ");
        throw new AppError(message, 400);
      }

      req.body = parsedBody.data;

      next();
    } catch (error: any) {
      throw new AppError(error.message, 400);
    }
  };
};
