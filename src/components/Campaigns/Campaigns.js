import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Paper,
    Button,
    IconButton,
    Chip,
    Grid,
    CircularProgress,
    Stack
} from '@mui/material';
import {
    Add as AddIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    LinkedIn as LinkedInIcon,
    Instagram as InstagramIcon,
    Facebook as FacebookIcon,
    Twitter as TwitterIcon,
    MoreVert as MoreVertIcon
} from '@mui/icons-material';
import { getCampaigns, createCampaign } from '../../services/campaigns.service';
import { getLists } from '../../services/lists.service';
import CampaignModal from './CampaignModal';

const Campaigns = () => {
    const navigate = useNavigate();
    const [campaigns, setCampaigns] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [lists, setLists] = useState([]);
    const [isLoadingLists, setIsLoadingLists] = useState(false);

    useEffect(() => {
        fetchCampaigns();
        fetchLists();
    }, []);

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

    const fetchCampaigns = async () => {
        setIsLoading(true);
        try {
            const campaignsData = await getCampaigns();
            const formattedCampaigns = campaignsData.map(campaign => ({
                id: campaign.id,
                uuid: campaign.uuid,
                name: campaign.name,
                status: campaign.status,
                list: campaign.list,
                listId: campaign.listId,
                channels: campaign.channels ? campaign.channels.split(',') : [],
                createdAt: new Date(campaign.createdAt).toLocaleDateString(),
                metrics: {
                    totalProspects: 0,
                    contacted: 0,
                    responded: 0,
                    meetings: 0
                }
            }));
            setCampaigns(formattedCampaigns);
        } catch (error) {
            console.error('Error fetching campaigns:', error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateCampaign = async (campaignData) => {
        try {
            await createCampaign(campaignData);
            await fetchCampaigns();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error creating campaign:', error);
            throw error;
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
                    Campaigns
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setIsModalOpen(true)}
                    sx={{ bgcolor: '#6B46C1', '&:hover': { bgcolor: '#553C9A' } }}
                >
                    Create Campaign
                </Button>
            </Box>

            {/* Campaign Grid */}
            <Grid container spacing={3}>
                {campaigns.map((campaign) => (
                    <Grid item xs={12} md={6} lg={4} key={campaign.id}>
                        <Paper
                            sx={{
                                p: 3,
                                borderRadius: 2,
                                border: '1px solid #E9D8FD',
                                cursor: 'pointer',
                                '&:hover': { boxShadow: 3 }
                            }}
                            onClick={() => navigate(`/outreach-portal/campaigns/${campaign.uuid}`)}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                <Box>
                                    <Typography variant="h6" sx={{ color: '#2D3748', mb: 1 }}>
                                        {campaign.name}
                                    </Typography>
                                    <Chip
                                        label={campaign.status}
                                        color={campaign.status === 'active' ? 'success' : 'default'}
                                        size="small"
                                    />
                                </Box>
                                <IconButton size="small">
                                    <MoreVertIcon />
                                </IconButton>
                            </Box>

                            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                                List: {campaign.list}
                            </Typography>

                            <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
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

                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant="caption" color="textSecondary">
                                        Total Prospects
                                    </Typography>
                                    <Typography variant="h6" sx={{ color: '#6B46C1' }}>
                                        {campaign.metrics.totalProspects}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="caption" color="textSecondary">
                                        Contacted
                                    </Typography>
                                    <Typography variant="h6" sx={{ color: '#6B46C1' }}>
                                        {campaign.metrics.contacted}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            <CampaignModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateCampaign}
                lists={lists}
                isLoading={isLoadingLists}
            />
        </Box>
    );
};

export default Campaigns; 