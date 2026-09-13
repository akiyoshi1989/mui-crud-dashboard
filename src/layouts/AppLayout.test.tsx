import { ThemeProvider } from '@mui/material/styles';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it } from 'vitest';
import { routes } from '../routes';
import { theme } from '../theme';

function renderPath(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] });

  return render(
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>,
  );
}

describe('AppLayout', () => {
  it('ヘッダーを表示し、メニューからサイドバーを開ける', async () => {
    const user = userEvent.setup();
    renderPath('/');

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Employees' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'サイドバーを開く' }));

    const employeesLink = screen.getByRole('link', { name: 'Employees' });
    expect(employeesLink).toBeInTheDocument();
    expect(employeesLink).toHaveClass('Mui-selected');
    expect(screen.getByRole('link', { name: 'Reports' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Integrations' })).toBeInTheDocument();
  });

  it('Employees を押すと従業員パスへ遷移する', async () => {
    const user = userEvent.setup();
    renderPath('/');

    await user.click(screen.getByRole('button', { name: 'サイドバーを開く' }));
    await user.click(screen.getByRole('link', { name: 'Employees' }));

    expect(await screen.findByRole('heading', { name: 'Employees' })).toBeInTheDocument();
    expect(await screen.findByRole('cell', { name: 'Edward Perry' })).toBeInTheDocument();
  });
});
