import type { RouteObject } from 'react-router';
import AppLayout from './layouts/AppLayout';
import EmployeeCreatePage from './pages/EmployeeCreatePage';
import EmployeeDetailPage from './pages/EmployeeDetailPage';
import EmployeeEditPage from './pages/EmployeeEditPage';
import EmployeeListPage from './pages/EmployeeListPage';
import NotFoundPage from './pages/NotFoundPage';

export const routes: RouteObject[] = [
  {
    path: '/',
    Component: AppLayout,
    children: [
      { index: true, Component: EmployeeListPage },
      { path: 'employees', Component: EmployeeListPage },
      { path: 'employees/new', Component: EmployeeCreatePage },
      { path: 'employees/:employeeId/edit', Component: EmployeeEditPage },
      { path: 'employees/:employeeId', Component: EmployeeDetailPage },
      { path: '*', Component: NotFoundPage },
    ],
  },
];
