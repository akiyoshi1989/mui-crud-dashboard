import { ThemeProvider } from '@mui/material/styles';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { theme } from '../theme';
import EmployeeDeleteConfirmDialog, {
  deleteCancelLabel,
  deleteConfirmLabel,
  deleteConfirmMessage,
  deleteConfirmTitle,
} from './EmployeeDeleteConfirmDialog';

describe('EmployeeDeleteConfirmDialog', () => {
  it('開いているとき確認文と操作ボタンを表示する', () => {
    render(
      <ThemeProvider theme={theme}>
        <EmployeeDeleteConfirmDialog open onCancel={vi.fn()} onConfirm={vi.fn()} />
      </ThemeProvider>,
    );

    expect(screen.getByRole('dialog', { name: deleteConfirmTitle })).toBeInTheDocument();
    expect(screen.getByText(deleteConfirmMessage)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: deleteCancelLabel })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: deleteConfirmLabel })).toBeInTheDocument();
  });

  it('閉じているときは出さない', () => {
    render(
      <ThemeProvider theme={theme}>
        <EmployeeDeleteConfirmDialog open={false} onCancel={vi.fn()} onConfirm={vi.fn()} />
      </ThemeProvider>,
    );

    expect(screen.queryByRole('dialog', { name: deleteConfirmTitle })).not.toBeInTheDocument();
  });

  it('Cancel で onCancel を呼ぶ', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();

    render(
      <ThemeProvider theme={theme}>
        <EmployeeDeleteConfirmDialog open onCancel={onCancel} onConfirm={vi.fn()} />
      </ThemeProvider>,
    );

    await user.click(screen.getByRole('button', { name: deleteCancelLabel }));
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it('Delete で onConfirm を呼ぶ', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();

    render(
      <ThemeProvider theme={theme}>
        <EmployeeDeleteConfirmDialog open onCancel={vi.fn()} onConfirm={onConfirm} />
      </ThemeProvider>,
    );

    await user.click(screen.getByRole('button', { name: deleteConfirmLabel }));
    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it('削除中はボタンを無効化する', () => {
    render(
      <ThemeProvider theme={theme}>
        <EmployeeDeleteConfirmDialog open isDeleting onCancel={vi.fn()} onConfirm={vi.fn()} />
      </ThemeProvider>,
    );

    expect(screen.getByRole('button', { name: deleteCancelLabel })).toBeDisabled();
    expect(screen.getByRole('button', { name: deleteConfirmLabel })).toBeDisabled();
  });
});
