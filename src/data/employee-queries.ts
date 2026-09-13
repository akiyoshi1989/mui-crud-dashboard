import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createEmployee, getEmployees } from './employees';

export const employeesQuery = queryOptions({
  queryKey: ['employees'] as const,
  queryFn: getEmployees,
});

export function useEmployees() {
  return useQuery(employeesQuery);
}

export function useCreateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEmployee,
    onSuccess: async () => {
      await queryClient.invalidateQueries(employeesQuery);
    },
  });
}
