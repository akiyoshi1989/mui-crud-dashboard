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
import { type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router';
import { appPaths } from '../app-paths';
import {
  createEmployee,
  type EmployeeFormErrors,
  type EmployeeFormValues,
  employeeRoles,
  emptyEmployeeFormValues,
  validateEmployeeForm,
} from '../data/employees';

export default function EmployeeCreatePage() {
  const navigate = useNavigate();
  const [values, setValues] = useState<EmployeeFormValues>(emptyEmployeeFormValues);
  const [errors, setErrors] = useState<EmployeeFormErrors>({});

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateEmployeeForm(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    createEmployee(values);
    navigate(appPaths.employees);
  };

  const handleReset = () => {
    setValues(emptyEmployeeFormValues);
    setErrors({});
  };

  return (
    <Box>
      <Stack spacing={3} component="form" onSubmit={handleSubmit} onReset={handleReset}>
        <Typography variant="h4" component="h1">
          Create
        </Typography>
        <TextField
          label="Name"
          value={values.name}
          onChange={(event) => setValues((current) => ({ ...current, name: event.target.value }))}
          error={Boolean(errors.name)}
          helperText={errors.name}
        />
        <TextField
          label="Age"
          type="number"
          value={values.age}
          onChange={(event) => setValues((current) => ({ ...current, age: event.target.value }))}
          error={Boolean(errors.age)}
          helperText={errors.age}
        />
        <TextField
          label="Join date"
          type="date"
          value={values.joinDate}
          onChange={(event) =>
            setValues((current) => ({ ...current, joinDate: event.target.value }))
          }
          error={Boolean(errors.joinDate)}
          helperText={errors.joinDate}
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <FormControl error={Boolean(errors.role)}>
          <InputLabel id="department-label">Department</InputLabel>
          <Select
            labelId="department-label"
            label="Department"
            value={values.role}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                role: event.target.value as EmployeeFormValues['role'],
              }))
            }
          >
            {employeeRoles.map((role) => (
              <MenuItem key={role} value={role}>
                {role}
              </MenuItem>
            ))}
          </Select>
          {errors.role ? <FormHelperText>{errors.role}</FormHelperText> : null}
        </FormControl>
        <FormControlLabel
          control={
            <Checkbox
              checked={values.isFullTime}
              onChange={(event) =>
                setValues((current) => ({ ...current, isFullTime: event.target.checked }))
              }
            />
          }
          label="Full-time"
        />
        <Stack direction="row" spacing={2}>
          <Button type="submit" variant="contained">
            Create
          </Button>
          <Button type="reset">Reset</Button>
        </Stack>
      </Stack>
    </Box>
  );
}
