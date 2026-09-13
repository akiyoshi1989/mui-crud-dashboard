import { ThemeProvider } from '@mui/material/styles';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it } from 'vitest';
import { theme } from '../theme';
import DashboardSidebar from './DashboardSidebar';

function renderSidebar(path: string) {
  const router = createMemoryRouter(
    [
      {
        path: '*',
        element: <DashboardSidebar open variant="permanent" onClose={() => undefined} />,
      },
    ],
    { initialEntries: [path] },
  );

  return render(
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>,
  );
}

describe('DashboardSidebar', () => {
  it('Reports の開閉をトグルし aria-expanded を更新する', async () => {
    const user = userEvent.setup();
    renderSidebar('/');

    const reports = screen.getByRole('link', { name: 'Reports' });
    expect(reports).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('link', { name: 'Sales' })).not.toBeInTheDocument();

    await user.click(reports);
    expect(reports).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('link', { name: 'Sales' })).toBeInTheDocument();

    await user.click(reports);
    expect(reports).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('link', { name: 'Sales' })).not.toBeInTheDocument();
  });

  it('親は exact match、子は自身のパスで選択する', () => {
    renderSidebar('/reports/sales');

    expect(screen.getByRole('link', { name: 'Reports' })).not.toHaveClass('Mui-selected');
    expect(screen.getByRole('link', { name: 'Sales' })).toHaveClass('Mui-selected');
  });
});
