import { Router } from "express";
import { requestValidator } from "@/middleware/requestValidator";
import { movieController } from "./movie.controller";
import { createMovieDTO, updateMovieDTO } from "./movie.schema";

const router = Router();

router.post("/", requestValidator(createMovieDTO), movieController.createMovie);
router.patch(
  "/:id",
  requestValidator(updateMovieDTO),
  movieController.updateMovie,
);
router.delete("/:id", movieController.deleteMovie);

export const MovieRoutes = router;
