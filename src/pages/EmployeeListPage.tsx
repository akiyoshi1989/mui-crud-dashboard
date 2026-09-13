import {
  Alert,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { appPaths } from '../app-paths';
import EmployeeTable from '../components/EmployeeTable';
import {
  defaultSearchField,
  type Employee,
  employeeColumns,
  filterEmployees,
  getEmployeeColumn,
  getEmployees,
} from '../data/employees';

export default function EmployeeListPage() {
  const [query, setQuery] = useState('');
  const [field, setField] = useState<keyof Employee>(defaultSearchField);
  const [allEmployees, setAllEmployees] = useState<Employee[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const column = getEmployeeColumn(field);
  const employees = useMemo(
    () => filterEmployees(allEmployees, query, column),
    [allEmployees, column, query],
  );

  useEffect(() => {
    let cancelled = false;

    getEmployees()
      .then((data) => {
        if (!cancelled) {
          setAllEmployees(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setLoadError('Failed to load employees');
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

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
        {loadError ? <Alert severity="error">{loadError}</Alert> : null}
        <EmployeeTable employees={employees} />
      </Stack>
    </Box>
  );
}
