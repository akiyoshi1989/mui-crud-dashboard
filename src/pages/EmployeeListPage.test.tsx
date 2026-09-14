import { ThemeProvider } from '@mui/material/styles';
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import { appPaths } from '../app-paths';
import {
  deleteCancelLabel,
  deleteConfirmLabel,
  deleteConfirmTitle,
} from '../components/EmployeeDeleteConfirmDialog';
import { deleteEmployeeLabel } from '../components/EmployeeTable';
import { employeeApiErrorCodes } from '../data/employee-api-error';
import { employeeColumns, employeeSeed } from '../data/employees';
import { errorPageMessages } from '../errors/get-error-page-message';
import { QueryProvider } from '../test/query-provider';
import { theme } from '../theme';
import EmployeeListPage from './EmployeeListPage';

function renderPage() {
  return render(
    <QueryProvider>
      <ThemeProvider theme={theme}>
        <MemoryRouter>
          <EmployeeListPage />
        </MemoryRouter>
      </ThemeProvider>
    </QueryProvider>,
  );
}

describe('EmployeeListPage', () => {
  it('見出しと従業員テーブルを表示する', async () => {
    renderPage();

    expect(screen.getByRole('heading', { name: 'Employees' })).toBeInTheDocument();
    expect(await screen.findByRole('table', { name: 'Employees' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Column' })).toHaveTextContent('Name');
    expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Department' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Full-time' })).toBeInTheDocument();
    expect(screen.queryByRole('columnheader', { name: 'Date of birth' })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Create' })).toHaveAttribute(
      'href',
      appPaths.employeeNew,
    );

    for (const employee of employeeSeed) {
      expect(await screen.findByRole('cell', { name: employee.name })).toBeInTheDocument();
    }

    expect(screen.queryByRole('button', { name: 'Reload' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Edit' })).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: deleteEmployeeLabel(employeeSeed[0].name) }),
    ).toBeInTheDocument();
  });

  it('読み込み中はプログレスを表示する', () => {
    renderPage();

    expect(screen.getByRole('progressbar', { name: 'Loading employees' })).toBeInTheDocument();
  });

  it('取得失敗時はエラーコンポーネントを表示する', async () => {
    vi.stubGlobal('fetch', async () => new Response('error', { status: 500 }));
    renderPage();

    expect(
      await screen.findByRole('heading', {
        name: errorPageMessages[employeeApiErrorCodes.loadEmployees],
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'トップ画面へ戻る' })).toHaveAttribute('href', '/');
    expect(screen.queryByRole('table', { name: 'Employees' })).not.toBeInTheDocument();
  });

  it('Column の選択肢は表示列と一致する', async () => {
    const user = userEvent.setup();
    renderPage();

    expect(await screen.findByRole('cell', { name: 'Edward Perry' })).toBeInTheDocument();
    await user.click(screen.getByRole('combobox', { name: 'Column' }));

    for (const column of employeeColumns) {
      expect(screen.getByRole('option', { name: column.header })).toBeInTheDocument();
    }
  });

  it('初期列の Name で検索語を絞り込む', async () => {
    const user = userEvent.setup();
    renderPage();

    expect(await screen.findByRole('cell', { name: 'Edward Perry' })).toBeInTheDocument();
    await user.type(screen.getByRole('textbox', { name: 'Search' }), 'drake');

    expect(screen.getByRole('cell', { name: 'Josephine Drake' })).toBeInTheDocument();
    expect(screen.queryByRole('cell', { name: 'Edward Perry' })).not.toBeInTheDocument();
    expect(screen.queryByRole('cell', { name: 'Cody Phillips' })).not.toBeInTheDocument();
  });

  it('選択した列だけを検索する', async () => {
    const user = userEvent.setup();
    renderPage();

    expect(await screen.findByRole('cell', { name: 'Edward Perry' })).toBeInTheDocument();
    await user.type(screen.getByRole('textbox', { name: 'Search' }), 'finance');

    expect(screen.queryByRole('cell', { name: 'Edward Perry' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('combobox', { name: 'Column' }));
    await user.click(screen.getByRole('option', { name: 'Department' }));

    expect(screen.getByRole('cell', { name: 'Edward Perry' })).toBeInTheDocument();
    expect(screen.queryByRole('cell', { name: 'Josephine Drake' })).not.toBeInTheDocument();
    expect(screen.queryByRole('cell', { name: 'Cody Phillips' })).not.toBeInTheDocument();
  });

  it('Age を選ぶと 25 は年齢だけに当たる', async () => {
    const user = userEvent.setup();
    renderPage();

    expect(await screen.findByRole('cell', { name: 'Edward Perry' })).toBeInTheDocument();
    await user.click(screen.getByRole('combobox', { name: 'Column' }));
    await user.click(screen.getByRole('option', { name: 'Age' }));
    await user.type(screen.getByRole('textbox', { name: 'Search' }), '25');

    expect(screen.getByRole('cell', { name: 'Edward Perry' })).toBeInTheDocument();
    expect(screen.queryByRole('cell', { name: 'Josephine Drake' })).not.toBeInTheDocument();
    expect(screen.queryByRole('cell', { name: 'Cody Phillips' })).not.toBeInTheDocument();
  });

  it('削除ボタンだけでは従業員は消えない', async () => {
    const user = userEvent.setup();
    renderPage();

    expect(await screen.findByRole('cell', { name: 'Edward Perry' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: deleteEmployeeLabel('Edward Perry') }));

    expect(screen.getByRole('dialog', { name: deleteConfirmTitle })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'Edward Perry', hidden: true })).toBeInTheDocument();
  });

  it('確認をキャンセルするとその行は残る', async () => {
    const user = userEvent.setup();
    renderPage();

    expect(await screen.findByRole('cell', { name: 'Edward Perry' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: deleteEmployeeLabel('Edward Perry') }));
    await user.click(screen.getByRole('button', { name: deleteCancelLabel }));
    await waitForElementToBeRemoved(() =>
      screen.queryByRole('dialog', { name: deleteConfirmTitle }),
    );

    expect(screen.getByRole('cell', { name: 'Edward Perry' })).toBeInTheDocument();
  });

  it('削除を確認するとその行が一覧から消える', async () => {
    const user = userEvent.setup();
    renderPage();

    expect(await screen.findByRole('cell', { name: 'Edward Perry' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: deleteEmployeeLabel('Edward Perry') }));
    await user.click(screen.getByRole('button', { name: deleteConfirmLabel }));
    await waitForElementToBeRemoved(() =>
      screen.queryByRole('dialog', { name: deleteConfirmTitle }),
    );

    expect(screen.getByRole('cell', { name: 'Josephine Drake' })).toBeInTheDocument();
    expect(screen.queryByRole('cell', { name: 'Edward Perry' })).not.toBeInTheDocument();
  });

  it('削除失敗時はエラーコンポーネントを表示する', async () => {
    const user = userEvent.setup();
    renderPage();

    expect(await screen.findByRole('cell', { name: 'Edward Perry' })).toBeInTheDocument();
    vi.stubGlobal('fetch', async () => new Response('error', { status: 500 }));
    await user.click(screen.getByRole('button', { name: deleteEmployeeLabel('Edward Perry') }));
    await user.click(screen.getByRole('button', { name: deleteConfirmLabel }));

    expect(
      await screen.findByRole('heading', {
        name: errorPageMessages[employeeApiErrorCodes.deleteEmployee],
      }),
    ).toBeInTheDocument();
    expect(screen.queryByRole('table', { name: 'Employees' })).not.toBeInTheDocument();
  });
});
