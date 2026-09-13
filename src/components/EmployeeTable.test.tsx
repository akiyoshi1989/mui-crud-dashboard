import { ThemeProvider } from '@mui/material/styles';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { employeeColumns, getEmployees } from '../data/employees';
import { theme } from '../theme';
import EmployeeTable from './EmployeeTable';

describe('EmployeeTable', () => {
  it('employeeColumns のヘッダーとセルを描画する', () => {
    render(
      <ThemeProvider theme={theme}>
        <EmployeeTable employees={getEmployees()} />
      </ThemeProvider>,
    );

    expect(screen.getByRole('columnheader', { name: 'Department' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'Edward Perry' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Full-time' })).toBeInTheDocument();
  });

  it('渡した列定義の増減を描画する', () => {
    const columns = employeeColumns.filter((column) => column.field !== 'age');

    render(
      <ThemeProvider theme={theme}>
        <EmployeeTable employees={getEmployees()} columns={columns} />
      </ThemeProvider>,
    );

    expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument();
    expect(screen.queryByRole('columnheader', { name: 'Age' })).not.toBeInTheDocument();
  });
});
