import { Router } from "express";
import { ReservationController } from "./reservation.controller";
import { requestValidator } from "@/middleware/requestValidator";
import {
  confirmReservationDTO,
  createReservationDTO,
} from "./reservation.schema";

const router = Router();

router.post(
  "/",
  requestValidator(createReservationDTO),
  ReservationController.createReservation,
);

router.post(
  "/confirm",
  requestValidator(confirmReservationDTO),
  ReservationController.confirmReservation,
);

export const reservationRoutes = router;
