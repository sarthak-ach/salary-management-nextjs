import type { EmploymentType } from "@salary-management/shared";

export interface Employee {
  id: string;
  fullName: string;
  email: string;
  jobTitle: string;
  country: string;
  salary: number;
  department: string | null;
  employmentType: EmploymentType;
  startDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedEmployees {
  data: Employee[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CountryInsights {
  country: string;
  min: number;
  max: number;
  avg: number;
  count: number;
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
