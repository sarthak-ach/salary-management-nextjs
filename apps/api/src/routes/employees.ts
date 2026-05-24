import { Router } from "express";
import {
  createEmployee,
  createEmployeeValidators,
  deleteEmployee,
  deleteEmployeeValidators,
  getEmployee,
  getEmployeeValidators,
  listEmployees,
  listEmployeesValidators,
  updateEmployee,
  updateEmployeeValidators,
} from "../controllers/employeesController.js";

export const employeesRouter = Router();

employeesRouter.get("/", listEmployeesValidators, listEmployees);
employeesRouter.post("/", createEmployeeValidators, createEmployee);
employeesRouter.get("/:id", getEmployeeValidators, getEmployee);
employeesRouter.patch("/:id", updateEmployeeValidators, updateEmployee);
employeesRouter.delete("/:id", deleteEmployeeValidators, deleteEmployee);
