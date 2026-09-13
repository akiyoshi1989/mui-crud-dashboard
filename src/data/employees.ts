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

export function getEmployees(): Employee[] {
  return employeesJson as Employee[];
}

export function formatJoinDate(isoDate: string): string {
  return isoDate.slice(0, 10);
}

export function formatFullTime(isFullTime: boolean): string {
  return isFullTime ? 'Yes' : 'No';
}

export function getEmployeeSearchText(employee: Employee): string {
  return [
    String(employee.id),
    employee.name,
    String(employee.age),
    formatJoinDate(employee.joinDate),
    employee.role,
    formatFullTime(employee.isFullTime),
  ]
    .join(' ')
    .toLowerCase();
}

export function filterEmployees(employees: Employee[], query: string): Employee[] {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return employees;
  }

  return employees.filter((employee) => getEmployeeSearchText(employee).includes(normalized));
}
