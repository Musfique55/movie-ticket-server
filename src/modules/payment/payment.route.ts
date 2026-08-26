import { Router } from "express";
import { paymentController } from "./payment.controller";
import { requestValidator } from "@/middleware/requestValidator";
import { createCheckoutSessionDTO } from "./payment.schema";

const router = Router();

router.post(
  "/create-checkout-session",
  requestValidator(createCheckoutSessionDTO),
  paymentController.createCheckoutSession,
);

export const paymentRoutes = router;
