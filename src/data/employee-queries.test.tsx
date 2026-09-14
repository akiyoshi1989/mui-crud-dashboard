import { QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { createQueryClient } from '../query-client';
import { employeeApiErrorCodes } from './employee-api-error';
import {
  employeeQuery,
  employeesQuery,
  useCreateEmployee,
  useDeleteEmployee,
  useEmployee,
  useEmployees,
} from './employee-queries';
import { employeeSeed, getEmployees } from './employees';

function createWrapper() {
  const queryClient = createQueryClient();

  function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  }

  return { queryClient, Wrapper };
}

describe('employeesQuery', () => {
  it('query key と query fn をセットで持つ', () => {
    expect(employeesQuery.queryKey).toEqual(['employees']);
    expect(employeesQuery.queryFn).toBe(getEmployees);
  });
});

describe('employeeQuery', () => {
  it('query key と query fn をセットで持つ', () => {
    const query = employeeQuery(1);

    expect(query.queryKey).toEqual(['employees', 1]);
    expect(query.queryFn).toBeTypeOf('function');
  });
});

describe('useEmployee', () => {
  it('API から従業員 1 件を取得する', async () => {
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useEmployee(1), { wrapper: Wrapper });

    await waitFor(() => expect(result.current.data?.name).toBe('Edward Perry'));

    const { data } = result.current;
    expect(data).toMatchObject({
      id: 1,
      birthDate: '2000-03-12T00:00:00.000Z',
    });
  });

  it('取得失敗を error にする', async () => {
    vi.stubGlobal('fetch', async () => new Response('error', { status: 500 }));

    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useEmployee(1), { wrapper: Wrapper });

    await waitFor(() => {
      const { error, isError } = result.current;
      expect(isError).toBe(true);
      expect(error).toMatchObject({ code: employeeApiErrorCodes.loadEmployee });
    });
  });

  it('id が無いときは API を呼ばない', () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);

    const { Wrapper } = createWrapper();
    renderHook(() => useEmployee(undefined), { wrapper: Wrapper });

    expect(fetchSpy).not.toHaveBeenCalled();
  });
});

describe('useEmployees', () => {
  it('API から従業員一覧を取得する', async () => {
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useEmployees(), { wrapper: Wrapper });

    await waitFor(() => expect(result.current.data).toHaveLength(employeeSeed.length));

    const { data } = result.current;

    expect(data.map((employee) => employee.name)).toEqual([
      'Edward Perry',
      'Josephine Drake',
      'Cody Phillips',
    ]);
  });

  it('取得失敗を error にする', async () => {
    vi.stubGlobal('fetch', async () => new Response('error', { status: 500 }));

    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useEmployees(), { wrapper: Wrapper });

    await waitFor(() => {
      const { error, isError } = result.current;
      expect(isError).toBe(true);
      expect(error).toMatchObject({ code: employeeApiErrorCodes.loadEmployees });
    });
  });
});

describe('useCreateEmployee', () => {
  it('作成後に一覧キャッシュを無効化する', async () => {
    const { queryClient, Wrapper } = createWrapper();
    const { result: list } = renderHook(() => useEmployees(), { wrapper: Wrapper });

    await waitFor(() => expect(list.current.data).toHaveLength(3));

    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');
    const { result: create } = renderHook(() => useCreateEmployee(), { wrapper: Wrapper });
    const { mutate } = create.current;

    mutate({
      name: 'Ada Lovelace',
      age: '36',
      joinDate: '2026-01-15',
      role: 'Development',
      isFullTime: true,
    });

    await waitFor(() => expect(invalidateSpy).toHaveBeenCalledWith(employeesQuery));
    await waitFor(() => expect(list.current.data).toHaveLength(4));

    const { data } = list.current;
    expect(data.at(-1)).toMatchObject({ name: 'Ada Lovelace' });
  });
});

describe('useDeleteEmployee', () => {
  it('削除後に一覧キャッシュを無効化する', async () => {
    const { queryClient, Wrapper } = createWrapper();
    const { result: list } = renderHook(() => useEmployees(), { wrapper: Wrapper });

    await waitFor(() => expect(list.current.data).toHaveLength(3));

    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');
    const { result: remove } = renderHook(() => useDeleteEmployee(), { wrapper: Wrapper });
    const { mutate } = remove.current;

    mutate(1);

    await waitFor(() => expect(invalidateSpy).toHaveBeenCalledWith(employeesQuery));
    await waitFor(() => expect(list.current.data).toHaveLength(2));

    const { data } = list.current;
    expect(data.map((employee) => employee.id)).toEqual([2, 3]);
  });
});
