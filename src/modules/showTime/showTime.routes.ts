import { Router } from "express";
import { ShowTimeController } from "./showTime.controller";
import { createShowTimeDTO, updateShowTimeDTO } from "./showTime.schema";
import { requestValidator } from "@/middleware/requestValidator";

const router = Router();

router.post(
  "/",
  requestValidator(createShowTimeDTO),
  ShowTimeController.createShowTime,
);
router.get("/", ShowTimeController.getAllShowTimes);
router.get("/:id", ShowTimeController.getShowTimeById);
router.patch(
  "/:id",
  requestValidator(updateShowTimeDTO),
  ShowTimeController.updateShowTime,
);
router.delete("/:id", ShowTimeController.deleteShowTime);

export const ShowTimeRoutes = router;
