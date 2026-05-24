"use client";

import { useEffect, useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import type { ListEmployeesQuery } from "@salary-management/shared";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteEmployeeDialog } from "@/components/employees/delete-employee-dialog";
import { EmployeeFilters } from "@/components/employees/employee-filters";
import { EmployeeFormDialog } from "@/components/employees/employee-form-dialog";
import { useEmployees } from "@/hooks/use-employees";
import { formatDate, formatSalary } from "@/lib/format";
import type { Employee } from "@/lib/types";

const PAGE_SIZE = 20;

function useDebouncedValue<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}

export function EmployeesPage() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    search: "",
    country: "",
    jobTitle: "",
  });
  const debouncedSearch = useDebouncedValue(filters.search);
  const [formOpen, setFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(
    null,
  );
  const [sorting, setSorting] = useState<SortingState>([
    { id: "fullName", desc: false },
  ]);
  const activeSort = sorting[0];

  useEffect(() => {
    setPage(1);
  }, [
    debouncedSearch,
    filters.country,
    filters.jobTitle,
    activeSort?.id,
    activeSort?.desc,
  ]);

  const query = useMemo<ListEmployeesQuery>(
    () => ({
      page,
      limit: PAGE_SIZE,
      search: debouncedSearch || undefined,
      country: filters.country || undefined,
      jobTitle: filters.jobTitle || undefined,
      sortBy: (activeSort?.id ?? "fullName") as ListEmployeesQuery["sortBy"],
      sortOrder: activeSort?.desc ? "desc" : "asc",
    }),
    [
      page,
      debouncedSearch,
      filters.country,
      filters.jobTitle,
      activeSort?.id,
      activeSort?.desc,
    ],
  );

  const { data, isLoading, isError, error, isFetching } = useEmployees(query);

  const columns = useMemo<ColumnDef<Employee>[]>(
    () => [
      {
        accessorKey: "fullName",
        header: "Name",
        cell: ({ row }) => (
          <div>
            <div className="font-medium">{row.original.fullName}</div>
            <div className="text-xs text-muted-foreground">
              {row.original.email}
            </div>
          </div>
        ),
      },
      {
        accessorKey: "jobTitle",
        header: "Job title",
      },
      {
        accessorKey: "country",
        header: "Country",
        cell: ({ row }) => (
          <Badge className="border-chart-2/30 bg-chart-2/10 text-chart-2">
            {row.original.country}
          </Badge>
        ),
      },
      {
        accessorKey: "department",
        header: "Department",
        cell: ({ row }) => row.original.department ?? "—",
      },
      {
        accessorKey: "salary",
        header: "Salary",
        cell: ({ row }) =>
          formatSalary(row.original.country, row.original.salary),
      },
      {
        accessorKey: "employmentType",
        header: "Type",
        cell: ({ row }) =>
          row.original.employmentType === "FULL_TIME" ? "Full time" : "Contract",
      },
      {
        accessorKey: "startDate",
        header: "Start",
        cell: ({ row }) => formatDate(row.original.startDate),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <div className="flex justify-end gap-1">
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Edit ${row.original.fullName}`}
              onClick={() => {
                setEditingEmployee(row.original);
                setFormOpen(true);
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Delete ${row.original.fullName}`}
              onClick={() => setDeletingEmployee(row.original)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ),
        enableSorting: false,
      },
    ],
    [],
  );

  const table = useReactTable({
    data: data?.data ?? [],
    columns,
    defaultColumn: {
      sortDescFirst: false,
    },
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    pageCount: data?.pagination.totalPages ?? 0,
  });

  const pagination = data?.pagination;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-chart-2">
            Directory
          </p>
          <h1 className="text-2xl font-bold tracking-tight">Employees</h1>
          <p className="text-sm text-muted-foreground">
            Manage your workforce directory with search, filters, and pagination.
          </p>
        </div>
        <Button
          className="shadow-md shadow-primary/20"
          onClick={() => {
            setEditingEmployee(null);
            setFormOpen(true);
          }}
        >
          <Plus className="h-4 w-4" />
          Add employee
        </Button>
      </div>

      <EmployeeFilters filters={filters} onChange={setFilters} />

      <div className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm">
        {isLoading ? (
          <div className="space-y-3 p-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <Skeleton key={index} className="h-10 w-full" />
            ))}
          </div>
        ) : isError ? (
          <div className="p-8 text-center text-sm text-destructive">
            Failed to load employees: {error.message}
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      const sortDirection = header.column.getIsSorted();

                      return (
                        <TableHead
                          key={header.id}
                          aria-sort={
                            sortDirection === "asc"
                              ? "ascending"
                              : sortDirection === "desc"
                                ? "descending"
                                : undefined
                          }
                        >
                          {header.isPlaceholder ? null : header.column.getCanSort() ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              type="button"
                              className="-ml-3 h-8 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground"
                              onClick={header.column.getToggleSortingHandler()}
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                              {sortDirection === "asc" ? (
                                <ArrowUp className="h-3.5 w-3.5" />
                              ) : sortDirection === "desc" ? (
                                <ArrowDown className="h-3.5 w-3.5" />
                              ) : (
                                <ArrowUpDown className="h-3.5 w-3.5 opacity-55" />
                              )}
                            </Button>
                          ) : (
                            flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )
                          )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No employees match your filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {pagination && (
              <div className="flex flex-col gap-3 border-t px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {(pagination.page - 1) * pagination.limit + 1}–
                  {Math.min(
                    pagination.page * pagination.limit,
                    pagination.total,
                  )}{" "}
                  of {pagination.total.toLocaleString()} employees
                  {isFetching && " · Updating…"}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.page <= 1}
                    onClick={() => setPage((current) => current - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <span className="text-sm tabular-nums">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() => setPage((current) => current + 1)}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <EmployeeFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        employee={editingEmployee}
      />

      <DeleteEmployeeDialog
        employee={deletingEmployee}
        open={Boolean(deletingEmployee)}
        onOpenChange={(open) => {
          if (!open) setDeletingEmployee(null);
        }}
      />
    </div>
  );
}
