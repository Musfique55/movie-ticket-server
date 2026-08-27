import cors from "cors";
import cookieParser from "cookie-parser";
import express, { Request, Response } from "express";
import helmet from "helmet";
import morgan from "morgan";
import { routes } from "./routes";
import { globalErrorHandler } from "@/middleware/globalErrorHandler";
import { notFound } from "./middleware/notFound";
import { paymentController } from "@/modules/payment/payment.controller";
import { showTimeServices } from "./modules/showTime/showTime.services";

const app = express();

// Security headers
app.use(helmet());
app.use(cors());
app.use(cookieParser());

// stripe webhook
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  paymentController.stripeWebhook,
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// sse for real-time seat availability
app.get("/events/:showTimeId", async (req: Request, res: Response) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  res.write(`data: ${JSON.stringify({ status: "connected" })}\n\n`);

  // send seat availability
  const { showTimeId } = req.params;

  const getSeatBookingEvent = await showTimeServices.getShowTimeById(
    showTimeId as string,
  );

  res.write(`data: ${JSON.stringify(getSeatBookingEvent)}\n\n`);

  req.on("close", () => {
    console.log("Client disconnected");
  });
});

// health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ message: "Server is up & healthy" });
});

app.use("/api/v1", routes);

app.use(notFound);
app.use(globalErrorHandler);

export default app;
