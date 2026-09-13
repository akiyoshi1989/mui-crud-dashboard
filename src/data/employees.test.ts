import { describe, expect, it } from 'vitest';
import {
  employeeColumns,
  filterEmployees,
  formatEmployeeValue,
  formatFullTime,
  formatJoinDate,
  getEmployeeColumn,
  getEmployees,
} from './employees';
import employeesJson from './employees.json';

describe('getEmployees', () => {
  it('JSON のモック従業員を返す', () => {
    const employees = getEmployees();

    expect(employees).toHaveLength(employeesJson.length);
    expect(employees.map((employee) => employee.name)).toEqual([
      'Edward Perry',
      'Josephine Drake',
      'Cody Phillips',
    ]);
  });
});

describe('formatJoinDate', () => {
  it('ISO 文字列から日付部分を取り出す', () => {
    expect(formatJoinDate('2025-07-16T00:00:00.000Z')).toBe('2025-07-16');
  });
});

describe('formatFullTime', () => {
  it('真偽値を Yes / No にする', () => {
    expect(formatFullTime(true)).toBe('Yes');
    expect(formatFullTime(false)).toBe('No');
  });
});

describe('employeeColumns', () => {
  it('表示列を一か所で定義する', () => {
    expect(employeeColumns.map((column) => column.field)).toEqual([
      'id',
      'name',
      'age',
      'joinDate',
      'role',
      'isFullTime',
    ]);
    expect(employeeColumns.map((column) => column.header)).toEqual([
      'ID',
      'Name',
      'Age',
      'Join date',
      'Department',
      'Full-time',
    ]);
  });
});

describe('getEmployeeColumn', () => {
  it('field から列定義を返す', () => {
    expect(getEmployeeColumn('role').header).toBe('Department');
  });
});

describe('formatEmployeeValue', () => {
  it('列タイプに応じて表示値を返す', () => {
    const [employee] = getEmployees();

    expect(formatEmployeeValue(employee, getEmployeeColumn('id'))).toBe('1');
    expect(formatEmployeeValue(employee, getEmployeeColumn('joinDate'))).toBe('2025-07-16');
    expect(formatEmployeeValue(employee, getEmployeeColumn('isFullTime'))).toBe('Yes');
  });
});

describe('filterEmployees', () => {
  const employees = getEmployees();
  const nameColumn = getEmployeeColumn('name');
  const ageColumn = getEmployeeColumn('age');
  const roleColumn = getEmployeeColumn('role');
  const fullTimeColumn = getEmployeeColumn('isFullTime');
  const joinDateColumn = getEmployeeColumn('joinDate');

  it('空文字では全件を返す', () => {
    expect(filterEmployees(employees, '   ', nameColumn)).toEqual(employees);
  });

  it('選択した列の部分一致で絞り込む', () => {
    expect(filterEmployees(employees, 'perry', nameColumn).map((employee) => employee.id)).toEqual([
      1,
    ]);
    expect(
      filterEmployees(employees, 'finance', roleColumn).map((employee) => employee.id),
    ).toEqual([1]);
    expect(filterEmployees(employees, 'no', fullTimeColumn).map((employee) => employee.id)).toEqual(
      [2],
    );
  });

  it('選択していない列の値では絞り込まない', () => {
    expect(filterEmployees(employees, 'finance', nameColumn)).toEqual([]);
    expect(filterEmployees(employees, 'perry', ageColumn)).toEqual([]);
  });

  it('一致しないときは空配列を返す', () => {
    expect(filterEmployees(employees, 'zzz', nameColumn)).toEqual([]);
  });

  it('25 は Age を選んだときだけ年齢に当たる', () => {
    expect(filterEmployees(employees, '25', ageColumn).map((employee) => employee.id)).toEqual([1]);
    expect(filterEmployees(employees, '25', nameColumn)).toEqual([]);
  });

  it('Join date は表示値の部分一致で絞り込む', () => {
    expect(
      filterEmployees(employees, '2025-07-16', joinDateColumn).map((employee) => employee.id),
    ).toEqual([1, 2, 3]);
    expect(
      filterEmployees(employees, '2025', joinDateColumn).map((employee) => employee.id),
    ).toEqual([1, 2, 3]);
  });
});
