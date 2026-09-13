import { Box, Stack, TextField, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import EmployeeTable from '../components/EmployeeTable';
import { filterEmployees, getEmployees } from '../data/employees';

export default function EmployeeListPage() {
  const [query, setQuery] = useState('');
  const employees = useMemo(() => filterEmployees(getEmployees(), query), [query]);

  return (
    <Box>
      <Stack spacing={3}>
        <Typography variant="h4" component="h1">
          Employees
        </Typography>
        <TextField
          label="Search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          size="small"
        />
        <EmployeeTable employees={employees} />
      </Stack>
    </Box>
  );
}
