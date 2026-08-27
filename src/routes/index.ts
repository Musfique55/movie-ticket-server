import { Router } from "express";
import { SeatRoutes } from "@/modules/seat/seat.routes";
import { UserRoutes } from "@/modules/user/user.routes";
import { ShowTimeRoutes } from "@/modules/showTime/showTime.routes";
import { reservationRoutes } from "@/modules/reservation/reservation.route";
import { paymentRoutes } from "@/modules/payment/payment.route";
import { MovieRoutes } from "@/modules/movie/movie.routes";
import { theatreRoutes } from "@/modules/theatre/theatre.routes";
import { hallRoutes } from "@/modules/hall/hall.routes";

const router = Router();

router.use("/seats", SeatRoutes);
router.use("/auth", UserRoutes);
router.use("/show-times", ShowTimeRoutes);
router.use("/reservations", reservationRoutes);
router.use("/payment", paymentRoutes);
router.use("/movies", MovieRoutes);
router.use("/theatres", theatreRoutes);
router.use("halls", hallRoutes);

export const routes = router;
