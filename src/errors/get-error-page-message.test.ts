import { describe, expect, it } from 'vitest';
import { EmployeeApiError, employeeApiErrorCodes } from '../data/employee-api-error';
import {
  errorPageMessages,
  fallbackErrorPageMessage,
  getErrorPageMessage,
  invalidEmployeeIdMessage,
} from './get-error-page-message';

describe('getErrorPageMessage', () => {
  it('API エラーコードから表示文を組み立てる', () => {
    expect(getErrorPageMessage(new EmployeeApiError(employeeApiErrorCodes.loadEmployees))).toBe(
      errorPageMessages[employeeApiErrorCodes.loadEmployees],
    );
    expect(getErrorPageMessage(new EmployeeApiError(employeeApiErrorCodes.loadEmployee))).toBe(
      errorPageMessages[employeeApiErrorCodes.loadEmployee],
    );
    expect(getErrorPageMessage(new EmployeeApiError(employeeApiErrorCodes.createEmployee))).toBe(
      errorPageMessages[employeeApiErrorCodes.createEmployee],
    );
    expect(getErrorPageMessage(new EmployeeApiError(employeeApiErrorCodes.deleteEmployee))).toBe(
      errorPageMessages[employeeApiErrorCodes.deleteEmployee],
    );
  });

  it('cause に載った API エラーコードからも表示文を組み立てる', () => {
    const cause = new EmployeeApiError(employeeApiErrorCodes.loadEmployees);

    expect(getErrorPageMessage(new Error('Query failed', { cause }))).toBe(
      errorPageMessages[employeeApiErrorCodes.loadEmployees],
    );
  });

  it('Error.message が内部詳細でも表示文には使わない', () => {
    expect(getErrorPageMessage(new Error('ENOTFOUND db.internal:5432'))).toBe(
      fallbackErrorPageMessage,
    );
    expect(
      getErrorPageMessage(new EmployeeApiError(employeeApiErrorCodes.invalidEmployeeForm)),
    ).toBe(fallbackErrorPageMessage);
    expect(invalidEmployeeIdMessage).toBe('従業員 ID が無効です');
  });
});
