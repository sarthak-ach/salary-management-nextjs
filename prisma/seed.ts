import { EmploymentType, Prisma, PrismaClient } from "@prisma/client";
import { randomInt } from "crypto";
import { readFileSync } from "fs";
import { join } from "path";

const prisma = new PrismaClient();

const SEED_COUNT = 10_000;
const BATCH_SIZE = 500;

const COUNTRIES = ["US", "GB", "DE", "FR", "CA", "AU", "IN", "JP", "BR", "NL"] as const;

const JOB_TITLES = [
  "Software Engineer",
  "Senior Software Engineer",
  "Product Manager",
  "Data Analyst",
  "HR Specialist",
  "Financial Analyst",
  "Marketing Manager",
  "Sales Representative",
  "UX Designer",
  "DevOps Engineer",
  "Accountant",
  "Operations Manager",
  "Customer Success Manager",
  "Business Analyst",
  "QA Engineer",
] as const;

const DEPARTMENTS = [
  "Engineering",
  "Product",
  "Human Resources",
  "Finance",
  "Marketing",
  "Sales",
  "Design",
  "Operations",
  "Customer Success",
] as const;

const SALARY_RANGES: Record<(typeof COUNTRIES)[number], [number, number]> = {
  US: [45_000, 180_000],
  GB: [28_000, 120_000],
  DE: [35_000, 130_000],
  FR: [32_000, 115_000],
  CA: [40_000, 150_000],
  AU: [50_000, 160_000],
  IN: [8_000, 45_000],
  JP: [4_000_000, 15_000_000],
  BR: [25_000, 95_000],
  NL: [38_000, 125_000],
};

function loadNames(filename: string): string[] {
  const filePath = join(process.cwd(), "data", filename);
  return readFileSync(filePath, "utf-8")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

function pick<T>(items: readonly T[]): T {
  return items[randomInt(items.length)]!;
}

function randomSalary(country: (typeof COUNTRIES)[number]): Prisma.Decimal {
  const [min, max] = SALARY_RANGES[country];
  const value = randomInt(min, max + 1);
  return new Prisma.Decimal(value);
}

function randomStartDate(): Date {
  const now = Date.now();
  const fiveYearsMs = 5 * 365 * 24 * 60 * 60 * 1000;
  const offset = randomInt(0, fiveYearsMs);
  return new Date(now - offset);
}

function buildEmployeeRow(
  index: number,
  firstNames: string[],
  lastNames: string[],
): Prisma.EmployeeCreateManyInput {
  const firstName = pick(firstNames);
  const lastName = pick(lastNames);
  const country = pick(COUNTRIES);
  const employmentType =
    randomInt(10) < 8 ? EmploymentType.FULL_TIME : EmploymentType.CONTRACT;

  return {
    fullName: `${firstName} ${lastName}`,
    email: `employee.${index + 1}@salary-management.local`,
    jobTitle: pick(JOB_TITLES),
    country,
    salary: randomSalary(country),
    department: pick(DEPARTMENTS),
    employmentType,
    startDate: randomStartDate(),
  };
}

async function main() {
  const totalStart = performance.now();

  console.log("Loading name files...");
  const loadStart = performance.now();
  const firstNames = loadNames("first_names.txt");
  const lastNames = loadNames("last_names.txt");
  const loadMs = performance.now() - loadStart;
  console.log(
    `Loaded ${firstNames.length} first names and ${lastNames.length} last names (${loadMs.toFixed(0)}ms)`,
  );

  console.log("Clearing existing employees...");
  const clearStart = performance.now();
  const deleted = await prisma.employee.deleteMany();
  const clearMs = performance.now() - clearStart;
  console.log(`Deleted ${deleted.count} rows (${clearMs.toFixed(0)}ms)`);

  console.log(`Generating ${SEED_COUNT} employee rows in memory...`);
  const genStart = performance.now();
  const rows = Array.from({ length: SEED_COUNT }, (_, index) =>
    buildEmployeeRow(index, firstNames, lastNames),
  );
  const genMs = performance.now() - genStart;
  console.log(`Generated ${rows.length} rows (${genMs.toFixed(0)}ms)`);

  console.log(`Inserting in batches of ${BATCH_SIZE}...`);
  const insertStart = performance.now();
  let inserted = 0;

  await prisma.$transaction(async (tx) => {
    for (let offset = 0; offset < rows.length; offset += BATCH_SIZE) {
      const batch = rows.slice(offset, offset + BATCH_SIZE);
      const result = await tx.employee.createMany({ data: batch });
      inserted += result.count;
    }
  });

  const insertMs = performance.now() - insertStart;
  const totalMs = performance.now() - totalStart;
  const finalCount = await prisma.employee.count();

  console.log("");
  console.log("Seed complete");
  console.log(`  Inserted: ${inserted} employees`);
  console.log(`  Verified count: ${finalCount}`);
  console.log(`  Insert time: ${insertMs.toFixed(0)}ms`);
  console.log(`  Total time: ${totalMs.toFixed(0)}ms`);
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
