import type { NextFunction, Request, Response } from "express";
import { ZodError, type ZodSchema } from "zod";
import { AppError } from "./errorHandler.js";

type ValidationTarget = "body" | "query" | "params";

function formatZodError(error: ZodError): string {
  return error.errors.map((issue) => issue.message).join("; ");
}

export function validate(
  schemas: Partial<Record<ValidationTarget, ZodSchema>>,
) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      req.validated ??= {};

      for (const [target, schema] of Object.entries(schemas)) {
        if (schema) {
          const key = target as ValidationTarget;
          req.validated[key] = schema.parse(req[key]);
        }
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(new AppError(400, formatZodError(error)));
        return;
      }
      next(error);
    }
  };
}
