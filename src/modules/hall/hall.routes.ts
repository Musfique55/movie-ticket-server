import { Router } from "express";
import { HallController } from "./hall.controller";
import { createHallDTO, updateHallDTO } from "./hall.schema";
import { requestValidator } from "@/middleware/requestValidator";

const router = Router();

router.post("/", requestValidator(createHallDTO), HallController.createHall);
router.patch(
  "/:id",
  requestValidator(updateHallDTO),
  HallController.updateHall,
);
router.delete("/:id", HallController.deleteHall);
router.get("/:id", HallController.getHall);
router.get("/", HallController.getAllHall);

export const hallRoutes = router;
