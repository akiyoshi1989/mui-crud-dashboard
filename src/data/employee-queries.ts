import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createEmployee, type EmployeeFormValues, getEmployees } from './employees';

export const employeeQueryKeys = {
  all: ['employees'] as const,
  list: () => [...employeeQueryKeys.all, 'list'] as const,
};

export function useEmployees() {
  return useQuery({
    queryKey: employeeQueryKeys.list(),
    queryFn: getEmployees,
  });
}

export function useCreateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: EmployeeFormValues) => createEmployee(values),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: employeeQueryKeys.all });
    },
  });
}
