import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { appPaths } from '../app-paths';
import ErrorPage from '../components/ErrorPage';
import { useCreateEmployee } from '../data/employee-queries';
import {
  type EmployeeFormErrors,
  employeeFormValuesFromFormData,
  employeeRoles,
  validateEmployeeForm,
} from '../data/employees';
import { getErrorPageMessage } from '../errors/get-error-page-message';

export default function EmployeeCreatePage() {
  const navigate = useNavigate();
  const { isPending, mutate } = useCreateEmployee();
  const [errors, setErrors] = useState<EmployeeFormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  function createEmployeeAction(formData: FormData) {
    const values = employeeFormValuesFromFormData(formData);
    const nextErrors = validateEmployeeForm(values);
    setErrors(nextErrors);
    setSubmitError(null);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    mutate(values, {
      onSuccess: () => {
        navigate(appPaths.employees);
      },
      onError: (cause) => {
        setSubmitError(getErrorPageMessage(cause));
      },
    });
  }

  if (submitError) {
    return <ErrorPage message={submitError} />;
  }

  return (
    <Box>
      <Box component="form" action={createEmployeeAction}>
        <Stack spacing={3}>
          <Typography variant="h4" component="h1">
            Create
          </Typography>
          <TextField
            name="name"
            label="Name"
            defaultValue=""
            error={Boolean(errors.name)}
            helperText={errors.name}
          />
          <TextField
            name="age"
            label="Age"
            type="number"
            defaultValue=""
            error={Boolean(errors.age)}
            helperText={errors.age}
          />
          <TextField
            name="joinDate"
            label="Join date"
            type="date"
            defaultValue=""
            error={Boolean(errors.joinDate)}
            helperText={errors.joinDate}
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <FormControl error={Boolean(errors.role)}>
            <InputLabel id="department-label">Department</InputLabel>
            <Select name="role" labelId="department-label" label="Department" defaultValue="">
              {employeeRoles.map((role) => (
                <MenuItem key={role} value={role}>
                  {role}
                </MenuItem>
              ))}
            </Select>
            {errors.role ? <FormHelperText>{errors.role}</FormHelperText> : null}
          </FormControl>
          <FormControlLabel control={<Checkbox name="isFullTime" />} label="Full-time" />
          <Stack direction="row" spacing={2}>
            <Button type="submit" variant="contained" disabled={isPending}>
              Create
            </Button>
            <Button type="reset" onClick={() => setErrors({})}>
              Reset
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}
