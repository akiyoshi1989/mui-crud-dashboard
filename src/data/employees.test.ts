import { describe, expect, it } from 'vitest';
import { filterEmployees, formatFullTime, formatJoinDate, getEmployees } from './employees';
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

describe('filterEmployees', () => {
  const employees = getEmployees();

  it('空文字では全件を返す', () => {
    expect(filterEmployees(employees, '   ')).toEqual(employees);
  });

  it('名前の部分一致で絞り込む', () => {
    expect(filterEmployees(employees, 'perry').map((employee) => employee.id)).toEqual([1]);
  });

  it('部署や Full-time 表示値でも絞り込む', () => {
    expect(filterEmployees(employees, 'finance').map((employee) => employee.id)).toEqual([1]);
    expect(filterEmployees(employees, 'no').map((employee) => employee.id)).toEqual([2]);
  });

  it('一致しないときは空配列を返す', () => {
    expect(filterEmployees(employees, 'zzz')).toEqual([]);
  });
});
