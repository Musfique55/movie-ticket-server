import { Router } from "express";
import { createTheatreDTO, updateTheatreDTO } from "./theatre.schema";
import { theatreController } from "./theatre.controller";
import { requestValidator } from "@/middleware/requestValidator";

const router = Router();

router.post(
  "/",
  requestValidator(createTheatreDTO),
  theatreController.createTheatre,
);

router.patch(
  "/:id",
  requestValidator(updateTheatreDTO),
  theatreController.updateTheatre,
);

router.delete("/:id", theatreController.deleteTheatre);

export const theatreRoutes = router;
