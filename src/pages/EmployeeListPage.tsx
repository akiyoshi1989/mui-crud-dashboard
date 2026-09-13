import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useMemo, useState } from 'react';
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
  const column = getEmployeeColumn(field);
  const employees = useMemo(() => filterEmployees(getEmployees(), query, column), [column, query]);

  return (
    <Box>
      <Stack spacing={3}>
        <Typography variant="h4" component="h1">
          Employees
        </Typography>
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
        <EmployeeTable employees={employees} />
      </Stack>
    </Box>
  );
}
