import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import { routes } from "./routes";
import { globalErrorHandler } from "@/middleware/globalErrorHandler";
import { notFound } from "./middleware/notFound";
import { paymentController } from "@/modules/payment/payment.controller";

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
app.use(morgan("dev"));

const swaggerDocument = YAML.load(path.join(__dirname, "./docs/swagger.yaml"));
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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
});

app.use(apiLimiter);
app.use(notFound);
app.use(globalErrorHandler);

export default app;
