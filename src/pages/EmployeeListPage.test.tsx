import { ThemeProvider } from '@mui/material/styles';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { getEmployees } from '../data/employees';
import { theme } from '../theme';
import EmployeeListPage from './EmployeeListPage';

describe('EmployeeListPage', () => {
  it('見出しと従業員テーブルを表示する', () => {
    render(
      <ThemeProvider theme={theme}>
        <EmployeeListPage />
      </ThemeProvider>,
    );

    expect(screen.getByRole('heading', { name: 'Employees' })).toBeInTheDocument();
    expect(screen.getByRole('table', { name: 'Employees' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Department' })).toBeInTheDocument();

    for (const employee of getEmployees()) {
      expect(screen.getByRole('cell', { name: employee.name })).toBeInTheDocument();
    }

    expect(screen.queryByRole('button', { name: 'Create' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Reload' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Edit' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Delete' })).not.toBeInTheDocument();
  });

  it('検索語で従業員を絞り込む', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider theme={theme}>
        <EmployeeListPage />
      </ThemeProvider>,
    );

    await user.type(screen.getByRole('textbox', { name: 'Search' }), 'drake');

    expect(screen.getByRole('cell', { name: 'Josephine Drake' })).toBeInTheDocument();
    expect(screen.queryByRole('cell', { name: 'Edward Perry' })).not.toBeInTheDocument();
    expect(screen.queryByRole('cell', { name: 'Cody Phillips' })).not.toBeInTheDocument();
  });
});
