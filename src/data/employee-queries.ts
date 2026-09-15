import {
  queryOptions,
  skipToken,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  createEmployee,
  deleteEmployee,
  getEmployee,
  getEmployees,
  updateEmployee,
} from './employees';

export const employeesQuery = queryOptions({
  queryKey: ['employees'] as const,
  queryFn: getEmployees,
});

export function employeeQuery(employeeId: number) {
  return queryOptions({
    queryKey: ['employees', employeeId] as const,
    queryFn: () => getEmployee(employeeId),
  });
}

export function useEmployees() {
  const { data = [], error, isError, isPending } = useQuery(employeesQuery);

  return { data, error, isError, isPending };
}

export function useEmployee(employeeId: number | undefined) {
  const { data, error, isError, isPending } = useQuery({
    queryKey: ['employees', employeeId] as const,
    queryFn: employeeId === undefined ? skipToken : () => getEmployee(employeeId),
  });

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

export function useUpdateEmployee() {
  const queryClient = useQueryClient();
  const { isPending, mutate } = useMutation({
    mutationFn: updateEmployee,
    onSuccess: async (_employee, { employeeId }) => {
      await queryClient.invalidateQueries(employeesQuery);
      await queryClient.invalidateQueries({ queryKey: employeeQuery(employeeId).queryKey });
    },
  });

  return { isPending, mutate };
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
