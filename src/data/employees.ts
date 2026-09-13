import employeesJson from './employees.json';

export type EmployeeRole = 'Market' | 'Finance' | 'Development';

export type Employee = {
  id: number;
  name: string;
  age: number;
  joinDate: string;
  role: EmployeeRole;
  isFullTime: boolean;
};

export type EmployeeColumnType = 'text' | 'date' | 'boolean';

export type EmployeeColumn = {
  field: keyof Employee;
  header: string;
  type?: EmployeeColumnType;
};

export const employeeColumns: EmployeeColumn[] = [
  { field: 'id', header: 'ID' },
  { field: 'name', header: 'Name' },
  { field: 'age', header: 'Age' },
  { field: 'joinDate', header: 'Join date', type: 'date' },
  { field: 'role', header: 'Department' },
  { field: 'isFullTime', header: 'Full-time', type: 'boolean' },
];

export function getEmployees(): Employee[] {
  return employeesJson as Employee[];
}

export function formatJoinDate(isoDate: string): string {
  return isoDate.slice(0, 10);
}

export function formatFullTime(isFullTime: boolean): string {
  return isFullTime ? 'Yes' : 'No';
}

export function formatEmployeeValue(employee: Employee, column: EmployeeColumn): string {
  const value = employee[column.field];

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
  const value = formatEmployeeValue(employee, column).toLowerCase();

  if (column.type === 'date') {
    return value === query;
  }

  return value.includes(query);
}

export function filterEmployees(
  employees: Employee[],
  query: string,
  columns: EmployeeColumn[] = employeeColumns,
): Employee[] {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return employees;
  }

  return employees.filter((employee) =>
    columns.some((column) => matchesEmployeeColumn(employee, column, normalized)),
  );
}
