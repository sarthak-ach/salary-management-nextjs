import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ThemeToggle } from "@/components/layout/theme-toggle";

const setTheme = vi.fn();

vi.mock("next-themes", () => ({
  useTheme: () => ({
    theme: "light",
    resolvedTheme: "light",
    setTheme,
  }),
}));

describe("ThemeToggle", () => {
  it("renders a theme toggle button", async () => {
    render(<ThemeToggle />);
    const button = await screen.findByRole("button", {
      name: /switch to dark mode/i,
    });
    expect(button).toBeInTheDocument();
  });

  it("calls setTheme with dark when clicked in light mode", async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);
    const button = await screen.findByRole("button", {
      name: /switch to dark mode/i,
    });
    await user.click(button);
    expect(setTheme).toHaveBeenCalledWith("dark");
  });
});
