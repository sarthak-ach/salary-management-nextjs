import type { Request, Response, NextFunction } from "express";
import {
  createEmployeeSchema,
  employeeIdParamSchema,
  listEmployeesQuerySchema,
  updateEmployeeSchema,
  type CreateEmployeeInput,
  type ListEmployeesQuery,
  type UpdateEmployeeInput,
} from "@salary-management/shared";
import { AppError } from "../middleware/errorHandler.js";
import { validate } from "../middleware/validate.js";
import * as employeeService from "../services/employeeService.js";

export const listEmployeesValidators = validate({
  query: listEmployeesQuerySchema,
});

export const getEmployeeValidators = validate({
  params: employeeIdParamSchema,
});

export const createEmployeeValidators = validate({
  body: createEmployeeSchema,
});

export const updateEmployeeValidators = validate({
  params: employeeIdParamSchema,
  body: updateEmployeeSchema,
});

export const deleteEmployeeValidators = validate({
  params: employeeIdParamSchema,
});

export async function listEmployees(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const result = await employeeService.listEmployees(
      req.validated!.query as ListEmployeesQuery,
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function getEmployee(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.validated!.params as { id: string };
    const employee = await employeeService.getEmployeeById(id);

    if (!employee) {
      throw new AppError(404, "Employee not found");
    }

    res.json(employee);
  } catch (error) {
    next(error);
  }
}

export async function createEmployee(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const employee = await employeeService.createEmployee(
      req.validated!.body as CreateEmployeeInput,
    );
    res.status(201).json(employee);
  } catch (error) {
    next(error);
  }
}

export async function updateEmployee(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.validated!.params as { id: string };
    const employee = await employeeService.updateEmployee(
      id,
      req.validated!.body as UpdateEmployeeInput,
    );
    res.json(employee);
  } catch (error) {
    next(error);
  }
}

export async function deleteEmployee(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.validated!.params as { id: string };
    await employeeService.deleteEmployee(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
