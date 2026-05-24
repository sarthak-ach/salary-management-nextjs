"use client";

import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COUNTRIES, JOB_TITLES } from "@/lib/constants";

export interface EmployeeFiltersState {
  search: string;
  country: string;
  jobTitle: string;
}

interface EmployeeFiltersProps {
  filters: EmployeeFiltersState;
  onChange: (filters: EmployeeFiltersState) => void;
}

export function EmployeeFilters({ filters, onChange }: EmployeeFiltersProps) {
  const hasFilters =
    filters.search !== "" ||
    filters.country !== "" ||
    filters.jobTitle !== "";

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <div className="relative min-w-[200px] flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search name or email…"
          className="pl-9"
          value={filters.search}
          onChange={(event) =>
            onChange({ ...filters, search: event.target.value })
          }
        />
      </div>

      <Select
        value={filters.country || "all"}
        onValueChange={(value) =>
          onChange({ ...filters, country: value === "all" ? "" : value })
        }
      >
        <SelectTrigger className="w-full sm:w-[140px]">
          <SelectValue placeholder="Country" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All countries</SelectItem>
          {COUNTRIES.map((country) => (
            <SelectItem key={country} value={country}>
              {country}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.jobTitle || "all"}
        onValueChange={(value) =>
          onChange({ ...filters, jobTitle: value === "all" ? "" : value })
        }
      >
        <SelectTrigger className="w-full sm:w-[220px]">
          <SelectValue placeholder="Job title" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All job titles</SelectItem>
          {JOB_TITLES.map((title) => (
            <SelectItem key={title} value={title}>
              {title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            onChange({ search: "", country: "", jobTitle: "" })
          }
        >
          <X className="h-4 w-4" />
          Clear
        </Button>
      )}
    </div>
  );
}
