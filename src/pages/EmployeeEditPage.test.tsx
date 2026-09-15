import { ThemeProvider } from '@mui/material/styles';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import { employeeApiErrorCodes } from '../data/employee-api-error';
import { employeeDetailColumns, employeeSeed, formatJoinDate } from '../data/employees';
import { errorPageMessages, invalidEmployeeIdMessage } from '../errors/get-error-page-message';
import { routes } from '../routes';
import { mockEmployeesApi } from '../test/employees-api-mock';
import { QueryProvider } from '../test/query-provider';
import { theme } from '../theme';

function renderEditPage(path = '/employees/1/edit') {
  const router = createMemoryRouter(routes, { initialEntries: [path] });

  return render(
    <QueryProvider>
      <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryProvider>,
  );
}

describe('EmployeeEditPage', () => {
  it('詳細と同じ見出しと項目を表示する', async () => {
    const [employee] = employeeSeed;
    renderEditPage();

    expect(await screen.findByRole('heading', { name: employee.name })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();

    for (const column of employeeDetailColumns) {
      expect(screen.getByText(column.header)).toBeInTheDocument();
    }

    expect(screen.getByRole('textbox', { name: 'Name' })).toHaveValue(employee.name);
    expect(screen.getByRole('spinbutton', { name: 'Age' })).toHaveValue(employee.age);
    expect(screen.getByLabelText('Join date')).toHaveValue(formatJoinDate(employee.joinDate));
    expect(screen.getByRole('combobox', { name: 'Department' })).toHaveTextContent(employee.role);
    expect(screen.getByRole('checkbox', { name: 'Full-time' })).toBeChecked();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2000-03-12')).toBeInTheDocument();
    expect(screen.queryByRole('table', { name: 'Employees' })).not.toBeInTheDocument();
  });

  it('未入力の送信ではエラーを出して更新しない', async () => {
    const user = userEvent.setup();
    renderEditPage();

    const nameField = await screen.findByRole('textbox', { name: 'Name' });
    await user.clear(nameField);
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(await screen.findByText('Name is required')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Edward Perry' })).toBeInTheDocument();
  });

  it('更新失敗時はエラーを出して遷移しない', async () => {
    const user = userEvent.setup();
    vi.stubGlobal('fetch', async (input: RequestInfo | URL, init?: RequestInit) => {
      if ((init?.method ?? 'GET').toUpperCase() === 'PUT') {
        return new Response('error', { status: 500 });
      }

      return mockEmployeesApi(input, init);
    });
    renderEditPage();

    expect(await screen.findByRole('heading', { name: 'Edward Perry' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(
      await screen.findByRole('heading', {
        name: errorPageMessages[employeeApiErrorCodes.updateEmployee],
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'トップ画面へ戻る' })).toHaveAttribute('href', '/');
    expect(screen.queryByRole('heading', { name: 'Edward Perry' })).not.toBeInTheDocument();
  });

  it('取得失敗時はエラーコンポーネントを表示する', async () => {
    vi.stubGlobal('fetch', async () => new Response('error', { status: 500 }));
    renderEditPage();

    expect(
      await screen.findByRole('heading', {
        name: errorPageMessages[employeeApiErrorCodes.loadEmployee],
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'トップ画面へ戻る' })).toHaveAttribute('href', '/');
    expect(screen.queryByText('Date of birth')).not.toBeInTheDocument();
  });

  it('不正な ID では API を呼ばずエラーコンポーネントを表示する', async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);
    renderEditPage('/employees/abc/edit');

    expect(
      await screen.findByRole('heading', { name: invalidEmployeeIdMessage }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'トップ画面へ戻る' })).toHaveAttribute('href', '/');
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
