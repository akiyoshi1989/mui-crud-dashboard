import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createEmployee, deleteEmployee, getEmployees } from './employees';

export const employeesQuery = queryOptions({
  queryKey: ['employees'] as const,
  queryFn: getEmployees,
});

export function useEmployees() {
  const { data = [], error, isError, isPending } = useQuery(employeesQuery);

  return { data, error, isError, isPending };
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

export function useDeleteEmployee() {
  const queryClient = useQueryClient();
  const { isPending, mutate, variables } = useMutation({
    mutationFn: deleteEmployee,
    onSuccess: async () => {
      await queryClient.invalidateQueries(employeesQuery);
    },
  });

  return { isPending, mutate, variables };
}
