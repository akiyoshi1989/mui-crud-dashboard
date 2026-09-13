export const employeeApiErrorCodes = {
  loadEmployees: 'load-employees',
  createEmployee: 'create-employee',
  invalidEmployeeForm: 'invalid-employee-form',
} as const;

export type EmployeeApiErrorCode =
  (typeof employeeApiErrorCodes)[keyof typeof employeeApiErrorCodes];

export class EmployeeApiError extends Error {
  readonly code: EmployeeApiErrorCode;

  constructor(code: EmployeeApiErrorCode) {
    super(code);
    this.name = 'EmployeeApiError';
    this.code = code;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export function isEmployeeApiError(error: unknown): error is EmployeeApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'name' in error &&
    error.name === 'EmployeeApiError' &&
    'code' in error &&
    typeof error.code === 'string'
  );
}
