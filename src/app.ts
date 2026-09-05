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
import { seatEmitter } from "./lib/seatEmitter";
import rateLimit from "express-rate-limit";

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
app.use;
app.use(morgan("dev"));

// sse for real-time seat availability
app.get("/events/:showTimeId", async (req: Request, res: Response) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  res.write(`data: ${JSON.stringify({ status: "connected" })}\n\n`);

  // send seat availability
  const { showTimeId } = req.params;

  const initialData = await showTimeServices.getShowTimeById(
    showTimeId as string,
  );

  res.write(`data: ${JSON.stringify(initialData)}\n\n`);

  const onSeatUpdate = (data: any) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  seatEmitter.on(`seatUpdate:${showTimeId}`, onSeatUpdate);

  req.on("close", () => {
    seatEmitter.off(`seatUpdate:${showTimeId}`, onSeatUpdate);
  });
});

// health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ message: "Server is up & healthy" });
});

app.use("/api/v1", routes);

// rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
  ipv6Subnet: 56,
  handler: (req, res, next, options) => {
    res.status(429).json({
      status: "error",
      message: options.message,
    });
  },
  keyGenerator: (req, res) => {
    return req.ip as string;
  },
});

app.use(apiLimiter);
app.use(notFound);
app.use(globalErrorHandler);

export default app;
