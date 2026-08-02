import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";

function ConfirmDialog({
    open,
    title,
    message,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    confirmColor = "error",
    onConfirm,
    onCancel,
    children,
}) {
    return (
        <Dialog
            open={open}
            onClose={onCancel}
            maxWidth="xs"
            fullWidth
        >
            <DialogTitle>
                {title}
            </DialogTitle>

            <DialogContent>
                {message && (
                    <DialogContentText>
                        {message}
                    </DialogContentText>
                )}

                {children}
            </DialogContent>

            <DialogActions>
                <Button
                    onClick={onCancel}
                    color="inherit"
                >
                    {cancelLabel}
                </Button>

                <Button
                    onClick={onConfirm}
                    variant="contained"
                    color={confirmColor}
                    autoFocus
                >
                    {confirmLabel}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ConfirmDialog;

