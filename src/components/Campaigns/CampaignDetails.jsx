import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Paper,
    IconButton,
    Chip,
    Grid,
    CircularProgress,
    Divider,
    Button,
    Stack
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    LinkedIn as LinkedInIcon,
    Instagram as InstagramIcon,
    Facebook as FacebookIcon,
    Twitter as TwitterIcon,
    Archive as ArchiveIcon,
    Unarchive as UnarchiveIcon,
    PlayArrow as PlayArrowIcon,
    Stop as StopIcon,
    Edit as EditIcon
} from '@mui/icons-material';
import { getCampaignById, updateCampaign } from '../../services/campaigns.service';
import { getLists } from '../../services/lists.service';
import { getContacts } from '../../services/contacts.service';
import CampaignModal from './CampaignModal';

const CampaignDetails = () => {
    const { uuid } = useParams();
    const navigate = useNavigate();
    const [campaign, setCampaign] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [lists, setLists] = useState([]);
    const [isLoadingLists, setIsLoadingLists] = useState(false);

    useEffect(() => {
        fetchCampaignDetails();
        fetchLists();
    }, [uuid]);

    const fetchLists = async () => {
        setIsLoadingLists(true);
        try {
            const fetchedLists = await getLists();
            setLists(fetchedLists);
        } catch (error) {
            console.error('Error fetching lists:', error);
        } finally {
            setIsLoadingLists(false);
        }
    };

    const fetchCampaignDetails = async () => {
        setIsLoading(true);
        try {
            const campaignData = await getCampaignById(uuid);
            if (!campaignData) {
                throw new Error('Campaign not found');
            }

            // Get contacts count for the campaign's list
            const contacts = await getContacts({ listId: campaignData.listId });
            const totalProspects = contacts.length;

            const formattedCampaign = {
                id: campaignData.id,
                uuid: campaignData.uuid,
                name: campaignData.name,
                status: campaignData.status,
                list: campaignData.list,
                listId: campaignData.listId,
                channels: campaignData.channels ? campaignData.channels.split(',') : [],
                createdAt: new Date(campaignData.createdAt).toLocaleDateString(),
                metrics: {
                    totalProspects,
                    contacted: 0,
                    responded: 0,
                    meetings: 0
                }
            };

            setCampaign(formattedCampaign);
        } catch (error) {
            console.error('Error fetching campaign details:', error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusToggle = async () => {
        if (!campaign) return;

        try {
            await updateCampaign(campaign.id, {
                status: campaign.status === 'inactive' ? 'active' : 'inactive'
            });
            await fetchCampaignDetails();
        } catch (error) {
            console.error('Error updating campaign status:', error);
        }
    };

    const getChannelIcon = (channel) => {
        const iconProps = { sx: { fontSize: 20 } };
        switch (channel) {
            case 'email':
                return <EmailIcon {...iconProps} sx={{ color: '#1976d2' }} />;
            case 'phone':
                return <PhoneIcon {...iconProps} sx={{ color: '#2e7d32' }} />;
            case 'linkedin':
                return <LinkedInIcon {...iconProps} sx={{ color: '#0077b5' }} />;
            case 'instagram':
                return <InstagramIcon {...iconProps} sx={{ color: '#e4405f' }} />;
            case 'facebook':
                return <FacebookIcon {...iconProps} sx={{ color: '#1877f2' }} />;
            case 'twitter':
                return <TwitterIcon {...iconProps} sx={{ color: '#000000' }} />;
            default:
                return null;
        }
    };

    const handleEditSubmit = async (campaignData) => {
        try {
            await updateCampaign(campaign.id, campaignData);
            await fetchCampaignDetails();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error updating campaign:', error);
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
                <Button onClick={() => navigate('/outreach-portal/campaigns')} startIcon={<ArrowBackIcon />}>
                    Back to Campaigns
                </Button>
            </Box>
        );
    }

    if (!campaign) return null;

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IconButton onClick={() => navigate('/outreach-portal/campaigns')}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Box>
                        <Typography variant="h4" sx={{ color: '#2D3748', fontWeight: 600 }}>
                            {campaign.name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            Created on {campaign.createdAt}
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant="outlined"
                        startIcon={<EditIcon />}
                        onClick={() => setIsModalOpen(true)}
                        sx={{ borderColor: '#E9D8FD', color: '#6B46C1' }}
                    >
                        Edit Campaign
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={campaign.status === 'active' ? <ArchiveIcon /> : <UnarchiveIcon />}
                        onClick={handleStatusToggle}
                        sx={{ borderColor: '#E9D8FD', color: '#6B46C1' }}
                    >
                        {campaign.status === 'active' ? 'Archive Campaign' : 'Reactivate Campaign'}
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={campaign.status === 'active' ? <StopIcon /> : <PlayArrowIcon />}
                        color={campaign.status === 'active' ? 'error' : 'success'}
                    >
                        {campaign.status === 'active' ? 'Stop Campaign' : 'Start Campaign'}
                    </Button>
                </Box>
            </Box>

            {/* Campaign Status */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid #E9D8FD' }}>
                        <Typography variant="h6" gutterBottom>
                            Campaign Overview
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle2" color="textSecondary">
                                    Status
                                </Typography>
                                <Chip
                                    label={campaign.status}
                                    color={campaign.status === 'active' ? 'success' : 'default'}
                                    size="small"
                                    sx={{ mt: 1 }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle2" color="textSecondary">
                                    Target List
                                </Typography>
                                <Typography variant="body1" sx={{ mt: 1 }}>
                                    {campaign.list}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                    Active Channels
                                </Typography>
                                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                                    {campaign.channels.map((channel) => (
                                        <IconButton
                                            key={channel}
                                            size="small"
                                            sx={{
                                                bgcolor: '#F3E8FF',
                                                '&:hover': { bgcolor: '#E9D8FD' }
                                            }}
                                        >
                                            {getChannelIcon(channel)}
                                        </IconButton>
                                    ))}
                                </Stack>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid #E9D8FD' }}>
                        <Typography variant="h6" gutterBottom>
                            Campaign Metrics
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Typography variant="subtitle2" color="textSecondary">
                                    Total Prospects
                                </Typography>
                                <Typography variant="h4" sx={{ mt: 1, color: '#6B46C1' }}>
                                    {campaign.metrics.totalProspects}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="subtitle2" color="textSecondary">
                                    Contacted
                                </Typography>
                                <Typography variant="h4" sx={{ mt: 1, color: '#6B46C1' }}>
                                    {campaign.metrics.contacted}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="subtitle2" color="textSecondary">
                                    Responded
                                </Typography>
                                <Typography variant="h4" sx={{ mt: 1, color: '#6B46C1' }}>
                                    {campaign.metrics.responded}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="subtitle2" color="textSecondary">
                                    Meetings
                                </Typography>
                                <Typography variant="h4" sx={{ mt: 1, color: '#6B46C1' }}>
                                    {campaign.metrics.meetings}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>

            {/* Campaign Activity */}
            <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid #E9D8FD' }}>
                <Typography variant="h6" gutterBottom>
                    Recent Activity
                </Typography>
                <Typography color="textSecondary">
                    No recent activity to show.
                </Typography>
            </Paper>

            <CampaignModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleEditSubmit}
                lists={lists}
                isLoading={isLoadingLists}
                campaign={campaign}
            />
        </Box>
    );
};

export default CampaignDetails; 