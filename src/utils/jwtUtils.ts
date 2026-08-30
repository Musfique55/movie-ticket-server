import jwt from "jsonwebtoken";
import { envVars } from "@/config/envVars";

const generateToken = (payload: Record<string, unknown>) => {
  return jwt.sign(payload, envVars.jwtSecret, {
    expiresIn: "15m",
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
  generateToken,
  verifyToken,
};
