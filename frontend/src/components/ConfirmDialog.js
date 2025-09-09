import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
} from "@mui/material";

function ConfirmDialog({ open, title, message, onConfirm, onClose }) {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{title || "Confirmação"}</DialogTitle>
            <DialogContent>
                <DialogContentText>{message || "Tem certeza?"}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button
                    onClick={() => {
                        onConfirm();
                        onClose();
                    }}
                    color="error"
                    variant="contained"
                >
                    Confirmar
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ConfirmDialog;
