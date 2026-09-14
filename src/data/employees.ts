import { z } from 'zod';
import dbJson from './db.json';
import {
  EmployeeApiError,
  type EmployeeApiErrorCode,
  employeeApiErrorCodes,
} from './employee-api-error';

export const employeeRoleSchema = z.enum(['Market', 'Finance', 'Development']);

export type EmployeeRole = z.infer<typeof employeeRoleSchema>;

export type Employee = {
  id: number;
  name: string;
  age: number;
  joinDate: string;
  role: EmployeeRole;
  isFullTime: boolean;
  birthDate?: string;
};

export type EmployeeColumnType = 'text' | 'date' | 'boolean';

export type EmployeeColumn = {
  field: keyof Employee;
  header: string;
  type?: EmployeeColumnType;
};

const formStringSchema = z.string().catch('');

export const employeeFormDataSchema = z.object({
  name: formStringSchema,
  age: formStringSchema,
  joinDate: formStringSchema,
  role: formStringSchema.pipe(employeeRoleSchema.or(z.literal('')).catch('')),
  isFullTime: z
    .string()
    .optional()
    .transform((value) => value !== undefined),
});

export const employeeFormSchema = z.object({
  name: z.string().trim().min(1, { error: 'Name is required' }),
  age: z
    .string()
    .trim()
    .min(1, { error: 'Age is required' })
    .refine((value) => /^\d+$/.test(value) && Number(value) > 0, {
      error: 'Age must be a positive number',
    }),
  joinDate: z.string().min(1, { error: 'Join date is required' }),
  role: z.enum(employeeRoleSchema.options, { error: 'Department is required' }),
  isFullTime: z.boolean(),
});

export type EmployeeFormValues = z.output<typeof employeeFormDataSchema>;
export type EmployeeFormErrors = Partial<Record<keyof EmployeeFormValues, string>>;

export const employeesApiPath = '/api/employees';

export function employeeApiPath(employeeId: number): string {
  return `${employeesApiPath}/${employeeId}`;
}

export const employeeRoles = employeeRoleSchema.options;

export const employeeColumns: EmployeeColumn[] = [
  { field: 'id', header: 'ID' },
  { field: 'name', header: 'Name' },
  { field: 'age', header: 'Age' },
  { field: 'joinDate', header: 'Join date', type: 'date' },
  { field: 'role', header: 'Department' },
  { field: 'isFullTime', header: 'Full-time', type: 'boolean' },
];

export const employeeDetailColumns: EmployeeColumn[] = [
  ...employeeColumns,
  { field: 'birthDate', header: 'Date of birth', type: 'date' },
];

export const defaultSearchField: keyof Employee = 'name';

export const emptyEmployeeFormValues: EmployeeFormValues = employeeFormDataSchema.parse({});

export const employeeSeed = dbJson.employees as Employee[];

export function getEmployeeFormColumns(): EmployeeColumn[] {
  return employeeColumns.filter((column) => column.field !== 'id');
}

export function getEmployeeColumn(field: keyof Employee): EmployeeColumn {
  return employeeColumns.find((column) => column.field === field) ?? employeeColumns[0];
}

export function employeeFormValuesFromFormData(formData: FormData): EmployeeFormValues {
  return employeeFormDataSchema.parse(Object.fromEntries(formData));
}

export function toEmployeePayload(
  values: z.output<typeof employeeFormSchema>,
): Omit<Employee, 'id'> {
  return {
    name: values.name.trim(),
    age: Number(values.age),
    joinDate: `${values.joinDate}T00:00:00.000Z`,
    role: values.role,
    isFullTime: values.isFullTime,
  };
}

async function parseEmployeeResponse(
  response: Response,
  code: EmployeeApiErrorCode,
): Promise<Employee> {
  if (!response.ok) {
    throw new EmployeeApiError(code);
  }

  return (await response.json()) as Employee;
}

export async function getEmployee(employeeId: number): Promise<Employee> {
  try {
    const response = await fetch(employeeApiPath(employeeId));

    return await parseEmployeeResponse(response, employeeApiErrorCodes.loadEmployee);
  } catch (error) {
    if (error instanceof EmployeeApiError) {
      throw error;
    }

    throw new EmployeeApiError(employeeApiErrorCodes.loadEmployee);
  }
}

export async function getEmployees(): Promise<Employee[]> {
  try {
    const response = await fetch(employeesApiPath);

    if (!response.ok) {
      throw new EmployeeApiError(employeeApiErrorCodes.loadEmployees);
    }

    return (await response.json()) as Employee[];
  } catch (error) {
    if (error instanceof EmployeeApiError) {
      throw error;
    }

    throw new EmployeeApiError(employeeApiErrorCodes.loadEmployees);
  }
}

export function formatJoinDate(isoDate: string): string {
  return isoDate.slice(0, 10);
}

export function formatFullTime(isFullTime: boolean): string {
  return isFullTime ? 'Yes' : 'No';
}

export function formatEmployeeValue(employee: Employee, column: EmployeeColumn): string {
  const value = employee[column.field];

  if (value === undefined) {
    return '';
  }

  if (column.type === 'date' && typeof value === 'string') {
    return formatJoinDate(value);
  }

  if (column.type === 'boolean' && typeof value === 'boolean') {
    return formatFullTime(value);
  }

  return String(value);
}

export function matchesEmployeeColumn(
  employee: Employee,
  column: EmployeeColumn,
  query: string,
): boolean {
  return formatEmployeeValue(employee, column).toLowerCase().includes(query);
}

export function filterEmployees(
  employeesToFilter: Employee[],
  query: string,
  column: EmployeeColumn,
): Employee[] {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return employeesToFilter;
  }

  return employeesToFilter.filter((employee) =>
    matchesEmployeeColumn(employee, column, normalized),
  );
}

export function validateEmployeeForm(values: EmployeeFormValues): EmployeeFormErrors {
  const result = employeeFormSchema.safeParse(values);

  if (result.success) {
    return {};
  }

  const { fieldErrors } = z.flattenError(result.error);
  const errors: EmployeeFormErrors = {};

  for (const field of employeeFormSchema.keyof().options) {
    const message = fieldErrors[field]?.[0];

    if (message) {
      errors[field] = message;
    }
  }

  return errors;
}

export async function createEmployee(values: EmployeeFormValues): Promise<Employee> {
  const parsed = employeeFormSchema.safeParse(values);

  if (!parsed.success) {
    throw new EmployeeApiError(employeeApiErrorCodes.invalidEmployeeForm);
  }

  try {
    const response = await fetch(employeesApiPath, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(toEmployeePayload(parsed.data)),
    });

    return await parseEmployeeResponse(response, employeeApiErrorCodes.createEmployee);
  } catch (error) {
    if (error instanceof EmployeeApiError) {
      throw error;
    }

    throw new EmployeeApiError(employeeApiErrorCodes.createEmployee);
  }
}

export async function deleteEmployee(employeeId: number): Promise<void> {
  try {
    const response = await fetch(employeeApiPath(employeeId), { method: 'DELETE' });

    if (!response.ok) {
      throw new EmployeeApiError(employeeApiErrorCodes.deleteEmployee);
    }
  } catch (error) {
    if (error instanceof EmployeeApiError) {
      throw error;
    }

    throw new EmployeeApiError(employeeApiErrorCodes.deleteEmployee);
  }
}
