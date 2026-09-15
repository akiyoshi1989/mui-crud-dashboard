import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { appPaths } from '../app-paths';
import ErrorPage from '../components/ErrorPage';
import { useEmployee, useUpdateEmployee } from '../data/employee-queries';
import {
  type Employee,
  type EmployeeColumn,
  type EmployeeFormErrors,
  employeeDetailColumns,
  employeeFormValuesFromFormData,
  employeeRoles,
  formatEmployeeValue,
  formatJoinDate,
  isEmployeeFormColumn,
  parseEmployeeId,
  validateEmployeeForm,
} from '../data/employees';
import { getErrorPageMessage, invalidEmployeeIdMessage } from '../errors/get-error-page-message';

type EmployeeEditFieldProps = {
  column: EmployeeColumn;
  employee: Employee;
  errors: EmployeeFormErrors;
};

function EmployeeEditField({ column, employee, errors }: EmployeeEditFieldProps) {
  const labelId = `${column.field}-label`;

  if (!isEmployeeFormColumn(column)) {
    return formatEmployeeValue(employee, column);
  }

  if (column.field === 'name') {
    return (
      <TextField
        name="name"
        hiddenLabel
        size="small"
        defaultValue={employee.name}
        error={Boolean(errors.name)}
        helperText={errors.name}
        slotProps={{ htmlInput: { 'aria-labelledby': labelId } }}
      />
    );
  }

  if (column.field === 'age') {
    return (
      <TextField
        name="age"
        hiddenLabel
        size="small"
        type="number"
        defaultValue={String(employee.age)}
        error={Boolean(errors.age)}
        helperText={errors.age}
        slotProps={{ htmlInput: { 'aria-labelledby': labelId } }}
      />
    );
  }

  if (column.field === 'joinDate') {
    return (
      <TextField
        name="joinDate"
        hiddenLabel
        size="small"
        type="date"
        defaultValue={formatJoinDate(employee.joinDate)}
        error={Boolean(errors.joinDate)}
        helperText={errors.joinDate}
        slotProps={{ htmlInput: { 'aria-labelledby': labelId } }}
      />
    );
  }

  if (column.field === 'role') {
    return (
      <FormControl error={Boolean(errors.role)} size="small">
        <Select name="role" defaultValue={employee.role} labelId={labelId}>
          {employeeRoles.map((role) => (
            <MenuItem key={role} value={role}>
              {role}
            </MenuItem>
          ))}
        </Select>
        {errors.role ? <FormHelperText>{errors.role}</FormHelperText> : null}
      </FormControl>
    );
  }

  return (
    <Checkbox
      name="isFullTime"
      defaultChecked={employee.isFullTime}
      slotProps={{ input: { 'aria-labelledby': labelId } }}
    />
  );
}

export default function EmployeeEditPage() {
  const navigate = useNavigate();
  const { employeeId } = useParams<{ employeeId: string }>();
  const employeeIdNumber = parseEmployeeId(employeeId);
  const { data: employee, error, isError, isPending } = useEmployee(employeeIdNumber);
  const { isPending: isUpdating, mutate } = useUpdateEmployee();
  const [errors, setErrors] = useState<EmployeeFormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  function updateEmployeeAction(formData: FormData) {
    if (employeeIdNumber === undefined || !employee) {
      return;
    }

    const values = employeeFormValuesFromFormData(formData);
    const nextErrors = validateEmployeeForm(values);
    setErrors(nextErrors);
    setSubmitError(null);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    mutate(
      { birthDate: employee.birthDate, employeeId: employeeIdNumber, values },
      {
        onSuccess: () => {
          navigate(appPaths.employees);
        },
        onError: (cause) => {
          setSubmitError(getErrorPageMessage(cause));
        },
      },
    );
  }

  if (employeeIdNumber === undefined) {
    return <ErrorPage message={invalidEmployeeIdMessage} />;
  }

  if (submitError) {
    return <ErrorPage message={submitError} />;
  }

  if (isError) {
    return <ErrorPage message={getErrorPageMessage(error)} />;
  }

  if (isPending || !employee) {
    return <CircularProgress aria-label="Loading employee" />;
  }

  return (
    <Box>
      <Box component="form" action={updateEmployeeAction}>
        <Stack spacing={3}>
          <Typography variant="h4" component="h1">
            {employee.name}
          </Typography>
          <Box component="dl" sx={{ m: 0 }}>
            {employeeDetailColumns.map((column) => (
              <Box key={column.field} sx={{ mb: 2 }}>
                <Typography
                  component="dt"
                  variant="subtitle2"
                  color="text.secondary"
                  id={`${column.field}-label`}
                >
                  {column.header}
                </Typography>
                <Box component="dd" sx={{ m: 0 }}>
                  <EmployeeEditField column={column} employee={employee} errors={errors} />
                </Box>
              </Box>
            ))}
          </Box>
          <Button type="submit" variant="contained" disabled={isUpdating}>
            Save
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
