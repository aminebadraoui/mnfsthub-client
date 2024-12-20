import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Typography,
    Select,
    MenuItem,
    FormControl,
    FormHelperText,
    Chip,
    IconButton,
    Grid,
    OutlinedInput,
    InputLabel
} from '@mui/material';
import {
    Close as CloseIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    LinkedIn as LinkedInIcon,
    Instagram as InstagramIcon,
    Facebook as FacebookIcon,
    Twitter as TwitterIcon
} from '@mui/icons-material';
import baserowService from '../services/baserow.service';

const CHANNELS = [
    { id: 'email', name: 'Email', icon: EmailIcon, color: '#1976d2', description: 'Send personalized email sequences' },
    { id: 'phone', name: 'Phone', icon: PhoneIcon, color: '#2e7d32', description: 'Make calls and track conversations' },
    { id: 'linkedin', name: 'LinkedIn', icon: LinkedInIcon, color: '#0077b5', description: 'Connect and message on LinkedIn' },
    { id: 'instagram', name: 'Instagram', icon: InstagramIcon, color: '#e4405f', description: 'Engage through Instagram DMs' },
    { id: 'facebook', name: 'Facebook', icon: FacebookIcon, color: '#1877f2', description: 'Reach out via Facebook Messenger' },
    { id: 'twitter', name: 'X (Twitter)', icon: TwitterIcon, color: '#000000', description: 'Connect through X (Twitter) DMs' },
];

