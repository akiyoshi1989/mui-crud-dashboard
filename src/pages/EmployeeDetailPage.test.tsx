import { ThemeProvider } from '@mui/material/styles';
import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import { employeeApiErrorCodes } from '../data/employee-api-error';
import { employeeDetailColumns, employeeSeed, formatEmployeeValue } from '../data/employees';
import { errorPageMessages, invalidEmployeeIdMessage } from '../errors/get-error-page-message';
import { routes } from '../routes';
import { QueryProvider } from '../test/query-provider';
import { theme } from '../theme';

function renderDetailPage(path = '/employees/1') {
  const router = createMemoryRouter(routes, { initialEntries: [path] });

  return render(
    <QueryProvider>
      <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryProvider>,
  );
}

describe('EmployeeDetailPage', () => {
  it('一覧項目と生年月日を表示する', async () => {
    const [employee] = employeeSeed;
    renderDetailPage();

    expect(await screen.findByRole('heading', { name: employee.name })).toBeInTheDocument();

    for (const column of employeeDetailColumns) {
      expect(screen.getByText(column.header)).toBeInTheDocument();
      expect(screen.getAllByText(formatEmployeeValue(employee, column)).length).toBeGreaterThan(0);
    }

    expect(screen.queryByRole('table', { name: 'Employees' })).not.toBeInTheDocument();
    expect(screen.queryByRole('columnheader', { name: 'Date of birth' })).not.toBeInTheDocument();
  });

  it('読み込み中はプログレスを表示する', () => {
    renderDetailPage();

    expect(screen.getByRole('progressbar', { name: 'Loading employee' })).toBeInTheDocument();
  });

  it('取得失敗時はエラーコンポーネントを表示する', async () => {
    vi.stubGlobal('fetch', async () => new Response('error', { status: 500 }));
    renderDetailPage();

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
    renderDetailPage('/employees/abc');

    expect(
      await screen.findByRole('heading', { name: invalidEmployeeIdMessage }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'トップ画面へ戻る' })).toHaveAttribute('href', '/');
    expect(screen.queryByText('Date of birth')).not.toBeInTheDocument();
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
