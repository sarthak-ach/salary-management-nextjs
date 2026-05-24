import { beforeEach, describe, expect, it, vi } from "vitest";
import { prisma } from "../lib/prisma.js";
import * as employeeService from "./employeeService.js";

vi.mock("../lib/prisma.js", () => ({
  prisma: {
    employee: {
      findMany: vi.fn(),
      count: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

const mockEmployee = {
  id: "11111111-1111-4111-8111-111111111111",
  fullName: "Jane Doe",
  email: "jane@example.com",
  jobTitle: "Engineer",
  country: "US",
  salary: { toNumber: () => 85_000 },
  department: "Engineering",
  employmentType: "FULL_TIME" as const,
  startDate: new Date("2024-01-01"),
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-01"),
};

describe("employeeService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("lists employees with pagination metadata", async () => {
    vi.mocked(prisma.employee.findMany).mockResolvedValue([mockEmployee as never]);
    vi.mocked(prisma.employee.count).mockResolvedValue(1);

    const result = await employeeService.listEmployees({ page: 1, limit: 20 });

    expect(result.data).toHaveLength(1);
    expect(result.data[0]?.salary).toBe(85_000);
    expect(result.pagination).toEqual({
      page: 1,
      limit: 20,
      total: 1,
      totalPages: 1,
    });
  });

  it("returns null when employee is not found", async () => {
    vi.mocked(prisma.employee.findUnique).mockResolvedValue(null);

    const result = await employeeService.getEmployeeById(mockEmployee.id);

    expect(result).toBeNull();
  });

  it("creates an employee and serializes salary", async () => {
    vi.mocked(prisma.employee.create).mockResolvedValue(mockEmployee as never);

    const result = await employeeService.createEmployee({
      fullName: mockEmployee.fullName,
      email: mockEmployee.email,
      jobTitle: mockEmployee.jobTitle,
      country: mockEmployee.country,
      salary: 85_000,
      employmentType: "FULL_TIME",
    });

    expect(result.salary).toBe(85_000);
    expect(prisma.employee.create).toHaveBeenCalledOnce();
  });
});
