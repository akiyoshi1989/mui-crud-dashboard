import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
  IconButton,
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
  deletingId?: number;
  onDelete?: (employee: Employee) => void;
  onEdit?: (employee: Employee) => void;
  onRowClick?: (employee: Employee) => void;
};

export function deleteEmployeeLabel(name: string): string {
  return `Delete ${name}`;
}

export function editEmployeeLabel(name: string): string {
  return `Edit ${name}`;
}

export default function EmployeeTable({
  employees,
  columns = employeeColumns,
  deletingId,
  onDelete,
  onEdit,
  onRowClick,
}: EmployeeTableProps) {
  const showActions = Boolean(onDelete || onEdit);

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
            {showActions ? <TableCell sx={{ whiteSpace: 'nowrap' }}>Actions</TableCell> : null}
          </TableRow>
        </TableHead>
        <TableBody>
          {employees.map((employee) => (
            <TableRow
              key={employee.id}
              hover={Boolean(onRowClick)}
              onClick={onRowClick ? () => onRowClick(employee) : undefined}
              sx={onRowClick ? { cursor: 'pointer' } : undefined}
            >
              {columns.map((column) => (
                <TableCell key={column.field} sx={{ whiteSpace: 'nowrap' }}>
                  {formatEmployeeValue(employee, column)}
                </TableCell>
              ))}
              {showActions ? (
                <TableCell
                  sx={{ whiteSpace: 'nowrap' }}
                  onClick={(event) => {
                    event.stopPropagation();
                  }}
                >
                  {onEdit ? (
                    <IconButton
                      aria-label={editEmployeeLabel(employee.name)}
                      disabled={deletingId === employee.id}
                      onClick={() => onEdit(employee)}
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                  ) : null}
                  {onDelete ? (
                    <IconButton
                      aria-label={deleteEmployeeLabel(employee.name)}
                      disabled={deletingId === employee.id}
                      onClick={() => onDelete(employee)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  ) : null}
                </TableCell>
              ) : null}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
