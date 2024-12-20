import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Box,
    Typography,
    IconButton,
    List,
    ListItem,
    ListItemText,
    LinearProgress
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const ProcessingListsModal = ({ open, onClose, processingLists }) => {
    const formatDuration = (startTime) => {
        const duration = new Date() - new Date(startTime);
        const minutes = Math.floor(duration / 60000);
        const seconds = Math.floor((duration % 60000) / 1000);
        return `${minutes}m ${seconds}s`;
    };

    // Convert Map to Array for rendering
    const processingListsArray = Array.from(processingLists, ([name, details]) => ({
        name,
        ...details
    }));

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: '12px',
                }
            }}
        >
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">Processing Lists</Typography>
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent>
                <List>
                    {processingListsArray.map((list) => (
                        <ListItem key={list.name}>
                            <ListItemText
                                primary={list.name}
                                secondary={`Processing for ${formatDuration(list.startTime)}`}
                            />
                            <LinearProgress
                                sx={{ width: '100px', ml: 2 }}
                                variant="indeterminate"
                            />
                        </ListItem>
                    ))}
                    {processingListsArray.length === 0 && (
                        <ListItem>
                            <ListItemText primary="No lists are currently processing" />
                        </ListItem>
                    )}
                </List>
            </DialogContent>
        </Dialog>
    );
};

export default ProcessingListsModal; 