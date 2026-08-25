import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { routes } from "./routes";
import { globalErrorHandler } from "@/middleware/globalErrorHandler";
import { notFound } from "./middleware/notFound";

const app = express();

// Security headers
app.use(helmet());
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ message: "Server is up & healthy" });
});

app.use("/api/v1", routes);

app.use(notFound);
app.use(globalErrorHandler);

export default app;
