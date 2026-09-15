import { ThemeProvider } from '@mui/material/styles';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { employeeColumns, employeeSeed } from '../data/employees';
import { theme } from '../theme';
import EmployeeTable, { deleteEmployeeLabel, editEmployeeLabel } from './EmployeeTable';

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

  it('行クリックで onRowClick を呼ぶ', async () => {
    const user = userEvent.setup();
    const onRowClick = vi.fn();

    render(
      <ThemeProvider theme={theme}>
        <EmployeeTable employees={employeeSeed} onRowClick={onRowClick} />
      </ThemeProvider>,
    );

    await user.click(screen.getByRole('cell', { name: 'Edward Perry' }));
    expect(onRowClick).toHaveBeenCalledWith(employeeSeed[0]);
  });

  it('削除ボタンでは onRowClick を呼ばない', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    const onRowClick = vi.fn();

    render(
      <ThemeProvider theme={theme}>
        <EmployeeTable employees={employeeSeed} onDelete={onDelete} onRowClick={onRowClick} />
      </ThemeProvider>,
    );

    await user.click(screen.getByRole('button', { name: deleteEmployeeLabel('Edward Perry') }));
    expect(onDelete).toHaveBeenCalledWith(employeeSeed[0]);
    expect(onRowClick).not.toHaveBeenCalled();
  });

  it('onEdit があるとき削除ボタンの左に更新ボタンを置く', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    const onEdit = vi.fn();

    render(
      <ThemeProvider theme={theme}>
        <EmployeeTable employees={employeeSeed} onDelete={onDelete} onEdit={onEdit} />
      </ThemeProvider>,
    );

    const editButton = screen.getByRole('button', { name: editEmployeeLabel('Edward Perry') });
    const deleteButton = screen.getByRole('button', { name: deleteEmployeeLabel('Edward Perry') });

    expect(
      editButton.compareDocumentPosition(deleteButton) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBe(Node.DOCUMENT_POSITION_FOLLOWING);

    await user.click(editButton);
    expect(onEdit).toHaveBeenCalledWith(employeeSeed[0]);
    expect(onDelete).not.toHaveBeenCalled();
  });

  it('更新ボタンでは onRowClick を呼ばない', async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    const onRowClick = vi.fn();

    render(
      <ThemeProvider theme={theme}>
        <EmployeeTable employees={employeeSeed} onEdit={onEdit} onRowClick={onRowClick} />
      </ThemeProvider>,
    );

    await user.click(screen.getByRole('button', { name: editEmployeeLabel('Edward Perry') }));
    expect(onEdit).toHaveBeenCalledWith(employeeSeed[0]);
    expect(onRowClick).not.toHaveBeenCalled();
  });
});
