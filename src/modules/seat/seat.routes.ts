import { Router } from "express";
import { SeatController } from "./seat.controller";
import { requestValidator } from "@/middleware/requestValidator";
import { createSeatDTO } from "./seat.schema";

const router = Router();

router.post("/", requestValidator(createSeatDTO), SeatController.createSeat);

export const SeatRoutes = router;
