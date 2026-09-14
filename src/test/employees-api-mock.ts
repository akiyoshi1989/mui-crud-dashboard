import { type Employee, employeeApiPath, employeeSeed, employeesApiPath } from '../data/employees';

function cloneSeed(): Employee[] {
  return structuredClone(employeeSeed);
}

let employees = cloneSeed();

export function resetEmployeesApi(): void {
  employees = cloneSeed();
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function requestUrl(input: RequestInfo | URL): string {
  if (typeof input === 'string') {
    return input;
  }

  if (input instanceof URL) {
    return input.pathname;
  }

  return new URL(input.url, 'http://localhost').pathname;
}

export async function mockEmployeesApi(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const path = requestUrl(input);
  const method = (init?.method ?? 'GET').toUpperCase();

  if (path === employeesApiPath && method === 'GET') {
    return jsonResponse(employees);
  }

  if (path === employeesApiPath && method === 'POST') {
    const payload = JSON.parse(String(init?.body ?? '{}')) as Omit<Employee, 'id'>;
    const nextId = employees.reduce((max, employee) => Math.max(max, employee.id), 0) + 1;
    const created = { id: nextId, ...payload };
    employees = [...employees, created];
    return jsonResponse(created, 201);
  }

  const employeeId = Number(path.split('/').at(-1));
  if (path === employeeApiPath(employeeId) && method === 'GET') {
    const employee = employees.find((item) => item.id === employeeId);

    if (!employee) {
      return jsonResponse({ message: 'Not found' }, 404);
    }

    return jsonResponse(employee);
  }

  if (path === employeeApiPath(employeeId) && method === 'DELETE') {
    const exists = employees.some((employee) => employee.id === employeeId);

    if (!exists) {
      return jsonResponse({ message: 'Not found' }, 404);
    }

    employees = employees.filter((employee) => employee.id !== employeeId);
    return new Response(null, { status: 200 });
  }

  return jsonResponse({ message: 'Not found' }, 404);
}
