import { describe, expect, it } from "vitest";
import {
  classifySalaryBand,
  computeSalaryBandDistribution,
  computeSalaryStats,
} from "./aggregations.js";

describe("computeSalaryStats", () => {
  it("returns zeroed stats for an empty list", () => {
    expect(computeSalaryStats([])).toEqual({
      min: 0,
      max: 0,
      avg: 0,
      count: 0,
    });
  });

  it("computes min, max, and avg for fixture salaries", () => {
    const stats = computeSalaryStats([50_000, 75_000, 100_000]);

    expect(stats.min).toBe(50_000);
    expect(stats.max).toBe(100_000);
    expect(stats.avg).toBeCloseTo(75_000);
    expect(stats.count).toBe(3);
  });
});

describe("classifySalaryBand", () => {
  it("classifies salaries into expected bands", () => {
    expect(classifySalaryBand(40_000)).toBe("Under 50k");
    expect(classifySalaryBand(60_000)).toBe("50k - 75k");
    expect(classifySalaryBand(80_000)).toBe("75k - 100k");
    expect(classifySalaryBand(120_000)).toBe("100k - 150k");
    expect(classifySalaryBand(200_000)).toBe("150k+");
  });
});

describe("computeSalaryBandDistribution", () => {
  it("counts salaries per band", () => {
    const distribution = computeSalaryBandDistribution([
      40_000,
      55_000,
      80_000,
      120_000,
      200_000,
    ]);

    expect(distribution).toEqual([
      { label: "Under 50k", count: 1 },
      { label: "50k - 75k", count: 1 },
      { label: "75k - 100k", count: 1 },
      { label: "100k - 150k", count: 1 },
      { label: "150k+", count: 1 },
    ]);
  });
});
