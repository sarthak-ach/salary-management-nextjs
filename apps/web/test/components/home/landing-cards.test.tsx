import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LandingCards } from "@/components/home/landing-cards";

describe("LandingCards", () => {
  it("renders employee and insights cards with CTAs", () => {
    render(<LandingCards />);

    expect(screen.getByRole("heading", { name: /employees/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /insights/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /open employees/i })).toHaveAttribute(
      "href",
      "/employees",
    );
    expect(screen.getByRole("link", { name: /view insights/i })).toHaveAttribute(
      "href",
      "/insights",
    );
  });
});
