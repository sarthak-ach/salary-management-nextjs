import type { Request, Response, NextFunction } from "express";
import {
  countryJobTitleParamsSchema,
  countryParamSchema,
} from "@salary-management/shared";
import { validate } from "../middleware/validate.js";
import * as insightsService from "../services/insightsService.js";

export const countryInsightsValidators = validate({
  params: countryParamSchema,
});

export const countryJobTitleInsightsValidators = validate({
  params: countryJobTitleParamsSchema,
});

export async function getCountryInsights(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { country } = req.validated!.params as { country: string };
    const insights = await insightsService.getCountryInsights(country);
    res.json(insights);
  } catch (error) {
    next(error);
  }
}

export async function getCountryJobTitleInsights(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { country, title } = req.validated!.params as {
      country: string;
      title: string;
    };
    const insights = await insightsService.getCountryJobTitleInsights(
      country,
      title,
    );
    res.json(insights);
  } catch (error) {
    next(error);
  }
}

export async function getInsightsSummary(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const summary = await insightsService.getInsightsSummary();
    res.json(summary);
  } catch (error) {
    next(error);
  }
}
