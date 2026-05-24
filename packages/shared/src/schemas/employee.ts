import { z } from "zod";

export const employmentTypeSchema = z.enum(["FULL_TIME", "CONTRACT"]);

export const createEmployeeSchema = z.object({
  fullName: z.string().min(1).max(200),
  email: z.string().email(),
  jobTitle: z.string().min(1).max(200),
  country: z.string().min(2).max(100),
  salary: z.number().positive(),
  department: z.string().max(200).optional(),
  employmentType: employmentTypeSchema.default("FULL_TIME"),
  startDate: z.coerce.date().optional(),
});

export const updateEmployeeSchema = createEmployeeSchema.partial();

export type EmploymentType = z.infer<typeof employmentTypeSchema>;
export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;
export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>;
