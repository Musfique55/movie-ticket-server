import { Router } from "express";
import { SeatRoutes } from "@/modules/seat/seat.routes";
import { UserRoutes } from "@/modules/user/user.routes";
import { ShowTimeRoutes } from "@/modules/showTime/showTime.routes";
import { reservationRoutes } from "@/modules/reservation/reservation.route";
import { paymentRoutes } from "@/modules/payment/payment.route";

const router = Router();

router.use("/seats", SeatRoutes);
router.use("/auth", UserRoutes);
router.use("/show-times", ShowTimeRoutes);
router.use("/reservations", reservationRoutes);
router.use("/payment", paymentRoutes);

export const routes = router;
