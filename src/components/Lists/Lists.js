import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Button,
    Container,
    Grid,
    Card,
    CardContent,
    Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AddProspectsModal from '../AddProspectsModal';
import ProcessingBanner from '../ProcessingBanner';
import ProcessingListsModal from '../ProcessingListsModal';
import ProcessingNotification from '../ProcessingNotification';
import { getLists } from '../../services/lists.service';

const Lists = () => {
    const navigate = useNavigate();
    const [lists, setLists] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [processingLists, setProcessingLists] = useState(new Map());
    const [showProcessingModal, setShowProcessingModal] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');

    useEffect(() => {
        fetchLists();
    }, []);

    const fetchLists = async () => {
        try {
            const response = await getLists();
            setLists(response);
        } catch (error) {
            console.error('Error fetching lists:', error);
        }
    };

    const handleListClick = (listId, listName) => {
        navigate(`/outreach-portal/lists/${listId}`, { state: { listName } });
    };

    const handleAddProspects = (listName) => {
        // Add list to processing state
        const processingList = {
            name: listName,
            startTime: new Date().toISOString()
        };
        setProcessingLists(prev => new Map(prev.set(listName, processingList)));

        // Simulate processing completion after 5 seconds
        setTimeout(() => {
            setProcessingLists(prev => {
                const newMap = new Map(prev);
                newMap.delete(listName);
                return newMap;
            });
            setShowNotification(true);
            setNotificationMessage(`List "${listName}" has been processed successfully`);
            fetchLists(); // Refresh lists after processing
        }, 5000);
    };

    const handleListCreated = (newList) => {
        fetchLists();
    };

    return (
        <Container>
            {processingLists.size > 0 && (
                <ProcessingBanner
                    count={processingLists.size}
                    onClick={() => setShowProcessingModal(true)}
                />
            )}

            <ProcessingListsModal
                open={showProcessingModal}
                onClose={() => setShowProcessingModal(false)}
                processingLists={processingLists}
            />

            <ProcessingNotification
                open={showNotification}
                message={notificationMessage}
                onClose={() => setShowNotification(false)}
            />

            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4" component="h1">
                    Lists
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setIsModalOpen(true)}
                    sx={{
                        bgcolor: '#6B46C1',
                        '&:hover': {
                            bgcolor: '#553C9A'
                        }
                    }}
                >
                    Add Prospects
                </Button>
            </Box>

            <AddProspectsModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                lists={lists}
                onListCreated={handleListCreated}
                onProspectsAdded={handleAddProspects}
                processingLists={processingLists}
            />

            <Box>
                <Grid container spacing={3}>
                    {lists.map((list) => (
                        <Grid item xs={12} sm={6} md={4} key={list.id}>
                            <Card
                                onClick={() => handleListClick(list.id, list.name)}
                                sx={{
                                    cursor: 'pointer',
                                    '&:hover': {
                                        boxShadow: 3,
                                        transform: 'translateY(-2px)',
                                        transition: 'all 0.2s'
                                    }
                                }}
                            >
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        {list.name}
                                    </Typography>
                                    <Box sx={{ mb: 2 }}>
                                        <Typography color="text.secondary">
                                            {list.count} prospects
                                        </Typography>
                                    </Box>
                                    <Box>
                                        {list.tags && list.tags.split(',').map((tag, index) => (
                                            <Chip
                                                key={index}
                                                label={tag.trim()}
                                                size="small"
                                                sx={{ mr: 0.5, mb: 0.5 }}
                                            />
                                        ))}
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Container>
    );
};

export default Lists; 