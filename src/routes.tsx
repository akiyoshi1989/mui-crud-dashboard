import type { RouteObject } from 'react-router';
import AppLayout from './layouts/AppLayout';
import EmployeeCreatePage from './pages/EmployeeCreatePage';
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
      { path: '*', Component: NotFoundPage },
    ],
  },
];
