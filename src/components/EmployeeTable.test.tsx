import { ThemeProvider } from '@mui/material/styles';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { employeeColumns, employeeSeed } from '../data/employees';
import { theme } from '../theme';
import EmployeeTable, { deleteEmployeeLabel } from './EmployeeTable';

describe('EmployeeTable', () => {
  it('employeeColumns のヘッダーとセルを描画する', () => {
    render(
      <ThemeProvider theme={theme}>
        <EmployeeTable employees={employeeSeed} />
      </ThemeProvider>,
    );

    expect(screen.getByRole('columnheader', { name: 'Department' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'Edward Perry' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Full-time' })).toBeInTheDocument();
    expect(screen.queryByRole('columnheader', { name: 'Actions' })).not.toBeInTheDocument();
  });

  it('渡した列定義の増減を描画する', () => {
    const columns = employeeColumns.filter((column) => column.field !== 'age');

    render(
      <ThemeProvider theme={theme}>
        <EmployeeTable employees={employeeSeed} columns={columns} />
      </ThemeProvider>,
    );

    expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument();
    expect(screen.queryByRole('columnheader', { name: 'Age' })).not.toBeInTheDocument();
  });

  it('onDelete があるとき各行に削除ボタンを置く', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();

    render(
      <ThemeProvider theme={theme}>
        <EmployeeTable employees={employeeSeed} onDelete={onDelete} />
      </ThemeProvider>,
    );

    expect(screen.getByRole('columnheader', { name: 'Actions' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: deleteEmployeeLabel('Edward Perry') }));
    expect(onDelete).toHaveBeenCalledWith(employeeSeed[0]);
  });
});
