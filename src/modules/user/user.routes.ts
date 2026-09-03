import { Router } from "express";
import { UserController } from "./user.controller";
import { auth } from "@/middleware/auth";
import { Role } from "@/generated/prisma/client";

const router = Router();

router.get("/", auth(Role.ADMIN), UserController.getUsers);
router.get("/:id", auth(Role.ADMIN), UserController.getUserById);

export const UserRoutes = router;
