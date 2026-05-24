import { describe, expect, it } from "vitest";
import { formatDate, formatNumber, formatSalary, toDateInputValue } from "./format";

describe("format utilities", () => {
  it("formats numbers with grouping", () => {
    expect(formatNumber(10000)).toBe("10,000");
  });

  it("formats US salaries in USD", () => {
    expect(formatSalary("US", 75000)).toMatch(/\$75,000/);
  });

  it("formats JP salaries in JPY", () => {
    expect(formatSalary("JP", 5000000)).toMatch(/[¥￥]/);
  });

  it("formats dates or returns em dash", () => {
    expect(formatDate(null)).toBe("—");
    expect(formatDate("2024-06-15")).toMatch(/Jun/);
  });

  it("converts ISO dates to input value", () => {
    expect(toDateInputValue("2024-06-15T00:00:00.000Z")).toBe("2024-06-15");
    expect(toDateInputValue(null)).toBe("");
  });
});
