import type {
  CreateEmployeeInput,
  ListEmployeesQuery,
  UpdateEmployeeInput,
} from "@salary-management/shared";

declare global {
  namespace Express {
    interface Request {
      validated?: {
        body?: CreateEmployeeInput | UpdateEmployeeInput;
        query?: ListEmployeesQuery;
        params?: Record<string, string>;
      };
    }
  }
}

export {};
