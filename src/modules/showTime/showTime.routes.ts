import { Router } from "express";
import { ShowTimeController } from "./showTime.controller";
import { createShowTimeDTO, updateShowTimeDTO } from "./showTime.schema";
import { requestValidator } from "@/middleware/requestValidator";
import { Role } from "@/generated/prisma/client";
import { auth } from "@/middleware/auth";

const router = Router();

router.post(
  "/",
  auth(Role.ADMIN),
  requestValidator(createShowTimeDTO),
  ShowTimeController.createShowTime,
);

router.get("/:id/seats/stream", ShowTimeController.getEventSeats);

router.get("/", ShowTimeController.getAllShowTimes);
router.get("/:id", ShowTimeController.getEventSeatsById);

router.patch(
  "/:id",
  auth(Role.ADMIN),
  requestValidator(updateShowTimeDTO),
  ShowTimeController.updateShowTime,
);
router.delete("/:id",auth(Role.ADMIN), ShowTimeController.deleteShowTime);

export const ShowTimeRoutes = router;
