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

export type EmployeeFormValues = {
  name: string;
  age: string;
  joinDate: string;
  role: EmployeeRole | '';
  isFullTime: boolean;
};

export type EmployeeFormErrors = Partial<Record<keyof EmployeeFormValues, string>>;

export const employeeRoles: EmployeeRole[] = ['Market', 'Finance', 'Development'];

export const employeeColumns: EmployeeColumn[] = [
  { field: 'id', header: 'ID' },
  { field: 'name', header: 'Name' },
  { field: 'age', header: 'Age' },
  { field: 'joinDate', header: 'Join date', type: 'date' },
  { field: 'role', header: 'Department' },
  { field: 'isFullTime', header: 'Full-time', type: 'boolean' },
];

export const defaultSearchField: keyof Employee = 'name';

export const emptyEmployeeFormValues: EmployeeFormValues = {
  name: '',
  age: '',
  joinDate: '',
  role: '',
  isFullTime: false,
};

let employees = cloneEmployees();

function cloneEmployees(): Employee[] {
  return structuredClone(employeesJson) as Employee[];
}

export function getEmployeeFormColumns(): EmployeeColumn[] {
  return employeeColumns.filter((column) => column.field !== 'id');
}

export function getEmployeeColumn(field: keyof Employee): EmployeeColumn {
  return employeeColumns.find((column) => column.field === field) ?? employeeColumns[0];
}

export function getEmployees(): Employee[] {
  return employees;
}

export function resetEmployees(): void {
  employees = cloneEmployees();
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
  const errors: EmployeeFormErrors = {};

  if (!values.name.trim()) {
    errors.name = 'Name is required';
  }

  if (!values.age.trim()) {
    errors.age = 'Age is required';
  } else if (!/^\d+$/.test(values.age) || Number(values.age) <= 0) {
    errors.age = 'Age must be a positive number';
  }

  if (!values.joinDate) {
    errors.joinDate = 'Join date is required';
  }

  if (!values.role) {
    errors.role = 'Department is required';
  }

  return errors;
}

export function createEmployee(values: EmployeeFormValues): Employee {
  const errors = validateEmployeeForm(values);

  if (Object.keys(errors).length > 0) {
    throw new Error('Employee form is invalid');
  }

  const nextId = employees.reduce((max, employee) => Math.max(max, employee.id), 0) + 1;
  const employee: Employee = {
    id: nextId,
    name: values.name.trim(),
    age: Number(values.age),
    joinDate: `${values.joinDate}T00:00:00.000Z`,
    role: values.role as EmployeeRole,
    isFullTime: values.isFullTime,
  };

  employees = [...employees, employee];
  return employee;
}
