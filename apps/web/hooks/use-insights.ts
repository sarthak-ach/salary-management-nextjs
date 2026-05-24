"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const insightKeys = {
  all: ["insights"] as const,
  summary: () => [...insightKeys.all, "summary"] as const,
  country: (country: string) => [...insightKeys.all, "country", country] as const,
  countryJobTitle: (country: string, jobTitle: string) =>
    [...insightKeys.all, "country", country, "jobTitle", jobTitle] as const,
};

export function useInsightsSummary() {
  return useQuery({
    queryKey: insightKeys.summary(),
    queryFn: () => api.getInsightsSummary(),
  });
}

export function useCountryInsights(country: string | null) {
  return useQuery({
    queryKey: insightKeys.country(country ?? ""),
    queryFn: () => api.getCountryInsights(country!),
    enabled: Boolean(country),
  });
}

export function useCountryJobTitleInsights(
  country: string | null,
  jobTitle: string | null,
) {
  return useQuery({
    queryKey: insightKeys.countryJobTitle(country ?? "", jobTitle ?? ""),
    queryFn: () => api.getCountryJobTitleInsights(country!, jobTitle!),
    enabled: Boolean(country && jobTitle),
  });
}
