import {
  type EmployeeApiErrorCode,
  employeeApiErrorCodes,
  isEmployeeApiError,
} from '../data/employee-api-error';

export const errorPageMessages = {
  [employeeApiErrorCodes.loadEmployees]: '従業員一覧を取得できませんでした',
  [employeeApiErrorCodes.createEmployee]: '従業員を追加できませんでした',
} as const;

export const fallbackErrorPageMessage = '処理に失敗しました';

const employeeApiErrorCodeSet = new Set<string>(Object.values(employeeApiErrorCodes));

function isEmployeeApiErrorCode(value: string): value is EmployeeApiErrorCode {
  return employeeApiErrorCodeSet.has(value);
}

function getEmployeeApiErrorCode(error: unknown): EmployeeApiErrorCode | undefined {
  if (isEmployeeApiError(error)) {
    return error.code;
  }

  if (error instanceof Error) {
    if (isEmployeeApiErrorCode(error.message)) {
      return error.message;
    }

    if (error.cause !== undefined) {
      return getEmployeeApiErrorCode(error.cause);
    }
  }

  return undefined;
}

export function getErrorPageMessage(error: unknown): string {
  const code = getEmployeeApiErrorCode(error);

  if (code === employeeApiErrorCodes.loadEmployees) {
    return errorPageMessages[employeeApiErrorCodes.loadEmployees];
  }

  if (code === employeeApiErrorCodes.createEmployee) {
    return errorPageMessages[employeeApiErrorCodes.createEmployee];
  }

  return fallbackErrorPageMessage;
}
