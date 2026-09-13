import { Router } from "express";
import { HallController } from "./hall.controller";
import { createHallDTO, updateHallDTO } from "./hall.schema";
import { requestValidator } from "@/middleware/requestValidator";
import { auth } from "@/middleware/auth";
import { Role } from "@/generated/prisma/client";

const router = Router();

router.post("/",auth(Role.ADMIN), requestValidator(createHallDTO), HallController.createHall);
router.patch(
  "/:id",
  auth(Role.ADMIN),
  requestValidator(updateHallDTO),
  HallController.updateHall,
);
router.delete("/:id",auth(Role.ADMIN), HallController.deleteHall);
router.get("/:id",auth(Role.ADMIN), HallController.getHall);
router.get("/",auth(Role.ADMIN), HallController.getAllHall);

export const hallRoutes = router;
