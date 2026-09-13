import { Router } from "express";
import { createTheatreDTO, updateTheatreDTO } from "./theatre.schema";
import { theatreController } from "./theatre.controller";
import { requestValidator } from "@/middleware/requestValidator";
import { auth } from "@/middleware/auth";
import { Role } from "@/generated/prisma/client";

const router = Router();

router.post(
  "/",
  auth(Role.ADMIN),
  requestValidator(createTheatreDTO),
  theatreController.createTheatre,
);

router.patch(
  "/:id",
  auth(Role.ADMIN),
  requestValidator(updateTheatreDTO),
  theatreController.updateTheatre,
);

router.get("/:id/movies", theatreController.getTheatreMovies);
router.get("/:id/movies/:movieId", theatreController.getTheatreMovieDetails);

router.delete("/:id",auth(Role.ADMIN), theatreController.deleteTheatre);

export const theatreRoutes = router;
