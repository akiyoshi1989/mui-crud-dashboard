import { ThemeProvider } from '@mui/material/styles';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import { appPaths } from '../app-paths';
import { employeeColumns, employeeSeed } from '../data/employees';
import { theme } from '../theme';
import EmployeeListPage from './EmployeeListPage';

function renderPage() {
  return render(
    <ThemeProvider theme={theme}>
      <MemoryRouter>
        <EmployeeListPage />
      </MemoryRouter>
    </ThemeProvider>,
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
    expect(screen.getByRole('link', { name: 'Create' })).toHaveAttribute(
      'href',
      appPaths.employeeNew,
    );

    for (const employee of employeeSeed) {
      expect(await screen.findByRole('cell', { name: employee.name })).toBeInTheDocument();
    }

    expect(screen.queryByRole('button', { name: 'Reload' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Edit' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Delete' })).not.toBeInTheDocument();
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
});
