import { envVars } from "@/config/envVars";
import jwt from "jsonwebtoken";

const generateAccessToken = (payload: Record<string, unknown>) => {
  return jwt.sign(payload, envVars.jwtSecret, {
    expiresIn: envVars.accessTokenExpiresIn as jwt.SignOptions["expiresIn"],
  });
};

const generateRefreshToken = (payload: Record<string, unknown>) => {
  return jwt.sign(payload, envVars.jwtSecret, {
    expiresIn: envVars.refreshTokenExpiresIn as jwt.SignOptions["expiresIn"],
  });
};

const verifyToken = (token: string) => {
  try {
    const success = jwt.verify(token, envVars.jwtSecret);
    return {
      success: true,
      data: success,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
    };
  }
};

export const jwtUtils = {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
};
