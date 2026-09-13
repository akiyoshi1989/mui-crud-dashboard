import { QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { createQueryClient } from '../query-client';
import { employeeQueryKeys, useCreateEmployee, useEmployees } from './employee-queries';
import { employeeSeed } from './employees';

function createWrapper() {
  const queryClient = createQueryClient();

  function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  }

  return { queryClient, Wrapper };
}

describe('employeeQueryKeys', () => {
  it('一覧の query key を返す', () => {
    expect(employeeQueryKeys.list()).toEqual(['employees', 'list']);
  });
});

describe('useEmployees', () => {
  it('API から従業員一覧を取得する', async () => {
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useEmployees(), { wrapper: Wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toHaveLength(employeeSeed.length);
    expect(result.current.data?.map((employee) => employee.name)).toEqual([
      'Edward Perry',
      'Josephine Drake',
      'Cody Phillips',
    ]);
  });

  it('取得失敗を error にする', async () => {
    vi.stubGlobal('fetch', async () => new Response('error', { status: 500 }));

    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useEmployees(), { wrapper: Wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe('useCreateEmployee', () => {
  it('作成後に一覧キャッシュを無効化する', async () => {
    const { queryClient, Wrapper } = createWrapper();
    const { result: list } = renderHook(() => useEmployees(), { wrapper: Wrapper });

    await waitFor(() => expect(list.current.isSuccess).toBe(true));
    expect(list.current.data).toHaveLength(3);

    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');
    const { result: create } = renderHook(() => useCreateEmployee(), { wrapper: Wrapper });

    await create.current.mutateAsync({
      name: 'Ada Lovelace',
      age: '36',
      joinDate: '2026-01-15',
      role: 'Development',
      isFullTime: true,
    });

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: employeeQueryKeys.all });
    await waitFor(() => expect(list.current.data).toHaveLength(4));
    expect(list.current.data?.at(-1)).toMatchObject({ name: 'Ada Lovelace' });
  });
});
