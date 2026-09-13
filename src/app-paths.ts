export const appPaths = {
  home: '/',
  employees: '/employees',
  employeeNew: '/employees/new',
  employee: (employeeId: string) => `/employees/${employeeId}`,
  employeeEdit: (employeeId: string) => `/employees/${employeeId}/edit`,
  reports: '/reports',
  reportsSales: '/reports/sales',
  reportsTraffic: '/reports/traffic',
  integrations: '/integrations',
} as const;
