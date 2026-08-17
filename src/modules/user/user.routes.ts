import { Router } from "express";
import { UserController } from "./user.controller";
import { requestValidator } from "@/middleware/requestValidator";
import { createUserDTO } from "./user.schema";

const router = Router();

router.post(
  "/signup",
  requestValidator(createUserDTO),
  UserController.createUser,
);

export const UserRoutes = router;
