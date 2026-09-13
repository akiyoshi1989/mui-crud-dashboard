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
    <TableContainer component={Paper} variant="outlined">
      <Table aria-label="Employees">
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.field}>{column.header}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee.id}>
              {columns.map((column) => (
                <TableCell key={column.field}>{formatEmployeeValue(employee, column)}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
