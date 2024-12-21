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
    Select,
    MenuItem,
    FormControl,
    FormHelperText,
    FormLabel,
    Chip,
    IconButton,
    Grid,
    OutlinedInput,
    InputLabel,
    CircularProgress,
    FormGroup,
    FormControlLabel,
    Checkbox,
    ListItemText,
    Alert
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

const CampaignModal = ({ isOpen, onClose, onSubmit, lists = [], isLoading, campaign = null }) => {
    const [name, setName] = useState('');
    const [selectedLists, setSelectedLists] = useState([]);
    const [selectedChannels, setSelectedChannels] = useState([]);
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (campaign) {
            setName(campaign.name);
            setSelectedLists(campaign.listId ? campaign.listId.split(', ') : []);
            setSelectedChannels(campaign.channels);
        } else {
            setName('');
            setSelectedLists([]);
            setSelectedChannels([]);
        }
    }, [campaign, isOpen]);

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

                // Create campaign data with exact column names
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
                    'Active': campaign ? campaign.status === 'Active' : true
                };

                // Call onSubmit with the campaign data
                await onSubmit(campaignData, campaign?.id);

                // Reset form
                setName('');
                setSelectedLists([]);
                setSelectedChannels([]);
                setFormErrors({});
                onClose();
            } catch (error) {
                console.error('Error with campaign:', error);
                setFormErrors({ submit: 'Failed to save campaign. Please try again.' });
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const handleChannelToggle = (channel) => {
        setSelectedChannels(prev => {
            if (prev.includes(channel)) {
                return prev.filter(c => c !== channel);
            } else {
                return [...prev, channel];
            }
        });
    };

    const validateForm = () => {
        const errors = {};

        if (!name.trim()) {
            errors.name = 'Campaign name is required';
        }

        if (selectedLists.length === 0) {
            errors.lists = 'At least one list must be selected';
        }

        if (selectedChannels.length === 0) {
            errors.channels = 'At least one channel must be selected';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    bgcolor: '#FFFFFF'
                }
            }}
        >
            <DialogTitle sx={{ pb: 1 }}>
                <Typography variant="h5" component="div" sx={{ color: '#2D3748', fontWeight: 600 }}>
                    {campaign ? 'Edit Campaign' : 'Create Campaign'}
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Box sx={{ mt: 2 }}>
                    <TextField
                        fullWidth
                        label="Campaign Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        error={!!formErrors.name}
                        helperText={formErrors.name}
                        sx={{ mb: 3 }}
                    />

                    <FormControl fullWidth error={!!formErrors.lists} sx={{ mb: 3 }}>
                        <InputLabel>Select Lists</InputLabel>
                        <Select
                            multiple
                            value={selectedLists}
                            onChange={(e) => setSelectedLists(e.target.value)}
                            input={<OutlinedInput label="Select Lists" />}
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map((value) => {
                                        const list = lists.find(l => l.UUID === value);
                                        return list ? (
                                            <Chip
                                                key={value}
                                                label={`${list.name} (${list.count})`}
                                                size="small"
                                            />
                                        ) : null;
                                    })}
                                </Box>
                            )}
                            MenuProps={{
                                PaperProps: {
                                    style: {
                                        maxHeight: 48 * 4.5 + 8,
                                        width: 250
                                    }
                                }
                            }}
                        >
                            {isLoading ? (
                                <MenuItem disabled>
                                    <CircularProgress size={20} sx={{ mr: 1 }} />
                                    Loading lists...
                                </MenuItem>
                            ) : lists.length === 0 ? (
                                <MenuItem disabled>No lists available</MenuItem>
                            ) : (
                                lists.map((list) => (
                                    <MenuItem key={list.UUID} value={list.UUID}>
                                        <Checkbox checked={selectedLists.indexOf(list.UUID) > -1} />
                                        <ListItemText
                                            primary={list.name}
                                            secondary={`${list.count} prospects`}
                                        />
                                    </MenuItem>
                                ))
                            )}
                        </Select>
                        {formErrors.lists && (
                            <FormHelperText>{formErrors.lists}</FormHelperText>
                        )}
                    </FormControl>

                    <FormControl error={!!formErrors.channels} component="fieldset" sx={{ width: '100%' }}>
                        <Typography variant="subtitle1" color="primary" sx={{ mb: 2 }}>
                            Channels
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Box
                                    onClick={() => handleChannelToggle('email')}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        p: 2,
                                        border: 1,
                                        borderColor: selectedChannels.includes('email') ? 'primary.main' : 'grey.300',
                                        borderRadius: 1,
                                        cursor: 'pointer',
                                        bgcolor: selectedChannels.includes('email') ? 'primary.50' : 'transparent',
                                        '&:hover': {
                                            bgcolor: 'primary.50',
                                            borderColor: 'primary.main'
                                        }
                                    }}
                                >
                                    <EmailIcon sx={{ color: '#1976d2' }} />
                                    <Typography>Email</Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={6}>
                                <Box
                                    onClick={() => handleChannelToggle('phone')}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        p: 2,
                                        border: 1,
                                        borderColor: selectedChannels.includes('phone') ? 'primary.main' : 'grey.300',
                                        borderRadius: 1,
                                        cursor: 'pointer',
                                        bgcolor: selectedChannels.includes('phone') ? 'primary.50' : 'transparent',
                                        '&:hover': {
                                            bgcolor: 'primary.50',
                                            borderColor: 'primary.main'
                                        }
                                    }}
                                >
                                    <PhoneIcon sx={{ color: '#2e7d32' }} />
                                    <Typography>Phone</Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={6}>
                                <Box
                                    onClick={() => handleChannelToggle('linkedin')}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        p: 2,
                                        border: 1,
                                        borderColor: selectedChannels.includes('linkedin') ? 'primary.main' : 'grey.300',
                                        borderRadius: 1,
                                        cursor: 'pointer',
                                        bgcolor: selectedChannels.includes('linkedin') ? 'primary.50' : 'transparent',
                                        '&:hover': {
                                            bgcolor: 'primary.50',
                                            borderColor: 'primary.main'
                                        }
                                    }}
                                >
                                    <LinkedInIcon sx={{ color: '#0077b5' }} />
                                    <Typography>LinkedIn</Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={6}>
                                <Box
                                    onClick={() => handleChannelToggle('instagram')}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        p: 2,
                                        border: 1,
                                        borderColor: selectedChannels.includes('instagram') ? 'primary.main' : 'grey.300',
                                        borderRadius: 1,
                                        cursor: 'pointer',
                                        bgcolor: selectedChannels.includes('instagram') ? 'primary.50' : 'transparent',
                                        '&:hover': {
                                            bgcolor: 'primary.50',
                                            borderColor: 'primary.main'
                                        }
                                    }}
                                >
                                    <InstagramIcon sx={{ color: '#e4405f' }} />
                                    <Typography>Instagram</Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={6}>
                                <Box
                                    onClick={() => handleChannelToggle('facebook')}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        p: 2,
                                        border: 1,
                                        borderColor: selectedChannels.includes('facebook') ? 'primary.main' : 'grey.300',
                                        borderRadius: 1,
                                        cursor: 'pointer',
                                        bgcolor: selectedChannels.includes('facebook') ? 'primary.50' : 'transparent',
                                        '&:hover': {
                                            bgcolor: 'primary.50',
                                            borderColor: 'primary.main'
                                        }
                                    }}
                                >
                                    <FacebookIcon sx={{ color: '#1877f2' }} />
                                    <Typography>Facebook</Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={6}>
                                <Box
                                    onClick={() => handleChannelToggle('twitter')}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        p: 2,
                                        border: 1,
                                        borderColor: selectedChannels.includes('twitter') ? 'primary.main' : 'grey.300',
                                        borderRadius: 1,
                                        cursor: 'pointer',
                                        bgcolor: selectedChannels.includes('twitter') ? 'primary.50' : 'transparent',
                                        '&:hover': {
                                            bgcolor: 'primary.50',
                                            borderColor: 'primary.main'
                                        }
                                    }}
                                >
                                    <TwitterIcon sx={{ color: '#000000' }} />
                                    <Typography>X (Twitter)</Typography>
                                </Box>
                            </Grid>
                        </Grid>
                        {formErrors.channels && (
                            <FormHelperText sx={{ mt: 1 }}>{formErrors.channels}</FormHelperText>
                        )}
                    </FormControl>

                    {formErrors.submit && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {formErrors.submit}
                        </Alert>
                    )}
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
                <Button onClick={onClose} sx={{ color: '#4A5568' }}>
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    sx={{
                        bgcolor: '#6B46C1',
                        '&:hover': { bgcolor: '#553C9A' }
                    }}
                >
                    {isSubmitting ? (
                        <CircularProgress size={24} sx={{ color: 'white' }} />
                    ) : campaign ? (
                        'Save Changes'
                    ) : (
                        'Create Campaign'
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CampaignModal; 