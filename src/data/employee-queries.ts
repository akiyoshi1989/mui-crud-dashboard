import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createEmployee, getEmployees } from './employees';

export const employeesQuery = queryOptions({
  queryKey: ['employees'] as const,
  queryFn: getEmployees,
});

export function useEmployees() {
  const { data = [], isError, isPending } = useQuery(employeesQuery);

  return { data, isError, isPending };
}

export function useCreateEmployee() {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: createEmployee,
    onSuccess: async () => {
      await queryClient.invalidateQueries(employeesQuery);
    },
  });

  return { mutate, isPending };
}
