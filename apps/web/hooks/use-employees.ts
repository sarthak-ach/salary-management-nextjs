"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type {
  CreateEmployeeInput,
  ListEmployeesQuery,
  UpdateEmployeeInput,
} from "@salary-management/shared";
import { api } from "@/lib/api";
import { insightKeys } from "@/hooks/use-insights";

export const employeeKeys = {
  all: ["employees"] as const,
  lists: () => [...employeeKeys.all, "list"] as const,
  list: (query: ListEmployeesQuery) => [...employeeKeys.lists(), query] as const,
  detail: (id: string) => [...employeeKeys.all, "detail", id] as const,
};

export function useEmployees(query: ListEmployeesQuery) {
  return useQuery({
    queryKey: employeeKeys.list(query),
    queryFn: () => api.listEmployees(query),
    placeholderData: keepPreviousData,
  });
}

export function useCreateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateEmployeeInput) => api.createEmployee(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: insightKeys.all });
    },
  });
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateEmployeeInput }) =>
      api.updateEmployee(id, input),
    onSuccess: (employee) => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: insightKeys.all });
      queryClient.setQueryData(employeeKeys.detail(employee.id), employee);
    },
  });
}

export function useDeleteEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.deleteEmployee(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: insightKeys.all });
    },
  });
}
