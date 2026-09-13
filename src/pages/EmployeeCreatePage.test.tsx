import { ThemeProvider } from '@mui/material/styles';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import { getEmployeeFormColumns } from '../data/employees';
import { routes } from '../routes';
import { mockEmployeesApi } from '../test/employees-api-mock';
import { QueryProvider } from '../test/query-provider';
import { theme } from '../theme';

function renderCreatePage() {
  const router = createMemoryRouter(routes, { initialEntries: ['/employees/new'] });

  return render(
    <QueryProvider>
      <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryProvider>,
  );
}

describe('EmployeeCreatePage', () => {
  it('作成フォームを表示する', () => {
    renderCreatePage();

    expect(screen.getByRole('heading', { name: 'Create' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument();

    for (const column of getEmployeeFormColumns()) {
      expect(screen.getByLabelText(column.header)).toBeInTheDocument();
    }
  });

  it('未入力の送信ではエラーを出して追加しない', async () => {
    const user = userEvent.setup();
    renderCreatePage();

    await user.click(screen.getByRole('button', { name: 'Create' }));

    expect(await screen.findByText('Name is required')).toBeInTheDocument();
    expect(screen.getByText('Age is required')).toBeInTheDocument();
    expect(screen.getByText('Join date is required')).toBeInTheDocument();
    expect(screen.getByText('Department is required')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Create' })).toBeInTheDocument();
  });

  it('Reset で入力をクリアする', async () => {
    const user = userEvent.setup();
    renderCreatePage();

    await user.type(screen.getByLabelText('Name'), 'Ada Lovelace');
    await user.click(screen.getByRole('button', { name: 'Reset' }));

    expect(screen.getByLabelText('Name')).toHaveValue('');
  });

  it('作成失敗時はエラーを出して遷移しない', async () => {
    const user = userEvent.setup();
    vi.stubGlobal('fetch', async (input: RequestInfo | URL, init?: RequestInit) => {
      if ((init?.method ?? 'GET').toUpperCase() === 'POST') {
        return new Response('error', { status: 500 });
      }

      return mockEmployeesApi(input, init);
    });
    renderCreatePage();

    await user.type(screen.getByLabelText('Name'), 'Ada Lovelace');
    await user.type(screen.getByLabelText('Age'), '36');
    await user.type(screen.getByLabelText('Join date'), '2026-01-15');
    await user.click(screen.getByRole('combobox', { name: 'Department' }));
    await user.click(screen.getByRole('option', { name: 'Development' }));
    await user.click(screen.getByRole('button', { name: 'Create' }));

    expect(
      await screen.findByRole('heading', { name: 'Failed to create employee' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'トップ画面へ戻る' })).toHaveAttribute('href', '/');
    expect(screen.queryByRole('heading', { name: 'Create' })).not.toBeInTheDocument();
  });

  it('作成失敗からトップ画面へ戻れる', async () => {
    const user = userEvent.setup();
    vi.stubGlobal('fetch', async (input: RequestInfo | URL, init?: RequestInit) => {
      if ((init?.method ?? 'GET').toUpperCase() === 'POST') {
        return new Response('error', { status: 500 });
      }

      return mockEmployeesApi(input, init);
    });
    renderCreatePage();

    await user.type(screen.getByLabelText('Name'), 'Ada Lovelace');
    await user.type(screen.getByLabelText('Age'), '36');
    await user.type(screen.getByLabelText('Join date'), '2026-01-15');
    await user.click(screen.getByRole('combobox', { name: 'Department' }));
    await user.click(screen.getByRole('option', { name: 'Development' }));
    await user.click(screen.getByRole('button', { name: 'Create' }));

    expect(
      await screen.findByRole('heading', { name: 'Failed to create employee' }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: 'トップ画面へ戻る' }));

    expect(await screen.findByRole('heading', { name: 'Employees' })).toBeInTheDocument();
    expect(await screen.findByRole('cell', { name: 'Edward Perry' })).toBeInTheDocument();
  });
});
