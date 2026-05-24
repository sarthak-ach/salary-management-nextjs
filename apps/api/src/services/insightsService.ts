import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import {
  SALARY_BANDS,
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
  defaultCountryInsights: CountryInsights;
  defaultCountryJobTitleInsights: CountryJobTitleInsights;
}

const DEFAULT_INSIGHTS_COUNTRY = "US";
const DEFAULT_INSIGHTS_JOB_TITLE = "Software Engineer";

function decimalToNumber(value: { toNumber(): number } | null): number {
  return value?.toNumber() ?? 0;
}

function countToNumber(value: bigint | number | null | undefined): number {
  return Number(value ?? 0);
}

async function getSalaryBandDistribution(): Promise<
  { label: string; count: number }[]
> {
  const [row] = await prisma.$queryRaw<
    [
      {
        under50k: bigint;
        from50kTo75k: bigint;
        from75kTo100k: bigint;
        from100kTo150k: bigint;
        over150k: bigint;
      },
    ]
  >(Prisma.sql`
    SELECT
      COUNT(*) FILTER (WHERE salary < 50000) AS "under50k",
      COUNT(*) FILTER (WHERE salary >= 50000 AND salary < 75000) AS "from50kTo75k",
      COUNT(*) FILTER (WHERE salary >= 75000 AND salary < 100000) AS "from75kTo100k",
      COUNT(*) FILTER (WHERE salary >= 100000 AND salary < 150000) AS "from100kTo150k",
      COUNT(*) FILTER (WHERE salary >= 150000) AS "over150k"
    FROM "Employee"
  `);

  const counts = [
    row?.under50k,
    row?.from50kTo75k,
    row?.from75kTo100k,
    row?.from100kTo150k,
    row?.over150k,
  ];

  return SALARY_BANDS.map((band, index) => ({
    label: band.label,
    count: countToNumber(counts[index]),
  }));
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
  const [
    totalEmployees,
    headcountByCountry,
    topJobTitles,
    salaryBands,
    defaultCountryInsights,
    defaultCountryJobTitleInsights,
  ] = await Promise.all([
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
    getSalaryBandDistribution(),
    getCountryInsights(DEFAULT_INSIGHTS_COUNTRY),
    getCountryJobTitleInsights(
      DEFAULT_INSIGHTS_COUNTRY,
      DEFAULT_INSIGHTS_JOB_TITLE,
    ),
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
    salaryBands,
    defaultCountryInsights,
    defaultCountryJobTitleInsights,
  };
}
