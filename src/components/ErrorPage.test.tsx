import { ThemeProvider } from '@mui/material/styles';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import { appPaths } from '../app-paths';
import { QueryProvider } from '../test/query-provider';
import { theme } from '../theme';
import ErrorPage from './ErrorPage';

describe('ErrorPage', () => {
  it('エラーメッセージとトップへのリンクを表示する', () => {
    render(
      <QueryProvider>
        <ThemeProvider theme={theme}>
          <MemoryRouter>
            <ErrorPage message="従業員一覧を取得できませんでした" />
          </MemoryRouter>
        </ThemeProvider>
      </QueryProvider>,
    );

    expect(
      screen.getByRole('heading', { name: '従業員一覧を取得できませんでした' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'トップ画面へ戻る' })).toHaveAttribute(
      'href',
      appPaths.home,
    );
  });
});
