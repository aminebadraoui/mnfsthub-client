import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Typography,
    Box,
    Chip,
    Button
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import baserowService from '../services/baserow.service';

const ListsModal = ({ isOpen, onClose, lists, onAddProspects, onListRemoved }) => {
    const [prospectsCount, setProspectsCount] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen && lists.length > 0) {
            fetchProspectsCounts();
        }
    }, [isOpen, lists]);

    const fetchProspectsCounts = async () => {
        try {
            setLoading(true);
            const counts = {};
            await Promise.all(
                lists.map(async (list) => {
                    const response = await baserowService.getProspectsCount(list.Name);
                    counts[list.Name] = response.count;
                })
            );
            setProspectsCount(counts);
        } catch (error) {
            console.error('Error fetching prospects counts:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">Your Lists</Typography>
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent>
                {lists.map((list) => (
                    <Box
                        key={list.id}
                        sx={{
                            p: 3,
                            mb: 2,
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 1,
                        }}
                    >
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                            <Box>
                                <Typography variant="h6" gutterBottom>
                                    {list.Name}
                                </Typography>
                                <Box sx={{ mb: 1 }}>
                                    {list.Tags && list.Tags.split(',').map((tag, index) => (
                                        <Chip
                                            key={index}
                                            label={tag.trim()}
                                            size="small"
                                            sx={{ mr: 0.5, mb: 0.5 }}
                                        />
                                    ))}
                                </Box>
                                <Typography variant="body2" color="textSecondary">
                                    {loading ? 'Loading prospects...' : `${prospectsCount[list.Name] || 0} prospects`}
                                </Typography>
                            </Box>
                            <Box>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    size="small"
                                    onClick={() => onAddProspects(list)}
                                    sx={{ mr: 1 }}
                                >
                                    Add Prospects
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    size="small"
                                    onClick={() => {
                                        if (window.confirm('Are you sure you want to remove this list?')) {
                                            onListRemoved(list.id);
                                        }
                                    }}
                                >
                                    Remove
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                ))}
            </DialogContent>
        </Dialog>
    );
};

export default ListsModal; 