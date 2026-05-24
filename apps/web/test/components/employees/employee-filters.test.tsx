import React, { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import {
  EmployeeFilters,
  type EmployeeFiltersState,
} from "@/components/employees/employee-filters";

function FiltersHarness() {
  const [filters, setFilters] = useState<EmployeeFiltersState>({
    search: "",
    country: "",
    jobTitle: "",
  });

  return <EmployeeFilters filters={filters} onChange={setFilters} />;
}

describe("EmployeeFilters", () => {
  it("updates search filter on input", async () => {
    const user = userEvent.setup();
    render(<FiltersHarness />);

    const input = screen.getByPlaceholderText(/search name or email/i);
    await user.type(input, "Jane");

    expect(input).toHaveValue("Jane");
  });

  it("shows clear button when filters are active", async () => {
    const user = userEvent.setup();
    render(<FiltersHarness />);

    expect(screen.queryByRole("button", { name: /clear/i })).not.toBeInTheDocument();

    await user.type(screen.getByPlaceholderText(/search name or email/i), "x");
    expect(screen.getByRole("button", { name: /clear/i })).toBeInTheDocument();
  });

  it("clears filters when clear is clicked", async () => {
    const user = userEvent.setup();
    render(<FiltersHarness />);

    const input = screen.getByPlaceholderText(/search name or email/i);
    await user.type(input, "Jane");
    await user.click(screen.getByRole("button", { name: /clear/i }));

    expect(input).toHaveValue("");
  });
});
