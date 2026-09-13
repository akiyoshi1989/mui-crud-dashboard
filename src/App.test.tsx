import { ThemeProvider } from '@mui/material/styles';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';
import { theme } from './theme';

describe('App', () => {
  it('ホームの土台タイトルとスタックを表示する', () => {
    render(
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>,
    );

    expect(screen.getByRole('heading', { name: 'MUI CRUD Dashboard' })).toBeInTheDocument();
    expect(
      screen.getByText('React + Vite + MUI + Biome + React Router の土台です。'),
    ).toBeInTheDocument();
    expect(screen.getByText('React Router')).toBeInTheDocument();
  });
});
