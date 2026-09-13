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
            <ErrorPage message="Failed to load employees" />
          </MemoryRouter>
        </ThemeProvider>
      </QueryProvider>,
    );

    expect(screen.getByRole('heading', { name: 'Failed to load employees' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'トップ画面へ戻る' })).toHaveAttribute(
      'href',
      appPaths.home,
    );
  });
});
