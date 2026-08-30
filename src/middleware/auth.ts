import AppError from "@/helper/AppError";
import { jwtUtils } from "@/utils/jwtUtils";
import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
        emailVerified: boolean;
      };
    }
  }
}

export interface IRequestUser {
  id: string;
  email: string;
  role: string;
  emailVerified: boolean;
}

export const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.cookies.accessToken;

      if (!accessToken) {
        throw new AppError("Unauthorized", 401);
      }

      const decodedToken = jwtUtils.verifyToken(accessToken);
      if (!decodedToken.success) {
        throw new AppError("Unauthorized", 401);
      }

      const verifiedToken = decodedToken.data as JwtPayload;

      if (roles.length > 0 && !roles.includes(verifiedToken.role)) {
        throw new AppError("Forbidden access", 403);
      }

      if (!verifiedToken.emailVerified) {
        throw new AppError("Unauthorized", 401);
      }

      req.user = {
        id: verifiedToken.id,
        email: verifiedToken.email,
        role: verifiedToken.role,
        emailVerified: verifiedToken.emailVerified,
      };

      next();
    } catch (error) {
      next(error);
    }
  };
};
