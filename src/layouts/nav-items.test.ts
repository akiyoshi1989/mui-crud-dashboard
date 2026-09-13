import { describe, expect, it } from 'vitest';
import { appPaths } from '../app-paths';
import { exampleNavItems, getInitiallyOpenNavIds, isNavSelected } from './nav-items';

describe('isNavSelected', () => {
  it('ホームと従業員パスで Employees を選択する', () => {
    expect(isNavSelected(appPaths.home, { id: 'employees', path: appPaths.employees })).toBe(true);
    expect(isNavSelected(appPaths.employees, { id: 'employees', path: appPaths.employees })).toBe(
      true,
    );
    expect(
      isNavSelected(appPaths.employee('42'), { id: 'employees', path: appPaths.employees }),
    ).toBe(true);
  });

  it('従業員以外のパスでは Employees を選択しない', () => {
    expect(isNavSelected(appPaths.reports, { id: 'employees', path: appPaths.employees })).toBe(
      false,
    );
  });

  it('自身のパス配下を選択する', () => {
    expect(isNavSelected(appPaths.reportsSales, { id: 'reports', path: appPaths.reports })).toBe(
      true,
    );
    expect(
      isNavSelected(appPaths.reports, { id: 'reports-sales', path: appPaths.reportsSales }),
    ).toBe(false);
  });
});

describe('getInitiallyOpenNavIds', () => {
  it('配下のパスでは親項目を開く', () => {
    expect(getInitiallyOpenNavIds(appPaths.reportsSales, exampleNavItems)).toEqual(['reports']);
  });

  it('無関係なパスでは親項目を開かない', () => {
    expect(getInitiallyOpenNavIds(appPaths.home, exampleNavItems)).toEqual([]);
  });
});
