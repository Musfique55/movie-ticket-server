import { Router } from "express";
import { SeatController } from "./seat.controller";
import { requestValidator } from "@/middleware/requestValidator";
import { createSeatDTO, updateSeatDTO } from "./seat.schema";

const router = Router();

router.post("/", requestValidator(createSeatDTO), SeatController.createSeat);
router.get("/", SeatController.getAllSeats);
router.get("/:id", SeatController.getSeatById);
router.patch(
  "/:id",
  requestValidator(updateSeatDTO),
  SeatController.updateSeat,
);
router.delete("/:id", SeatController.deleteSeat);

export const SeatRoutes = router;
