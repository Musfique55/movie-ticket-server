import { Router } from "express";
import { SeatRoutes } from "@/modules/seat/seat.routes";
import { UserRoutes } from "@/modules/user/user.routes";

const router = Router();

router.use("/seats", SeatRoutes);
router.use("/users", UserRoutes);

export const routes = router;
