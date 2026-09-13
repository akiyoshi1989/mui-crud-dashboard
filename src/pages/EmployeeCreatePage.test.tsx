import { ThemeProvider } from '@mui/material/styles';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it } from 'vitest';
import { getEmployeeFormColumns } from '../data/employees';
import { routes } from '../routes';
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
});
