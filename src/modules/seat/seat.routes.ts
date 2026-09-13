import { Router } from "express";
import { SeatController } from "./seat.controller";
import { requestValidator } from "@/middleware/requestValidator";
import { createSeatDTO, updateSeatDTO } from "./seat.schema";
import { auth } from "@/middleware/auth";
import { Role } from "@/generated/prisma/client";

const router = Router();

router.post("/",auth(Role.ADMIN), requestValidator(createSeatDTO), SeatController.createSeat);
router.get("/",auth(Role.ADMIN), SeatController.getAllSeats);
router.get("/:id",auth(Role.ADMIN), SeatController.getSeatById);
router.patch(
  "/:id",
  auth(Role.ADMIN),
  requestValidator(updateSeatDTO),
  SeatController.updateSeat,
);
router.delete("/:id",auth(Role.ADMIN), SeatController.deleteSeat);

export const SeatRoutes = router;
