import { Router } from "express";
import {
  countryInsightsValidators,
  countryJobTitleInsightsValidators,
  getCountryInsights,
  getCountryJobTitleInsights,
  getInsightsSummary,
} from "../controllers/insightsController.js";

export const insightsRouter = Router();

insightsRouter.get("/summary", getInsightsSummary);
insightsRouter.get(
  "/country/:country",
  countryInsightsValidators,
  getCountryInsights,
);
insightsRouter.get(
  "/country/:country/job-title/:title",
  countryJobTitleInsightsValidators,
  getCountryJobTitleInsights,
);
