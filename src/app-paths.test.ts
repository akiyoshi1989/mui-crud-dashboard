import { describe, expect, it } from 'vitest';
import { appPaths } from './app-paths';

describe('appPaths', () => {
  it('公式CRUD Dashboardと同じ従業員パスを返す', () => {
    expect(appPaths.home).toBe('/');
    expect(appPaths.employees).toBe('/employees');
    expect(appPaths.employeeNew).toBe('/employees/new');
    expect(appPaths.employee('42')).toBe('/employees/42');
    expect(appPaths.employeeEdit('42')).toBe('/employees/42/edit');
    expect(appPaths.reports).toBe('/reports');
    expect(appPaths.reportsSales).toBe('/reports/sales');
    expect(appPaths.reportsTraffic).toBe('/reports/traffic');
    expect(appPaths.integrations).toBe('/integrations');
  });
});
