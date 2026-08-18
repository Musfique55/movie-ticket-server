import { Router } from "express";
import { ticketController } from "./ticket.controller";
import { requestValidator } from "@/middleware/requestValidator";
import { createTicketDTO } from "./ticket.schema";

const router = Router();

router.post(
  "/confirm",
  requestValidator(createTicketDTO),
  ticketController.confirmReservation,
);

export const ticketRoutes = router;
