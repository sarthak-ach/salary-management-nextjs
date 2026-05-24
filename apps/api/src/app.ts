import cors from "cors";
import express from "express";
import helmet from "helmet";
import { AppError, errorHandler } from "./middleware/errorHandler.js";
import { employeesRouter } from "./routes/employees.js";
import { healthRouter } from "./routes/health.js";
import { insightsRouter } from "./routes/insights.js";

export function createApp() {
  const app = express();

  const corsOrigin = process.env.CORS_ORIGIN ?? "http://localhost:3000";

  app.use(helmet());
  app.use(
    cors({
      origin: corsOrigin.split(",").map((origin) => origin.trim()),
    }),
  );
  app.use(express.json());

  app.use(healthRouter);
  app.use("/employees", employeesRouter);
  app.use("/insights", insightsRouter);

  app.use((_req, _res, next) => {
    next(new AppError(404, "Route not found"));
  });

  app.use(errorHandler);

  return app;
}
