import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

export const deleteConfirmTitle = 'Delete item?';
export const deleteConfirmMessage = 'Do you wish to delete this item?';
export const deleteConfirmLabel = 'Delete';
export const deleteCancelLabel = 'Cancel';

type EmployeeDeleteConfirmDialogProps = {
  open: boolean;
  isDeleting?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function EmployeeDeleteConfirmDialog({
  open,
  isDeleting = false,
  onCancel,
  onConfirm,
}: EmployeeDeleteConfirmDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={() => {
        if (!isDeleting) {
          onCancel();
        }
      }}
      aria-labelledby="employee-delete-confirm-title"
      aria-describedby="employee-delete-confirm-message"
    >
      <DialogTitle id="employee-delete-confirm-title">{deleteConfirmTitle}</DialogTitle>
      <DialogContent>
        <DialogContentText id="employee-delete-confirm-message">
          {deleteConfirmMessage}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} disabled={isDeleting}>
          {deleteCancelLabel}
        </Button>
        <Button color="error" variant="contained" onClick={onConfirm} disabled={isDeleting}>
          {deleteConfirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
