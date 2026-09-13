import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import DashboardHeader from './DashboardHeader';

describe('DashboardHeader', () => {
  it('タイトルとメニューボタンを表示する', async () => {
    const user = userEvent.setup();
    const onToggleMenu = vi.fn();

    render(<DashboardHeader menuOpen={false} onToggleMenu={onToggleMenu} />);

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'サイドバーを開く' }));
    expect(onToggleMenu).toHaveBeenCalledTimes(1);
  });

  it('開いているときは閉じるボタンを表示する', () => {
    render(<DashboardHeader menuOpen onToggleMenu={() => undefined} />);

    expect(screen.getByRole('button', { name: 'サイドバーを閉じる' })).toBeInTheDocument();
  });
});
