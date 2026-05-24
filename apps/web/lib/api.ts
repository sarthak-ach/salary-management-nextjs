import type {
  CreateEmployeeInput,
  ListEmployeesQuery,
  UpdateEmployeeInput,
} from "@salary-management/shared";
import type {
  CountryInsights,
  CountryJobTitleInsights,
  Employee,
  InsightsSummary,
  PaginatedEmployees,
} from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;
    throw new ApiError(
      response.status,
      body?.error ?? response.statusText,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

function buildQuery(params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") {
      search.set(key, String(value));
    }
  }
  const query = search.toString();
  return query ? `?${query}` : "";
}

export const api = {
  listEmployees(query: ListEmployeesQuery) {
    return request<PaginatedEmployees>(
      `/employees${buildQuery({
        page: query.page,
        limit: query.limit,
        country: query.country,
        jobTitle: query.jobTitle,
        search: query.search,
        sortBy: query.sortBy,
        sortOrder: query.sortOrder,
      })}`,
    );
  },

  getEmployee(id: string) {
    return request<Employee>(`/employees/${id}`);
  },

  createEmployee(input: CreateEmployeeInput) {
    return request<Employee>("/employees", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  updateEmployee(id: string, input: UpdateEmployeeInput) {
    return request<Employee>(`/employees/${id}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    });
  },

  deleteEmployee(id: string) {
    return request<void>(`/employees/${id}`, { method: "DELETE" });
  },

  getInsightsSummary() {
    return request<InsightsSummary>("/insights/summary");
  },

  getCountryInsights(country: string) {
    return request<CountryInsights>(
      `/insights/country/${encodeURIComponent(country)}`,
    );
  },

  getCountryJobTitleInsights(country: string, jobTitle: string) {
    return request<CountryJobTitleInsights>(
      `/insights/country/${encodeURIComponent(country)}/job-title/${encodeURIComponent(jobTitle)}`,
    );
  },
};
