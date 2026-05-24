import cors from "cors";
import express from "express";
import helmet from "helmet";
import { errorHandler } from "./middleware/errorHandler.js";
import { healthRouter } from "./routes/health.js";

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

  app.use(errorHandler);

  return app;
}
