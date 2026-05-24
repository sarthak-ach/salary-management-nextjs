import { beforeEach, describe, expect, it, vi } from "vitest";
import { prisma } from "../lib/prisma.js";
import * as insights from "./insightsService.js";

vi.mock("../lib/prisma.js", () => ({
  prisma: {
    employee: {
      aggregate: vi.fn(),
      count: vi.fn(),
      groupBy: vi.fn(),
      findMany: vi.fn(),
    },
  },
}));

describe("insightsService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns country salary stats", async () => {
    vi.mocked(prisma.employee.aggregate).mockResolvedValue({
      _min: { salary: { toNumber: () => 50_000 } },
      _max: { salary: { toNumber: () => 120_000 } },
      _avg: { salary: { toNumber: () => 85_000 } },
      _count: 10,
    } as never);

    const result = await insights.getCountryInsights("US");

    expect(result).toEqual({
      country: "US",
      min: 50_000,
      max: 120_000,
      avg: 85_000,
      count: 10,
    });
  });

  it("returns country and job title average salary", async () => {
    vi.mocked(prisma.employee.aggregate).mockResolvedValue({
      _avg: { salary: { toNumber: () => 92_500 } },
      _count: 4,
    } as never);

    const result = await insights.getCountryJobTitleInsights("US", "Engineer");

    expect(result).toEqual({
      country: "US",
      jobTitle: "Engineer",
      avg: 92_500,
      count: 4,
    });
  });

  it("builds insights summary from grouped data", async () => {
    vi.mocked(prisma.employee.count).mockResolvedValue(3);
    vi.mocked(prisma.employee.groupBy)
      .mockResolvedValueOnce([
        { country: "US", _count: { _all: 2 } },
        { country: "UK", _count: { _all: 1 } },
      ] as never)
      .mockResolvedValueOnce([
        { jobTitle: "Engineer", _count: { _all: 2 } },
        { jobTitle: "Designer", _count: { _all: 1 } },
      ] as never);
    vi.mocked(prisma.employee.findMany).mockResolvedValue([
      { salary: { toNumber: () => 40_000 } },
      { salary: { toNumber: () => 60_000 } },
      { salary: { toNumber: () => 120_000 } },
    ] as never);

    const result = await insights.getInsightsSummary();

    expect(result.totalEmployees).toBe(3);
    expect(result.headcountByCountry).toEqual([
      { country: "US", count: 2 },
      { country: "UK", count: 1 },
    ]);
    expect(result.topJobTitles).toEqual([
      { jobTitle: "Engineer", count: 2 },
      { jobTitle: "Designer", count: 1 },
    ]);
    expect(result.salaryBands).toEqual([
      { label: "Under 50k", count: 1 },
      { label: "50k - 75k", count: 1 },
      { label: "75k - 100k", count: 0 },
      { label: "100k - 150k", count: 1 },
      { label: "150k+", count: 0 },
    ]);
  });
});
