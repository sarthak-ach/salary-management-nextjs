import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { usePathname } from "next/navigation";
import { AppNav } from "./app-nav";

vi.mock("next-themes", () => ({
  useTheme: () => ({
    theme: "light",
    resolvedTheme: "light",
    setTheme: vi.fn(),
  }),
}));

describe("AppNav", () => {
  it("renders navigation links", async () => {
    vi.mocked(usePathname).mockReturnValue("/");
    render(<AppNav />);

    expect(screen.getByRole("link", { name: /employees/i })).toHaveAttribute(
      "href",
      "/employees",
    );
    expect(screen.getByRole("link", { name: /insights/i })).toHaveAttribute(
      "href",
      "/insights",
    );
    expect(
      await screen.findByRole("button", { name: /switch to dark mode/i }),
    ).toBeInTheDocument();
  });

  it("highlights the active route", () => {
    vi.mocked(usePathname).mockReturnValue("/employees");
    render(<AppNav />);

    const employeesLink = screen.getByRole("link", { name: /employees/i });
    expect(employeesLink.className).toMatch(/bg-primary/);
  });
});
