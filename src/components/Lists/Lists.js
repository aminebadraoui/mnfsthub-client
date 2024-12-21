import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Paper,
    Button,
    IconButton,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Chip,
    CircularProgress,
    Stack
} from '@mui/material';
import {
    Add as AddIcon,
    MoreVert as MoreVertIcon,
    People as PeopleIcon
} from '@mui/icons-material';
import { getLists, createList } from '../../services/lists.service';
import ListModal from './ListModal';

const Lists = () => {
    const navigate = useNavigate();
    const [lists, setLists] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchLists();
    }, []);

    const fetchLists = async () => {
        setIsLoading(true);
        try {
            const fetchedLists = await getLists();
            setLists(fetchedLists);
        } catch (error) {
            console.error('Error fetching lists:', error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateList = async (listData) => {
        try {
            await createList(listData);
            await fetchLists();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error creating list:', error);
            throw error;
        }
    };

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography color="error" variant="h6">
                    {error}
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" sx={{ color: '#2D3748', fontWeight: 600 }}>
                    Lists
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setIsModalOpen(true)}
                    sx={{ bgcolor: '#6B46C1', '&:hover': { bgcolor: '#553C9A' } }}
                >
                    Create List
                </Button>
            </Box>

            {/* Lists */}
            <List>
                {lists.map((list) => (
                    <Paper
                        key={list.id}
                        sx={{
                            mb: 2,
                            borderRadius: 2,
                            border: '1px solid #E9D8FD',
                            '&:hover': { boxShadow: 3 }
                        }}
                    >
                        <ListItem
                            button
                            onClick={() => navigate(`/outreach-portal/lists/${list.id}`)}
                            sx={{ p: 3 }}
                        >
                            <ListItemText
                                primary={
                                    <Typography variant="h6" sx={{ color: '#2D3748', mb: 1 }}>
                                        {list.name}
                                    </Typography>
                                }
                                secondary={
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <PeopleIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                        <Typography variant="body2" color="text.secondary">
                                            {list.contactCount} contacts
                                        </Typography>
                                        {list.tags && (
                                            <Chip
                                                label={list.tags}
                                                size="small"
                                                sx={{ bgcolor: '#F3E8FF', color: '#6B46C1' }}
                                            />
                                        )}
                                    </Stack>
                                }
                            />
                            <ListItemSecondaryAction>
                                <IconButton edge="end">
                                    <MoreVertIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    </Paper>
                ))}
            </List>

            <ListModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateList}
            />
        </Box>
    );
};

export default Lists; 