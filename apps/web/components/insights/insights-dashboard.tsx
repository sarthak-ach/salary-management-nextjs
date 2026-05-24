"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCountryInsights,
  useCountryJobTitleInsights,
  useInsightsSummary,
} from "@/hooks/use-insights";
import { COUNTRIES, JOB_TITLES } from "@/lib/constants";
import { formatNumber, formatSalary } from "@/lib/format";
import { cn } from "@/lib/utils";

export function InsightsDashboard() {
  const [selectedCountry, setSelectedCountry] = useState<string>(COUNTRIES[0]);
  const [selectedJobTitle, setSelectedJobTitle] = useState<string>(
    JOB_TITLES[0],
  );

  const summaryQuery = useInsightsSummary();
  const countryQuery = useCountryInsights(selectedCountry);
  const jobTitleQuery = useCountryJobTitleInsights(
    selectedCountry,
    selectedJobTitle,
  );

  const maxHeadcount = Math.max(
    ...(summaryQuery.data?.headcountByCountry.map((row) => row.count) ?? [1]),
  );
  const maxBandCount = Math.max(
    ...(summaryQuery.data?.salaryBands.map((band) => band.count) ?? [1]),
  );

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-chart-3">
          Analytics
        </p>
        <h1 className="text-2xl font-bold tracking-tight">
          <span className="text-gradient">Salary insights</span>
        </h1>
        <p className="text-sm text-muted-foreground">
          Organization-wide metrics with country and job-title drill-down.
        </p>
      </div>

      {summaryQuery.isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-28" />
          ))}
        </div>
      ) : summaryQuery.isError ? (
        <Card>
          <CardContent className="py-8 text-center text-sm text-destructive">
            Failed to load insights: {summaryQuery.error.message}
          </CardContent>
        </Card>
      ) : summaryQuery.data ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Total employees"
              value={formatNumber(summaryQuery.data.totalEmployees)}
              description="Across all countries"
              accent="chart-1"
            />
            <MetricCard
              title="Countries"
              value={formatNumber(
                summaryQuery.data.headcountByCountry.length,
              )}
              description="With active headcount"
              accent="chart-2"
            />
            <MetricCard
              title="Top job title"
              value={summaryQuery.data.topJobTitles[0]?.jobTitle ?? "—"}
              description={
                summaryQuery.data.topJobTitles[0]
                  ? `${formatNumber(summaryQuery.data.topJobTitles[0].count)} employees`
                  : "No data"
              }
              accent="chart-3"
            />
            <MetricCard
              title="Largest band"
              value={
                [...summaryQuery.data.salaryBands].sort(
                  (a, b) => b.count - a.count,
                )[0]?.label ?? "—"
              }
              description="By employee count"
              accent="chart-4"
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Headcount by country</CardTitle>
                <CardDescription>Employee distribution</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {summaryQuery.data.headcountByCountry.map((row, index) => (
                  <div key={row.country} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{row.country}</span>
                      <span className="text-muted-foreground">
                        {formatNumber(row.count)}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          index % 5 === 0 && "bg-chart-1",
                          index % 5 === 1 && "bg-chart-2",
                          index % 5 === 2 && "bg-chart-3",
                          index % 5 === 3 && "bg-chart-4",
                          index % 5 === 4 && "bg-chart-5",
                        )}
                        style={{
                          width: `${(row.count / maxHeadcount) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Salary bands</CardTitle>
                <CardDescription>Global distribution</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {summaryQuery.data.salaryBands.map((band, index) => (
                  <div key={band.label} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{band.label}</span>
                      <span className="text-muted-foreground">
                        {formatNumber(band.count)}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          index % 5 === 0 && "bg-chart-5",
                          index % 5 === 1 && "bg-chart-4",
                          index % 5 === 2 && "bg-chart-3",
                          index % 5 === 3 && "bg-chart-2",
                          index % 5 === 4 && "bg-chart-1",
                        )}
                        style={{
                          width: `${(band.count / maxBandCount) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Top job titles</CardTitle>
              <CardDescription>Most common roles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {summaryQuery.data.topJobTitles.map((row) => (
                  <Button
                    key={row.jobTitle}
                    variant={
                      selectedJobTitle === row.jobTitle ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => {
                      setSelectedJobTitle(row.jobTitle);
                    }}
                  >
                    {row.jobTitle}
                    <span className="ml-1 text-xs opacity-70">
                      ({formatNumber(row.count)})
                    </span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Country drill-down</CardTitle>
          <CardDescription>
            Min, max, and average salary for a selected country
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {COUNTRIES.map((country) => (
              <Button
                key={country}
                variant={selectedCountry === country ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCountry(country)}
              >
                {country}
              </Button>
            ))}
          </div>

          {countryQuery.isLoading ? (
            <div className="grid gap-4 sm:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-20" />
              ))}
            </div>
          ) : countryQuery.isError ? (
            <p className="text-sm text-destructive">
              {countryQuery.error.message}
            </p>
          ) : countryQuery.data ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <MetricCard
                title="Employees"
                value={formatNumber(countryQuery.data.count)}
              />
              <MetricCard
                title="Minimum"
                value={formatSalary(
                  countryQuery.data.country,
                  countryQuery.data.min,
                )}
              />
              <MetricCard
                title="Average"
                value={formatSalary(
                  countryQuery.data.country,
                  countryQuery.data.avg,
                )}
              />
              <MetricCard
                title="Maximum"
                value={formatSalary(
                  countryQuery.data.country,
                  countryQuery.data.max,
                )}
              />
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Job title in country</CardTitle>
          <CardDescription>
            Average salary for a specific role within the selected country
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <p className="text-sm font-medium">Country</p>
              <Select
                value={selectedCountry}
                onValueChange={setSelectedCountry}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Job title</p>
              <Select
                value={selectedJobTitle}
                onValueChange={setSelectedJobTitle}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {JOB_TITLES.map((title) => (
                    <SelectItem key={title} value={title}>
                      {title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {jobTitleQuery.isLoading ? (
            <Skeleton className="h-20 w-full max-w-sm" />
          ) : jobTitleQuery.isError ? (
            <p className="text-sm text-destructive">
              {jobTitleQuery.error.message}
            </p>
          ) : jobTitleQuery.data ? (
            <div
              className={cn(
                "rounded-xl border border-chart-3/30 bg-gradient-to-br from-chart-3/10 to-chart-2/5 p-4",
                jobTitleQuery.data.count === 0 && "text-muted-foreground",
              )}
            >
              <p className="text-sm text-muted-foreground">
                {jobTitleQuery.data.jobTitle} · {jobTitleQuery.data.country}
              </p>
              <p className="mt-1 text-2xl font-semibold">
                {jobTitleQuery.data.count > 0
                  ? formatSalary(
                      jobTitleQuery.data.country,
                      jobTitleQuery.data.avg,
                    )
                  : "No employees"}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {formatNumber(jobTitleQuery.data.count)} employees in this
                segment
              </p>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

const accentStyles = {
  "chart-1": "border-chart-1/30 from-chart-1/10",
  "chart-2": "border-chart-2/30 from-chart-2/10",
  "chart-3": "border-chart-3/30 from-chart-3/10",
  "chart-4": "border-chart-4/30 from-chart-4/10",
  "chart-5": "border-chart-5/30 from-chart-5/10",
} as const;

function MetricCard({
  title,
  value,
  description,
  accent = "chart-1",
}: {
  title: string;
  value: string;
  description?: string;
  accent?: keyof typeof accentStyles;
}) {
  return (
    <Card
      className={cn(
        "border bg-gradient-to-br to-transparent",
        accentStyles[accent],
      )}
    >
      <CardHeader className="pb-2">
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-2xl">{value}</CardTitle>
      </CardHeader>
      {description && (
        <CardContent className="pt-0 text-xs text-muted-foreground">
          {description}
        </CardContent>
      )}
    </Card>
  );
}
