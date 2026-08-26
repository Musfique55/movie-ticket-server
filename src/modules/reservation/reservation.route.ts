import { Router } from "express";
import { ReservationController } from "./reservation.controller";
import { requestValidator } from "@/middleware/requestValidator";
import { createReservationDTO } from "./reservation.schema";

const router = Router();

router.post(
  "/",
  requestValidator(createReservationDTO),
  ReservationController.createReservation,
);

export const reservationRoutes = router;
