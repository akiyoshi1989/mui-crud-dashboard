import { describe, expect, it } from 'vitest';
import {
  createEmployee,
  employeeColumns,
  employeeFormValuesFromFormData,
  employeeSeed,
  emptyEmployeeFormValues,
  filterEmployees,
  formatEmployeeValue,
  formatFullTime,
  formatJoinDate,
  getEmployeeColumn,
  getEmployeeFormColumns,
  getEmployees,
  toEmployeePayload,
  validateEmployeeForm,
} from './employees';

describe('getEmployees', () => {
  it('API からモック従業員を返す', async () => {
    const employees = await getEmployees();

    expect(employees).toHaveLength(employeeSeed.length);
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
    const [employee] = employeeSeed;

    expect(formatEmployeeValue(employee, getEmployeeColumn('id'))).toBe('1');
    expect(formatEmployeeValue(employee, getEmployeeColumn('joinDate'))).toBe('2025-07-16');
    expect(formatEmployeeValue(employee, getEmployeeColumn('isFullTime'))).toBe('Yes');
  });
});

describe('filterEmployees', () => {
  const employees = employeeSeed;
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

describe('getEmployeeFormColumns', () => {
  it('id 以外の表示列をフォーム項目にする', () => {
    expect(getEmployeeFormColumns().map((column) => column.field)).toEqual([
      'name',
      'age',
      'joinDate',
      'role',
      'isFullTime',
    ]);
  });
});

describe('validateEmployeeForm', () => {
  it('必須項目が空ならエラーを返す', () => {
    expect(validateEmployeeForm(emptyEmployeeFormValues)).toEqual({
      name: 'Name is required',
      age: 'Age is required',
      joinDate: 'Join date is required',
      role: 'Department is required',
    });
  });

  it('年齢が正の整数でなければエラーを返す', () => {
    expect(
      validateEmployeeForm({
        ...emptyEmployeeFormValues,
        name: 'Ada Lovelace',
        age: '0',
        joinDate: '2026-01-15',
        role: 'Development',
      }).age,
    ).toBe('Age must be a positive number');
  });

  it('妥当な入力ではエラーなし', () => {
    expect(
      validateEmployeeForm({
        name: 'Ada Lovelace',
        age: '36',
        joinDate: '2026-01-15',
        role: 'Development',
        isFullTime: true,
      }),
    ).toEqual({});
  });
});

describe('employeeFormValuesFromFormData', () => {
  it('FormData からフォーム値を作る', () => {
    const formData = new FormData();
    formData.set('name', 'Ada Lovelace');
    formData.set('age', '36');
    formData.set('joinDate', '2026-01-15');
    formData.set('role', 'Development');
    formData.set('isFullTime', 'on');

    expect(employeeFormValuesFromFormData(formData)).toEqual({
      name: 'Ada Lovelace',
      age: '36',
      joinDate: '2026-01-15',
      role: 'Development',
      isFullTime: true,
    });
  });

  it('未チェックの Full-time と未知の部署は空として扱う', () => {
    const formData = new FormData();
    formData.set('name', 'Ada Lovelace');
    formData.set('age', '36');
    formData.set('joinDate', '2026-01-15');
    formData.set('role', 'Unknown');

    expect(employeeFormValuesFromFormData(formData)).toMatchObject({
      role: '',
      isFullTime: false,
    });
  });
});

describe('toEmployeePayload', () => {
  it('フォーム値を API 用のペイロードにする', () => {
    expect(
      toEmployeePayload({
        name: ' Ada Lovelace ',
        age: '36',
        joinDate: '2026-01-15',
        role: 'Development',
        isFullTime: true,
      }),
    ).toEqual({
      name: 'Ada Lovelace',
      age: 36,
      joinDate: '2026-01-15T00:00:00.000Z',
      role: 'Development',
      isFullTime: true,
    });
  });
});

describe('createEmployee', () => {
  it('API へ POST して従業員を追加する', async () => {
    const created = await createEmployee({
      name: 'Ada Lovelace',
      age: '36',
      joinDate: '2026-01-15',
      role: 'Development',
      isFullTime: true,
    });

    expect(created).toMatchObject({
      id: 4,
      name: 'Ada Lovelace',
      age: 36,
      joinDate: '2026-01-15T00:00:00.000Z',
      role: 'Development',
      isFullTime: true,
    });
    expect(await getEmployees()).toHaveLength(4);
  });

  it('不正な入力では追加しない', async () => {
    await expect(createEmployee(emptyEmployeeFormValues)).rejects.toThrow(
      'Employee form is invalid',
    );
    expect(await getEmployees()).toHaveLength(3);
  });
});
