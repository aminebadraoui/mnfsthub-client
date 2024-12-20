import React from 'react';
import { Snackbar, Alert } from '@mui/material';

const ProcessingNotification = ({ message, onClose }) => {
    return (
        <Snackbar
            open={Boolean(message)}
            autoHideDuration={6000}
            onClose={onClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
            <Alert
                onClose={onClose}
                severity="success"
                variant="filled"
                sx={{ width: '100%' }}
            >
                {message}
            </Alert>
        </Snackbar>
    );
};

export default ProcessingNotification; 