import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { EmployeesPage } from "@/components/employees/employees-page";
import type { Employee } from "@/lib/types";

const mocks = vi.hoisted(() => ({
  useEmployees: vi.fn(),
}));

vi.mock("@/hooks/use-employees", () => ({
  useEmployees: mocks.useEmployees,
  useCreateEmployee: vi.fn(() => ({ isPending: false, mutateAsync: vi.fn() })),
  useUpdateEmployee: vi.fn(() => ({ isPending: false, mutateAsync: vi.fn() })),
  useDeleteEmployee: vi.fn(() => ({ isPending: false, mutateAsync: vi.fn() })),
}));

vi.mock("@/components/employees/employee-form-dialog", () => ({
  EmployeeFormDialog: () => null,
}));

vi.mock("@/components/employees/delete-employee-dialog", () => ({
  DeleteEmployeeDialog: () => null,
}));

const employees: Employee[] = [
  {
    id: "11111111-1111-4111-8111-111111111111",
    fullName: "Jane Doe",
    email: "jane@example.com",
    jobTitle: "Engineer",
    country: "US",
    salary: 85_000,
    department: "Engineering",
    employmentType: "FULL_TIME",
    startDate: "2024-01-01T00:00:00.000Z",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
];

describe("EmployeesPage", () => {
  it("updates the employee query when a sortable header is clicked", async () => {
    const user = userEvent.setup();
    mocks.useEmployees.mockReturnValue({
      data: {
        data: employees,
        pagination: { page: 1, limit: 20, total: 1, totalPages: 1 },
      },
      isLoading: false,
      isError: false,
      error: null,
      isFetching: false,
    });

    render(<EmployeesPage />);

    expect(mocks.useEmployees).toHaveBeenLastCalledWith(
      expect.objectContaining({
        sortBy: "fullName",
        sortOrder: "asc",
      }),
    );

    await user.click(screen.getByRole("button", { name: /salary/i }));
    await waitFor(() => {
      expect(mocks.useEmployees).toHaveBeenLastCalledWith(
        expect.objectContaining({
          sortBy: "salary",
          sortOrder: "asc",
        }),
      );
    });

    await user.click(screen.getByRole("button", { name: /salary/i }));
    await waitFor(() => {
      expect(mocks.useEmployees).toHaveBeenLastCalledWith(
        expect.objectContaining({
          sortBy: "salary",
          sortOrder: "desc",
        }),
      );
    });
  });
});
