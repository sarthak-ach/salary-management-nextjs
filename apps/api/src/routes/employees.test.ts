import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createApp } from "../app.js";
import * as employeeService from "../services/employeeService.js";

vi.mock("../services/employeeService.js", () => ({
  listEmployees: vi.fn(),
  getEmployeeById: vi.fn(),
  createEmployee: vi.fn(),
  updateEmployee: vi.fn(),
  deleteEmployee: vi.fn(),
}));

const app = createApp();

describe("GET /employees", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns paginated employees", async () => {
    vi.mocked(employeeService.listEmployees).mockResolvedValue({
      data: [
        {
          id: "11111111-1111-4111-8111-111111111111",
          fullName: "Jane Doe",
          email: "jane@example.com",
          jobTitle: "Engineer",
          country: "US",
          salary: 85_000,
          department: null,
          employmentType: "FULL_TIME",
          startDate: null,
          createdAt: new Date("2024-01-01"),
          updatedAt: new Date("2024-01-01"),
        },
      ],
      pagination: {
        page: 1,
        limit: 20,
        total: 1,
        totalPages: 1,
      },
    });

    const response = await request(app).get("/employees");

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.pagination.total).toBe(1);
  });

  it("returns 400 for invalid query params", async () => {
    const response = await request(app).get("/employees?limit=500");

    expect(response.status).toBe(400);
    expect(response.body.error).toBeTruthy();
  });
});

describe("POST /employees", () => {
  it("returns 400 when body fails validation", async () => {
    const response = await request(app)
      .post("/employees")
      .send({ fullName: "Jane Doe" });

    expect(response.status).toBe(400);
    expect(response.body.error).toBeTruthy();
  });
});
