export interface SalaryStats {
  min: number;
  max: number;
  avg: number;
  count: number;
}

export interface SalaryBand {
  label: string;
  min: number;
  max: number | null;
}

export const SALARY_BANDS: SalaryBand[] = [
  { label: "Under 50k", min: 0, max: 50_000 },
  { label: "50k - 75k", min: 50_000, max: 75_000 },
  { label: "75k - 100k", min: 75_000, max: 100_000 },
  { label: "100k - 150k", min: 100_000, max: 150_000 },
  { label: "150k+", min: 150_000, max: null },
];

export function computeSalaryStats(salaries: number[]): SalaryStats {
  if (salaries.length === 0) {
    return { min: 0, max: 0, avg: 0, count: 0 };
  }

  const min = Math.min(...salaries);
  const max = Math.max(...salaries);
  const avg = salaries.reduce((sum, value) => sum + value, 0) / salaries.length;

  return { min, max, avg, count: salaries.length };
}

export function classifySalaryBand(salary: number): string {
  for (const band of SALARY_BANDS) {
    if (band.max === null) {
      if (salary >= band.min) {
        return band.label;
      }
      continue;
    }

    if (salary >= band.min && salary < band.max) {
      return band.label;
    }
  }

  return SALARY_BANDS[SALARY_BANDS.length - 1]!.label;
}

export function computeSalaryBandDistribution(
  salaries: number[],
): { label: string; count: number }[] {
  const counts = new Map<string, number>(
    SALARY_BANDS.map((band) => [band.label, 0]),
  );

  for (const salary of salaries) {
    const label = classifySalaryBand(salary);
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }

  return SALARY_BANDS.map((band) => ({
    label: band.label,
    count: counts.get(band.label) ?? 0,
  }));
}
