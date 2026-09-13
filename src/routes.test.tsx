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
  it.each(['/', '/employees'])('%s で従業員テーブルを表示する', async (path) => {
    renderPath(path);

    expect(screen.getByRole('heading', { name: 'Employees' })).toBeInTheDocument();
    expect(await screen.findByRole('cell', { name: 'Edward Perry' })).toBeInTheDocument();
  });

  it('/employees/new で作成フォームを表示する', () => {
    renderPath('/employees/new');

    expect(screen.getByRole('heading', { name: 'Create' })).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
  });

  it('従業員を追加すると一覧に表示される', async () => {
    const user = userEvent.setup();
    renderPath('/employees');

    await user.click(screen.getByRole('link', { name: 'Create' }));
    await user.type(screen.getByLabelText('Name'), 'Ada Lovelace');
    await user.type(screen.getByLabelText('Age'), '36');
    await user.type(screen.getByLabelText('Join date'), '2026-01-15');
    await user.click(screen.getByRole('combobox', { name: 'Department' }));
    await user.click(screen.getByRole('option', { name: 'Development' }));
    await user.click(screen.getByRole('checkbox', { name: 'Full-time' }));
    await user.click(screen.getByRole('button', { name: 'Create' }));

    expect(await screen.findByRole('heading', { name: 'Employees' })).toBeInTheDocument();
    expect(await screen.findByRole('cell', { name: 'Ada Lovelace' })).toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(5);
  });

  it('未定義パスで404を表示しホームへ戻れる', async () => {
    const user = userEvent.setup();
    renderPath('/unknown');

    expect(screen.getByRole('heading', { name: 'ページが見つかりません' })).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: 'ホームへ戻る' }));

    expect(await screen.findByRole('heading', { name: 'Employees' })).toBeInTheDocument();
  });
});
