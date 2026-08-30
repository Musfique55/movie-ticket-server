import { Router } from "express";
import { authController } from "./auth.controller";
import { requestValidator } from "@/middleware/requestValidator";
import { createUserDTO, loginUserDTO, verifyEmailDTO } from "./auth.schema";
import { auth } from "@/middleware/auth";
import { Role } from "@/generated/prisma/client";

const router = Router();

router.post(
  "/signup",
  requestValidator(createUserDTO),
  authController.register,
);
router.post("/signin", requestValidator(loginUserDTO), authController.login);

router.get("/me", auth(Role.USER, Role.ADMIN), authController.getMe);

router.post(
  "/verify-email",
  requestValidator(verifyEmailDTO),
  authController.verifyEmail,
);

export const authRoutes = router;
