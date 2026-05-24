import { prisma } from "../lib/prisma.js";
import {
  computeSalaryBandDistribution,
  type SalaryStats,
} from "../lib/aggregations.js";

export interface CountryInsights extends SalaryStats {
  country: string;
}

export interface CountryJobTitleInsights {
  country: string;
  jobTitle: string;
  avg: number;
  count: number;
}

export interface InsightsSummary {
  totalEmployees: number;
  headcountByCountry: { country: string; count: number }[];
  topJobTitles: { jobTitle: string; count: number }[];
  salaryBands: { label: string; count: number }[];
}

function decimalToNumber(value: { toNumber(): number } | null): number {
  return value?.toNumber() ?? 0;
}

export async function getCountryInsights(
  country: string,
): Promise<CountryInsights> {
  const result = await prisma.employee.aggregate({
    where: { country: { equals: country, mode: "insensitive" } },
    _min: { salary: true },
    _max: { salary: true },
    _avg: { salary: true },
    _count: true,
  });

  return {
    country,
    min: decimalToNumber(result._min.salary),
    max: decimalToNumber(result._max.salary),
    avg: decimalToNumber(result._avg.salary),
    count: result._count,
  };
}

export async function getCountryJobTitleInsights(
  country: string,
  jobTitle: string,
): Promise<CountryJobTitleInsights> {
  const result = await prisma.employee.aggregate({
    where: {
      country: { equals: country, mode: "insensitive" },
      jobTitle: { equals: jobTitle, mode: "insensitive" },
    },
    _avg: { salary: true },
    _count: true,
  });

  return {
    country,
    jobTitle,
    avg: decimalToNumber(result._avg.salary),
    count: result._count,
  };
}

export async function getInsightsSummary(): Promise<InsightsSummary> {
  const [totalEmployees, headcountByCountry, topJobTitles, salaries] =
    await Promise.all([
      prisma.employee.count(),
      prisma.employee.groupBy({
        by: ["country"],
        _count: { _all: true },
        orderBy: { _count: { country: "desc" } },
      }),
      prisma.employee.groupBy({
        by: ["jobTitle"],
        _count: { _all: true },
        orderBy: { _count: { jobTitle: "desc" } },
        take: 10,
      }),
      prisma.employee.findMany({ select: { salary: true } }),
    ]);

  return {
    totalEmployees,
    headcountByCountry: headcountByCountry.map((row) => ({
      country: row.country,
      count: row._count._all,
    })),
    topJobTitles: topJobTitles.map((row) => ({
      jobTitle: row.jobTitle,
      count: row._count._all,
    })),
    salaryBands: computeSalaryBandDistribution(
      salaries.map((row) => row.salary.toNumber()),
    ),
  };
}
