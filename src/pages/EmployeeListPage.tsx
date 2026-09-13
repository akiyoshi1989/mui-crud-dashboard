import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { appPaths } from '../app-paths';
import EmployeeTable from '../components/EmployeeTable';
import ErrorPage from '../components/ErrorPage';
import { useEmployees } from '../data/employee-queries';
import {
  defaultSearchField,
  type Employee,
  employeeColumns,
  filterEmployees,
  getEmployeeColumn,
} from '../data/employees';

export default function EmployeeListPage() {
  const [query, setQuery] = useState('');
  const [field, setField] = useState<keyof Employee>(defaultSearchField);
  const { data: allEmployees = [], error, isError, isPending } = useEmployees();
  const column = getEmployeeColumn(field);
  const employees = useMemo(
    () => filterEmployees(allEmployees, query, column),
    [allEmployees, column, query],
  );

  if (isError) {
    return (
      <ErrorPage message={error instanceof Error ? error.message : 'Failed to load employees'} />
    );
  }

  return (
    <Box>
      <Stack spacing={3}>
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" component="h1">
            Employees
          </Typography>
          <Button component={Link} to={appPaths.employeeNew} variant="contained">
            Create
          </Button>
        </Stack>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel id="search-column-label">Column</InputLabel>
            <Select
              labelId="search-column-label"
              label="Column"
              value={field}
              onChange={(event) => setField(event.target.value as keyof Employee)}
            >
              {employeeColumns.map((searchColumn) => (
                <MenuItem key={searchColumn.field} value={searchColumn.field}>
                  {searchColumn.header}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            size="small"
            sx={{ flexGrow: 1 }}
          />
        </Stack>
        {isPending ? (
          <CircularProgress aria-label="Loading employees" />
        ) : (
          <EmployeeTable employees={employees} />
        )}
      </Stack>
    </Box>
  );
}