const CampaignModal = ({ isOpen, onClose, onSubmit, lists = [], isLoading }) => {
    const [name, setName] = useState('');
    const [selectedLists, setSelectedLists] = useState([]);
    const [selectedChannels, setSelectedChannels] = useState([]);
    const [hoveredChannel, setHoveredChannel] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleListChange = (event) => {
        setSelectedLists(event.target.value);
        setFormErrors({ ...formErrors, lists: '' });
    };

    const handleChannelClick = (channelId) => {
        setSelectedChannels(prev =>
            prev.includes(channelId)
                ? prev.filter(id => id !== channelId)
                : [...prev, channelId]
        );
        setFormErrors({ ...formErrors, channels: '' });
    };

    const validateForm = () => {
        const errors = {};
        if (!name.trim()) errors.name = 'Campaign name is required';
        if (selectedLists.length === 0) errors.lists = 'Please select at least one list';
        if (selectedChannels.length === 0) errors.channels = 'Please select at least one channel';
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async () => {
        if (validateForm()) {
            setIsSubmitting(true);
            try {
                const tenantId = localStorage.getItem('tenantId');
                if (!tenantId) {
                    throw new Error('No tenant ID found');
                }

                // Get all selected lists
                const selectedListsData = selectedLists.map(listId =>
                    lists.find(l => l.UUID === listId)
                ).filter(Boolean);

                if (selectedListsData.length === 0) {
                    throw new Error('Selected lists not found');
                }

                // Create campaign in Baserow with exact column names
                const campaignData = {
                    'Name': name,
                    'List': selectedListsData.map(list => list.name).join(', '),
                    'List ID': selectedListsData.map(list => list.UUID).join(', '),
                    'Email': selectedChannels.includes('email'),
                    'Phone': selectedChannels.includes('phone'),
                    'Linkedin': selectedChannels.includes('linkedin'),
                    'Instagram': selectedChannels.includes('instagram'),
                    'Facebook': selectedChannels.includes('facebook'),
                    'Twitter': selectedChannels.includes('twitter'),
                    'Tenant ID': tenantId,
                    'Active': true
                };

                await baserowService.createCampaign(campaignData);

                // Call onSubmit with the campaign data
                onSubmit({
                    name,
                    lists: selectedLists,
                    channels: selectedChannels
                });

                // Reset form
                setName('');
                setSelectedLists([]);
                setSelectedChannels([]);
                setFormErrors({});
                onClose();
            } catch (error) {
                console.error('Error creating campaign:', error);
                setFormErrors({ submit: 'Failed to create campaign. Please try again.' });
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    maxHeight: '90vh'
                }
            }}
        >
            <DialogTitle sx={{
                borderBottom: '1px solid #E9D8FD',
                background: 'linear-gradient(135deg, #F3E8FF 0%, #FFFFFF 100%)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <Typography variant="h6" sx={{ color: '#2D3748', fontWeight: 600 }}>
                    Create New Campaign
                </Typography>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ py: 0 }}>
                <Box sx={{ mt: 2 }}>
                    <TextField
                        fullWidth
                        label="Campaign Name"
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                            setFormErrors({ ...formErrors, name: '' });
                        }}
                        error={!!formErrors.name}
                        helperText={formErrors.name}
                        sx={{ mb: 2 }}
                    />

                    <FormControl fullWidth error={!!formErrors.lists}>
                        <InputLabel>Select Lists</InputLabel>
                        <Select
                            multiple
                            value={selectedLists}
                            onChange={handleListChange}
                            input={<OutlinedInput label="Select Lists" />}
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map((listId) => {
                                        const list = lists.find(l => l.UUID === listId);
                                        return (
                                            <Chip
                                                key={listId}
                                                label={list ? list.name : ''}
                                                sx={{
                                                    bgcolor: '#F3E8FF',
                                                    color: '#6B46C1'
                                                }}
                                            />
                                        );
                                    })}
                                </Box>
                            )}
                            MenuProps={{
                                PaperProps: {
                                    style: {
                                        maxHeight: 300
                                    }
                                }
                            }}
                        >
                            {isLoading ? (
                                <MenuItem disabled>Loading lists...</MenuItem>
                            ) : lists.length === 0 ? (
                                <MenuItem disabled>No lists available</MenuItem>
                            ) : (
                                lists.map((list) => (
                                    <MenuItem key={list.UUID} value={list.UUID}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                                            <Typography>{list.name}</Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {list.count} prospects
                                            </Typography>
                                        </Box>
                                    </MenuItem>
                                ))
                            )}
                        </Select>
                        {formErrors.lists && (
                            <FormHelperText>{formErrors.lists}</FormHelperText>
                        )}
                    </FormControl>
                </Box>

                <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ color: '#2D3748', fontWeight: 500 }}>
                        Select Channels
                    </Typography>
                    <Grid container spacing={2}>
                        {CHANNELS.map((channel) => {
                            const Icon = channel.icon;
                            const isSelected = selectedChannels.includes(channel.id);
                            return (
                                <Grid item xs={6} key={channel.id}>
                                    <Box
                                        onClick={() => handleChannelClick(channel.id)}
                                        onMouseEnter={() => setHoveredChannel(channel.id)}
                                        onMouseLeave={() => setHoveredChannel(null)}
                                        sx={{
                                            p: 2,
                                            border: 1,
                                            borderColor: isSelected ? '#6B46C1' : '#E2E8F0',
                                            borderRadius: 1,
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            bgcolor: isSelected ? '#F3E8FF' : 'transparent',
                                            position: 'relative',
                                            '&:hover': {
                                                borderColor: '#6B46C1',
                                                bgcolor: '#F3E8FF'
                                            }
                                        }}
                                    >
                                        <Icon sx={{ color: channel.color, mr: 1 }} />
                                        <Typography>{channel.name}</Typography>
                                        {hoveredChannel === channel.id && (
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    bottom: '100%',
                                                    left: 0,
                                                    right: 0,
                                                    bgcolor: 'rgba(0,0,0,0.8)',
                                                    color: 'white',
                                                    p: 1,
                                                    borderRadius: 1,
                                                    fontSize: '0.875rem',
                                                    zIndex: 1,
                                                    mt: -1
                                                }}
                                            >
                                                {channel.description}
                                            </Box>
                                        )}
                                    </Box>
                                </Grid>
                            );
                        })}
                    </Grid>
                    {formErrors.channels && (
                        <FormHelperText error>{formErrors.channels}</FormHelperText>
                    )}
                    {formErrors.submit && (
                        <FormHelperText error sx={{ mt: 2, textAlign: 'center' }}>
                            {formErrors.submit}
                        </FormHelperText>
                    )}
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 2, borderTop: '1px solid #E9D8FD', bgcolor: '#F8F9FA' }}>
                <Button onClick={onClose} sx={{ color: '#4A5568' }}>
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={isSubmitting}
                    sx={{
                        bgcolor: '#6B46C1',
                        '&:hover': {
                            bgcolor: '#553C9A'
                        }
                    }}
                >
                    {isSubmitting ? 'Creating...' : 'Create Campaign'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CampaignModal; 