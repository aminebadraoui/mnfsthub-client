import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Typography,
    CircularProgress,
    Alert,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip
} from '@mui/material';
import { createCampaign } from '../../services/campaigns.service';
import { getLists } from '../../services/lists.service';

const CampaignModal = ({ open, onClose, onCampaignCreated }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedList, setSelectedList] = useState('');
    const [lists, setLists] = useState([]);
    const [channels, setChannels] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchLists();
    }, []);

    const fetchLists = async () => {
        try {
            const fetchedLists = await getLists();
            setLists(fetchedLists);
        } catch (error) {
            console.error('Error fetching lists:', error);
            setError('Failed to fetch lists. Please try again.');
        }
    };

    const handleCreateCampaign = async () => {
        if (!name.trim()) {
            setError('Campaign name is required');
            return;
        }

        if (!selectedList) {
            setError('Please select a list');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const tenantId = localStorage.getItem('tenantId');
            const newCampaign = await createCampaign({
                name: name.trim(),
                description: description.trim(),
                listId: selectedList,
                channels: channels.join(','),
                tenantId,
                status: 'draft'
            });

            onCampaignCreated(newCampaign);
            handleClose();
        } catch (error) {
            console.error('Error creating campaign:', error);
            setError('Failed to create campaign. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setName('');
        setDescription('');
        setSelectedList('');
        setChannels([]);
        setError('');
        onClose();
    };

    const availableChannels = ['Email', 'LinkedIn', 'Twitter', 'Phone'];

    const handleChannelToggle = (channel) => {
        setChannels(prev =>
            prev.includes(channel)
                ? prev.filter(c => c !== channel)
                : [...prev, channel]
        );
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Create New Campaign</DialogTitle>
            <DialogContent>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}
                <Box sx={{ mt: 2 }}>
                    <TextField
                        label="Campaign Name"
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Description"
                        fullWidth
                        multiline
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Select List</InputLabel>
                        <Select
                            value={selectedList}
                            onChange={(e) => setSelectedList(e.target.value)}
                            label="Select List"
                        >
                            {lists.map((list) => (
                                <MenuItem key={list.id} value={list.id}>
                                    {list.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Box>
                        <Typography variant="subtitle2" sx={{ mb: 1, color: '#4A5568' }}>
                            Channels
                        </Typography>
                        <Box display="flex" gap={1} flexWrap="wrap">
                            {availableChannels.map((channel) => (
                                <Chip
                                    key={channel}
                                    label={channel}
                                    onClick={() => handleChannelToggle(channel)}
                                    color={channels.includes(channel) ? 'primary' : 'default'}
                                    sx={{
                                        bgcolor: channels.includes(channel) ? '#F3E8FF' : '#EDF2F7',
                                        color: channels.includes(channel) ? '#6B46C1' : '#4A5568',
                                        '&:hover': {
                                            bgcolor: channels.includes(channel) ? '#E9D8FD' : '#E2E8F0'
                                        }
                                    }}
                                />
                            ))}
                        </Box>
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} disabled={isLoading}>
                    Cancel
                </Button>
                <Button
                    onClick={handleCreateCampaign}
                    variant="contained"
                    disabled={isLoading}
                    sx={{
                        bgcolor: '#6B46C1',
                        '&:hover': { bgcolor: '#553C9A' }
                    }}
                >
                    {isLoading ? (
                        <CircularProgress size={24} sx={{ color: '#fff' }} />
                    ) : (
                        'Create Campaign'
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CampaignModal; 