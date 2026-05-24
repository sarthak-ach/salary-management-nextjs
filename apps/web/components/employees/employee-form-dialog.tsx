"use client";

import { useEffect, useState } from "react";
import type {
  CreateEmployeeInput,
  EmploymentType,
} from "@salary-management/shared";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  COUNTRIES,
  DEPARTMENTS,
  EMPLOYMENT_TYPES,
  JOB_TITLES,
} from "@/lib/constants";
import { toDateInputValue } from "@/lib/format";
import type { Employee } from "@/lib/types";
import { useCreateEmployee, useUpdateEmployee } from "@/hooks/use-employees";
import { ApiError } from "@/lib/api";
import { toast } from "sonner";

interface EmployeeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee?: Employee | null;
}

interface FormState {
  fullName: string;
  email: string;
  jobTitle: string;
  country: string;
  salary: string;
  department: string;
  employmentType: EmploymentType;
  startDate: string;
}

const emptyForm = (): FormState => ({
  fullName: "",
  email: "",
  jobTitle: JOB_TITLES[0],
  country: COUNTRIES[0],
  salary: "",
  department: "",
  employmentType: "FULL_TIME",
  startDate: "",
});

function employeeToForm(employee: Employee): FormState {
  return {
    fullName: employee.fullName,
    email: employee.email,
    jobTitle: employee.jobTitle,
    country: employee.country,
    salary: String(employee.salary),
    department: employee.department ?? "",
    employmentType: employee.employmentType,
    startDate: toDateInputValue(employee.startDate),
  };
}

function formToPayload(form: FormState): CreateEmployeeInput {
  return {
    fullName: form.fullName.trim(),
    email: form.email.trim(),
    jobTitle: form.jobTitle,
    country: form.country,
    salary: Number(form.salary),
    department: form.department.trim() || undefined,
    employmentType: form.employmentType,
    startDate: form.startDate ? new Date(form.startDate) : undefined,
  };
}

export function EmployeeFormDialog({
  open,
  onOpenChange,
  employee,
}: EmployeeFormDialogProps) {
  const isEdit = Boolean(employee);
  const [form, setForm] = useState<FormState>(emptyForm);
  const createMutation = useCreateEmployee();
  const updateMutation = useUpdateEmployee();
  const isPending = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (open) {
      setForm(employee ? employeeToForm(employee) : emptyForm());
    }
  }, [open, employee]);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    try {
      const payload = formToPayload(form);

      if (isEdit && employee) {
        await updateMutation.mutateAsync({ id: employee.id, input: payload });
        toast.success("Employee updated");
      } else {
        await createMutation.mutateAsync(payload);
        toast.success("Employee created");
      }

      onOpenChange(false);
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : "Something went wrong";
      toast.error(message);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit employee" : "Add employee"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update employee details and save changes."
              : "Create a new employee record."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="fullName">Full name</Label>
            <Input
              id="fullName"
              required
              value={form.fullName}
              onChange={(event) => updateField("fullName", event.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label>Job title</Label>
              <Select
                value={form.jobTitle}
                onValueChange={(value) => updateField("jobTitle", value)}
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

            <div className="grid gap-2">
              <Label>Country</Label>
              <Select
                value={form.country}
                onValueChange={(value) => updateField("country", value)}
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
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="salary">Salary</Label>
              <Input
                id="salary"
                type="number"
                min={1}
                required
                value={form.salary}
                onChange={(event) => updateField("salary", event.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label>Employment type</Label>
              <Select
                value={form.employmentType}
                onValueChange={(value) =>
                  updateField("employmentType", value as EmploymentType)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EMPLOYMENT_TYPES.map(({ value, label }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label>Department</Label>
              <Select
                value={form.department || "none"}
                onValueChange={(value) =>
                  updateField("department", value === "none" ? "" : value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Optional" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {DEPARTMENTS.map((department) => (
                    <SelectItem key={department} value={department}>
                      {department}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="startDate">Start date</Label>
              <Input
                id="startDate"
                type="date"
                value={form.startDate}
                onChange={(event) =>
                  updateField("startDate", event.target.value)
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving…" : isEdit ? "Save changes" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
