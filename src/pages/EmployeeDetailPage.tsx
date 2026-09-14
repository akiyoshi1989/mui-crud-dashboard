import { Box, CircularProgress, Stack, Typography } from '@mui/material';
import { useParams } from 'react-router';
import ErrorPage from '../components/ErrorPage';
import { useEmployee } from '../data/employee-queries';
import { employeeDetailColumns, formatEmployeeValue, parseEmployeeId } from '../data/employees';
import { getErrorPageMessage, invalidEmployeeIdMessage } from '../errors/get-error-page-message';

export default function EmployeeDetailPage() {
  const { employeeId } = useParams<{ employeeId: string }>();
  const employeeIdNumber = parseEmployeeId(employeeId);
  const { data: employee, error, isError, isPending } = useEmployee(employeeIdNumber);

  if (employeeIdNumber === undefined) {
    return <ErrorPage message={invalidEmployeeIdMessage} />;
  }

  if (isError) {
    return <ErrorPage message={getErrorPageMessage(error)} />;
  }

  if (isPending || !employee) {
    return <CircularProgress aria-label="Loading employee" />;
  }

  return (
    <Box>
      <Stack spacing={3}>
        <Typography variant="h4" component="h1">
          {employee.name}
        </Typography>
        <Box component="dl" sx={{ m: 0 }}>
          {employeeDetailColumns.map((column) => (
            <Box key={column.field} sx={{ mb: 2 }}>
              <Typography component="dt" variant="subtitle2" color="text.secondary">
                {column.header}
              </Typography>
              <Typography component="dd" sx={{ m: 0 }}>
                {formatEmployeeValue(employee, column)}
              </Typography>
            </Box>
          ))}
        </Box>
      </Stack>
    </Box>
  );
}
