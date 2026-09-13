import { ThemeProvider } from '@mui/material/styles';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it } from 'vitest';
import { routes } from './routes';
import { theme } from './theme';

function renderPath(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] });

  return render(
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>,
  );
}

describe('routes', () => {
  it.each(['/', '/employees'])('%s で従業員テーブルを表示する', (path) => {
    renderPath(path);

    expect(screen.getByRole('heading', { name: 'Employees' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'Edward Perry' })).toBeInTheDocument();
  });

  it('未定義パスで404を表示しホームへ戻れる', async () => {
    const user = userEvent.setup();
    renderPath('/unknown');

    expect(screen.getByRole('heading', { name: 'ページが見つかりません' })).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: 'ホームへ戻る' }));

    expect(screen.getByRole('heading', { name: 'Employees' })).toBeInTheDocument();
  });
});
