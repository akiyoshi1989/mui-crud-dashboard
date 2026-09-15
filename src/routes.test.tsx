import { ThemeProvider } from '@mui/material/styles';
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import { deleteConfirmLabel, deleteConfirmTitle } from './components/EmployeeDeleteConfirmDialog';
import { deleteEmployeeLabel, editEmployeeLabel } from './components/EmployeeTable';
import { employeeApiErrorCodes } from './data/employee-api-error';
import { errorPageMessages } from './errors/get-error-page-message';
import { routes } from './routes';
import { mockEmployeesApi } from './test/employees-api-mock';
import { QueryProvider } from './test/query-provider';
import { theme } from './theme';

function renderPath(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] });

  return render(
    <QueryProvider>
      <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryProvider>,
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

  it('行をクリックすると詳細を表示する', async () => {
    const user = userEvent.setup();
    renderPath('/employees');

    await user.click(await screen.findByRole('cell', { name: 'Edward Perry' }));

    expect(await screen.findByRole('heading', { name: 'Edward Perry' })).toBeInTheDocument();
    expect(screen.getByText('Date of birth')).toBeInTheDocument();
    expect(screen.getByText('2000-03-12')).toBeInTheDocument();
    expect(screen.queryByRole('table', { name: 'Employees' })).not.toBeInTheDocument();
  });

  it('削除ボタンでは詳細へ遷移しない', async () => {
    const user = userEvent.setup();
    renderPath('/employees');

    await user.click(
      await screen.findByRole('button', { name: deleteEmployeeLabel('Edward Perry') }),
    );

    expect(screen.getByRole('dialog', { name: deleteConfirmTitle })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Edward Perry' })).not.toBeInTheDocument();
    expect(screen.queryByText('Date of birth')).not.toBeInTheDocument();
  });

  it('更新ボタンを押すと詳細と同じ項目の更新画面を表示する', async () => {
    const user = userEvent.setup();
    renderPath('/employees');

    await user.click(
      await screen.findByRole('button', { name: editEmployeeLabel('Edward Perry') }),
    );

    expect(await screen.findByRole('heading', { name: 'Edward Perry' })).toBeInTheDocument();
    expect(screen.getByText('Date of birth')).toBeInTheDocument();
    expect(screen.getByText('2000-03-12')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Name' })).toHaveValue('Edward Perry');
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    expect(screen.queryByRole('table', { name: 'Employees' })).not.toBeInTheDocument();
  });

  it('従業員を更新すると一覧に反映される', async () => {
    const user = userEvent.setup();
    renderPath('/employees');

    await user.click(
      await screen.findByRole('button', { name: editEmployeeLabel('Edward Perry') }),
    );
    const nameField = await screen.findByRole('textbox', { name: 'Name' });
    await user.clear(nameField);
    await user.type(nameField, 'Ada Lovelace');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(await screen.findByRole('heading', { name: 'Employees' })).toBeInTheDocument();
    expect(await screen.findByRole('cell', { name: 'Ada Lovelace' })).toBeInTheDocument();
    expect(screen.queryByRole('cell', { name: 'Edward Perry' })).not.toBeInTheDocument();
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

  it('一覧の取得失敗からトップへ戻れる', async () => {
    const user = userEvent.setup();
    vi.stubGlobal('fetch', async () => new Response('error', { status: 500 }));
    renderPath('/');

    expect(
      await screen.findByRole('heading', {
        name: errorPageMessages[employeeApiErrorCodes.loadEmployees],
      }),
    ).toBeInTheDocument();

    vi.stubGlobal('fetch', mockEmployeesApi);
    await user.click(screen.getByRole('link', { name: 'トップ画面へ戻る' }));

    expect(await screen.findByRole('heading', { name: 'Employees' })).toBeInTheDocument();
    expect(await screen.findByRole('cell', { name: 'Edward Perry' })).toBeInTheDocument();
  });

  it('従業員を削除すると一覧から消える', async () => {
    const user = userEvent.setup();
    renderPath('/employees');

    expect(await screen.findByRole('cell', { name: 'Edward Perry' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: deleteEmployeeLabel('Edward Perry') }));
    await user.click(screen.getByRole('button', { name: deleteConfirmLabel }));
    await waitForElementToBeRemoved(() =>
      screen.queryByRole('dialog', { name: deleteConfirmTitle }),
    );

    expect(screen.queryByRole('cell', { name: 'Edward Perry' })).not.toBeInTheDocument();
    expect(await screen.findByRole('cell', { name: 'Josephine Drake' })).toBeInTheDocument();
  });

  it('未定義パスで404を表示しホームへ戻れる', async () => {
    const user = userEvent.setup();
    renderPath('/unknown');

    expect(screen.getByRole('heading', { name: 'ページが見つかりません' })).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: 'ホームへ戻る' }));

    expect(await screen.findByRole('heading', { name: 'Employees' })).toBeInTheDocument();
  });
});
