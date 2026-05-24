"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Employee } from "@/lib/types";
import { useDeleteEmployee } from "@/hooks/use-employees";
import { ApiError } from "@/lib/api";
import { toast } from "sonner";

interface DeleteEmployeeDialogProps {
  employee: Employee | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteEmployeeDialog({
  employee,
  open,
  onOpenChange,
}: DeleteEmployeeDialogProps) {
  const deleteMutation = useDeleteEmployee();

  async function handleDelete() {
    if (!employee) return;

    try {
      await deleteMutation.mutateAsync(employee.id);
      toast.success("Employee deleted");
      onOpenChange(false);
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : "Something went wrong";
      toast.error(message);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete employee?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently remove{" "}
            <strong>{employee?.fullName}</strong> from the directory. This
            action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={deleteMutation.isPending}
            onClick={(event) => {
              event.preventDefault();
              void handleDelete();
            }}
          >
            {deleteMutation.isPending ? "Deleting…" : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
