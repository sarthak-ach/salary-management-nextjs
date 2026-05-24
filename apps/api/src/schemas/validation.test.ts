import { describe, expect, it } from "vitest";
import {
  createEmployeeSchema,
  listEmployeesQuerySchema,
  updateEmployeeSchema,
} from "@salary-management/shared";

describe("createEmployeeSchema", () => {
  const validInput = {
    fullName: "Jane Doe",
    email: "jane@example.com",
    jobTitle: "Engineer",
    country: "US",
    salary: 85_000,
  };

  it("accepts valid employee input", () => {
    expect(createEmployeeSchema.parse(validInput)).toMatchObject(validInput);
  });

  it("rejects missing required fields", () => {
    const result = createEmployeeSchema.safeParse({ fullName: "Jane Doe" });
    expect(result.success).toBe(false);
  });

  it("rejects non-positive salary", () => {
    const result = createEmployeeSchema.safeParse({
      ...validInput,
      salary: -1,
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = createEmployeeSchema.safeParse({
      ...validInput,
      email: "not-an-email",
    });
    expect(result.success).toBe(false);
  });
});

describe("updateEmployeeSchema", () => {
  it("allows partial updates", () => {
    expect(updateEmployeeSchema.parse({ salary: 90_000 })).toEqual({
      salary: 90_000,
    });
  });

  it("rejects invalid partial values", () => {
    const result = updateEmployeeSchema.safeParse({ salary: 0 });
    expect(result.success).toBe(false);
  });
});

describe("listEmployeesQuerySchema", () => {
  it("applies pagination defaults", () => {
    expect(listEmployeesQuerySchema.parse({})).toEqual({
      page: 1,
      limit: 20,
    });
  });

  it("coerces query string values", () => {
    expect(listEmployeesQuerySchema.parse({ page: "2", limit: "50" })).toEqual({
      page: 2,
      limit: 50,
    });
  });

  it("rejects limit above maximum", () => {
    const result = listEmployeesQuerySchema.safeParse({ limit: 101 });
    expect(result.success).toBe(false);
  });
});
