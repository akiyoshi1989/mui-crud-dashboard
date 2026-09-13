import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  type Employee,
  type EmployeeColumn,
  employeeColumns,
  formatEmployeeValue,
} from '../data/employees';

type EmployeeTableProps = {
  employees: Employee[];
  columns?: EmployeeColumn[];
};

export default function EmployeeTable({
  employees,
  columns = employeeColumns,
}: EmployeeTableProps) {
  return (
    <TableContainer component={Paper} variant="outlined" sx={{ overflowX: 'auto' }}>
      <Table aria-label="Employees" size="small" sx={{ width: 'max-content' }}>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.field} sx={{ whiteSpace: 'nowrap' }}>
                {column.header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee.id}>
              {columns.map((column) => (
                <TableCell key={column.field} sx={{ whiteSpace: 'nowrap' }}>
                  {formatEmployeeValue(employee, column)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
