import { z } from "zod";

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export const listEmployeesQuerySchema = paginationQuerySchema.extend({
  country: z.string().min(2).max(100).optional(),
  jobTitle: z.string().min(1).max(200).optional(),
  search: z.string().min(1).max(200).optional(),
});

export const employeeIdParamSchema = z.object({
  id: z.string().uuid(),
});

export const countryParamSchema = z.object({
  country: z.string().min(2).max(100),
});

export const countryJobTitleParamsSchema = z.object({
  country: z.string().min(2).max(100),
  title: z.string().min(1).max(200),
});

export type ListEmployeesQuery = z.infer<typeof listEmployeesQuerySchema>;
export type EmployeeIdParam = z.infer<typeof employeeIdParamSchema>;
export type CountryParam = z.infer<typeof countryParamSchema>;
export type CountryJobTitleParams = z.infer<typeof countryJobTitleParamsSchema>;
