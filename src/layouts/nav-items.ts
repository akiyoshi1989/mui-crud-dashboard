import { appPaths } from '../app-paths';

export type NavItem = {
  id: string;
  label: string;
  path: string;
  children?: NavItem[];
};

export const mainNavItems: NavItem[] = [
  {
    id: 'employees',
    label: 'Employees',
    path: appPaths.employees,
  },
];

export const exampleNavItems: NavItem[] = [
  {
    id: 'reports',
    label: 'Reports',
    path: appPaths.reports,
    children: [
      { id: 'reports-sales', label: 'Sales', path: appPaths.reportsSales },
      { id: 'reports-traffic', label: 'Traffic', path: appPaths.reportsTraffic },
    ],
  },
  {
    id: 'integrations',
    label: 'Integrations',
    path: appPaths.integrations,
  },
];

export function isNavSelected(pathname: string, item: Pick<NavItem, 'id' | 'path'>): boolean {
  if (item.id === 'employees' && pathname === appPaths.home) {
    return true;
  }

  return pathname === item.path || pathname.startsWith(`${item.path}/`);
}

export function getInitiallyOpenNavIds(pathname: string, items: NavItem[]): string[] {
  return items
    .filter(
      (item) =>
        Boolean(item.children?.length) &&
        (isNavSelected(pathname, item) ||
          item.children?.some((child) => isNavSelected(pathname, child))),
    )
    .map((item) => item.id);
}
