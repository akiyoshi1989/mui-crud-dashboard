export const appPaths = {
  home: '/',
  employees: '/employees',
  employeeNew: '/employees/new',
  employee: (employeeId: string) => `/employees/${employeeId}`,
  employeeEdit: (employeeId: string) => `/employees/${employeeId}/edit`,
} as const;
