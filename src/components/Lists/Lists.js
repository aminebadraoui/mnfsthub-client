import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Container,
    Typography,
    List as MUIList,
    ListItem,
    ListItemText,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Pagination,
    FormControlLabel,
    Switch,
    CircularProgress,
    Chip
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import baserowService from '../../services/baserow.service';

export default function Lists() {
    const [lists, setLists] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingList, setEditingList] = useState(null);
    const [formData, setFormData] = useState({
        Name: '',
        Tags: '',
        Active: true
    });

    // Pagination state
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize] = useState(25);

    // Filter state
    const [filters, setFilters] = useState({
        tenant_id: '', // You might want to get this from user context
        active: true
    });

    useEffect(() => {
        fetchLists();
    }, [page, filters]); // Refetch when page or filters change

    const fetchLists = async () => {
        try {
            setLoading(true);
            const options = {
                page,
                size: pageSize,
                filters: {
                    ...filters,
                    tenant_id: filters.tenant_id || undefined,
                    active: filters.active
                }
            };

            const response = await baserowService.getLists(options);
            setLists(response.results);
            setTotalPages(response.totalPages);
        } catch (error) {
            console.error('Error fetching lists:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (list) => {
        if (list) {
            setEditingList(list);
            setFormData({
                Name: list.Name,
                Tags: list.Tags || '',
                Active: list.Active
            });
        } else {
            setEditingList(null);
            setFormData({ Name: '', Tags: '', Active: true });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingList(null);
        setFormData({ Name: '', Tags: '', Active: true });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingList) {
                await baserowService.updateList(editingList.id, formData);
            } else {
                await baserowService.createList({
                    ...formData,
                    Tenant_ID: filters.tenant_id // Add tenant_id from filters
                });
            }
            handleCloseDialog();
            fetchLists();
        } catch (error) {
            console.error('Error saving list:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this list?')) {
            try {
                await baserowService.deleteList(id);
                fetchLists();
            } catch (error) {
                console.error('Error deleting list:', error);
            }
        }
    };

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPage(1); // Reset to first page when filters change
    };

    return (
        <Container maxWidth="md">
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Lists
                </Typography>

                {/* Filters */}
                <Box sx={{ mb: 2 }}>
                    <TextField
                        label="Tenant ID"
                        value={filters.tenant_id}
                        onChange={(e) => handleFilterChange('tenant_id', e.target.value)}
                        size="small"
                        sx={{ mr: 2 }}
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={filters.active}
                                onChange={(e) => handleFilterChange('active', e.target.checked)}
                            />
                        }
                        label="Active Only"
                    />
                </Box>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleOpenDialog()}
                    sx={{ mb: 2 }}
                >
                    Create New List
                </Button>

                {loading ? (
                    <Box display="flex" justifyContent="center" my={4}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        <MUIList>
                            {lists.map((list) => (
                                <ListItem
                                    key={list.id}
                                    secondaryAction={
                                        <Box>
                                            <IconButton
                                                edge="end"
                                                aria-label="edit"
                                                onClick={() => handleOpenDialog(list)}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                edge="end"
                                                aria-label="delete"
                                                onClick={() => handleDelete(list.id)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    }
                                >
                                    <ListItemText
                                        primary={list.Name}
                                        secondary={
                                            <Box>
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
                                                    Status: {list.Active ? 'Active' : 'Inactive'}
                                                </Typography>
                                            </Box>
                                        }
                                    />
                                </ListItem>
                            ))}
                        </MUIList>

                        {lists.length === 0 && (
                            <Box textAlign="center" mt={4}>
                                <Typography color="textSecondary">
                                    No lists found
                                </Typography>
                            </Box>
                        )}

                        {lists.length > 0 && (
                            <Box display="flex" justifyContent="center" mt={2}>
                                <Pagination
                                    count={totalPages}
                                    page={page}
                                    onChange={handlePageChange}
                                    color="primary"
                                />
                            </Box>
                        )}
                    </>
                )}

                <Dialog open={openDialog} onClose={handleCloseDialog}>
                    <DialogTitle>
                        {editingList ? 'Edit List' : 'Create New List'}
                    </DialogTitle>
                    <form onSubmit={handleSubmit}>
                        <DialogContent>
                            <TextField
                                autoFocus
                                margin="dense"
                                label="Name"
                                type="text"
                                fullWidth
                                value={formData.Name}
                                onChange={(e) =>
                                    setFormData({ ...formData, Name: e.target.value })
                                }
                                required
                            />
                            <TextField
                                margin="dense"
                                label="Tags (comma-separated)"
                                type="text"
                                fullWidth
                                value={formData.Tags}
                                onChange={(e) =>
                                    setFormData({ ...formData, Tags: e.target.value })
                                }
                                helperText="Enter tags separated by commas (e.g., ceo, dubai)"
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={formData.Active}
                                        onChange={(e) =>
                                            setFormData({ ...formData, Active: e.target.checked })
                                        }
                                    />
                                }
                                label="Active"
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDialog}>Cancel</Button>
                            <Button type="submit" variant="contained">
                                {editingList ? 'Save' : 'Create'}
                            </Button>
                        </DialogActions>
                    </form>
                </Dialog>
            </Box>
        </Container>
    );
} 