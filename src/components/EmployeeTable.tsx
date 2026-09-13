import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { type Employee, formatFullTime, formatJoinDate } from '../data/employees';

type EmployeeTableProps = {
  employees: Employee[];
};

export default function EmployeeTable({ employees }: EmployeeTableProps) {
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table aria-label="Employees">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Age</TableCell>
            <TableCell>Join date</TableCell>
            <TableCell>Department</TableCell>
            <TableCell>Full-time</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee.id}>
              <TableCell>{employee.id}</TableCell>
              <TableCell>{employee.name}</TableCell>
              <TableCell>{employee.age}</TableCell>
              <TableCell>{formatJoinDate(employee.joinDate)}</TableCell>
              <TableCell>{employee.role}</TableCell>
              <TableCell>{formatFullTime(employee.isFullTime)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
