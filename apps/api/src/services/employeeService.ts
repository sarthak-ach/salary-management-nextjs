import type { Prisma } from "@prisma/client";
import type {
  CreateEmployeeInput,
  ListEmployeesQuery,
  UpdateEmployeeInput,
} from "@salary-management/shared";
import { prisma } from "../lib/prisma.js";
import {
  serializeEmployee,
  serializeEmployees,
  type EmployeeResponse,
} from "../lib/serialize.js";

export interface PaginatedEmployees {
  data: EmployeeResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

function buildListWhere(query: ListEmployeesQuery): Prisma.EmployeeWhereInput {
  const where: Prisma.EmployeeWhereInput = {};

  if (query.country) {
    where.country = { equals: query.country, mode: "insensitive" };
  }

  if (query.jobTitle) {
    where.jobTitle = { equals: query.jobTitle, mode: "insensitive" };
  }

  if (query.search) {
    where.OR = [
      { fullName: { contains: query.search, mode: "insensitive" } },
      { email: { contains: query.search, mode: "insensitive" } },
    ];
  }

  return where;
}

export async function listEmployees(
  query: ListEmployeesQuery,
): Promise<PaginatedEmployees> {
  const where = buildListWhere(query);
  const skip = (query.page - 1) * query.limit;

  const [employees, total] = await Promise.all([
    prisma.employee.findMany({
      where,
      skip,
      take: query.limit,
      orderBy: { fullName: "asc" },
    }),
    prisma.employee.count({ where }),
  ]);

  return {
    data: serializeEmployees(employees),
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(total / query.limit) || 1,
    },
  };
}

export async function getEmployeeById(
  id: string,
): Promise<EmployeeResponse | null> {
  const employee = await prisma.employee.findUnique({ where: { id } });
  return employee ? serializeEmployee(employee) : null;
}

export async function createEmployee(
  input: CreateEmployeeInput,
): Promise<EmployeeResponse> {
  const employee = await prisma.employee.create({
    data: {
      fullName: input.fullName,
      email: input.email,
      jobTitle: input.jobTitle,
      country: input.country,
      salary: input.salary,
      department: input.department,
      employmentType: input.employmentType,
      startDate: input.startDate,
    },
  });

  return serializeEmployee(employee);
}

export async function updateEmployee(
  id: string,
  input: UpdateEmployeeInput,
): Promise<EmployeeResponse> {
  const employee = await prisma.employee.update({
    where: { id },
    data: input,
  });

  return serializeEmployee(employee);
}

export async function deleteEmployee(id: string): Promise<void> {
  await prisma.employee.delete({ where: { id } });
}
