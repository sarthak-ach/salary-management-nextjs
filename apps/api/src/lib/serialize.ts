import type { Employee } from "@prisma/client";

export type EmployeeResponse = Omit<Employee, "salary"> & { salary: number };

export function serializeEmployee(employee: Employee): EmployeeResponse {
  return {
    ...employee,
    salary: employee.salary.toNumber(),
  };
}

export function serializeEmployees(employees: Employee[]): EmployeeResponse[] {
  return employees.map(serializeEmployee);
}
