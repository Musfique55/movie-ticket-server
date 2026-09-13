import { Router } from "express";
import { requestValidator } from "@/middleware/requestValidator";
import { movieController } from "./movie.controller";
import { createMovieDTO, updateMovieDTO } from "./movie.schema";
import { auth } from "@/middleware/auth";
import { Role } from "@/generated/prisma/client";

const router = Router();

router.post(
  "/",
  auth(Role.ADMIN),
  requestValidator(createMovieDTO),
  movieController.createMovie,
);
router.patch(
  "/:id",
  auth(Role.ADMIN),
  requestValidator(updateMovieDTO),
  movieController.updateMovie,
);
router.delete("/:id", auth(Role.ADMIN), movieController.deleteMovie);

export const MovieRoutes = router;
