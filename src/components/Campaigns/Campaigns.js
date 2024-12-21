import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Tabs,
    Tab,
    Paper,
    Chip,
    IconButton,
    Stack,
    Button,
    CircularProgress,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArchiveIcon from '@mui/icons-material/Archive';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CampaignModal from '../CampaignModal';
import baserowService from '../../services/baserow.service';

const Campaigns = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [lists, setLists] = useState([]);
    const [campaigns, setCampaigns] = useState([]);
    const [isLoadingLists, setIsLoadingLists] = useState(false);
    const [isLoadingCampaigns, setIsLoadingCampaigns] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedCampaign, setSelectedCampaign] = useState(null);

    useEffect(() => {
        fetchLists();
        fetchCampaigns();
    }, []);

    const fetchLists = async () => {
        setIsLoadingLists(true);
        try {
            const tenantId = localStorage.getItem('tenantId');
            if (!tenantId) {
                throw new Error('No tenant ID found');
            }

            const response = await baserowService.getLists({
                filters: {
                    'Tenant ID': tenantId,
                    'Active': true
                }
            });

            // Get contacts count for each list
            const listsWithCounts = await Promise.all(
                response.results.map(async (list) => {
                    const contactsResponse = await baserowService.getContacts({
                        filters: {
                            'Tenant ID': tenantId,
                            'List Name': list.Name
                        }
                    });

                    return {
                        UUID: list.UUID,
                        id: list.id,
                        name: list.Name,
                        tags: list.Tags || '',
                        count: contactsResponse.count || 0
                    };
                })
            );

            setLists(listsWithCounts);
        } catch (error) {
            console.error('Error fetching lists:', error);
        } finally {
            setIsLoadingLists(false);
        }
    };

    const fetchCampaigns = async () => {
        setIsLoadingCampaigns(true);
        try {
            const tenantId = localStorage.getItem('tenantId');
            if (!tenantId) {
                throw new Error('No tenant ID found');
            }

            const response = await baserowService.getCampaigns({
                filters: {
                    'Tenant ID': tenantId
                }
            });

            const formattedCampaigns = response.results.map(campaign => ({
                id: campaign.id,
                uuid: campaign.UUID,
                name: campaign.Name,
                status: campaign.Active ? 'Active' : 'Inactive',
                list: campaign.List,
                listId: campaign['List ID'],
                channels: [
                    campaign.Email && 'email',
                    campaign.Phone && 'phone',
                    campaign.Linkedin && 'linkedin',
                    campaign.Instagram && 'instagram',
                    campaign.Facebook && 'facebook',
                    campaign.Twitter && 'twitter'
                ].filter(Boolean)
            }));

            setCampaigns(formattedCampaigns);
        } catch (error) {
            console.error('Error fetching campaigns:', error);
        } finally {
            setIsLoadingCampaigns(false);
        }
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleCreateCampaign = async (campaignData) => {
        console.log('Creating campaign:', campaignData);
        setIsModalOpen(false);
        // Refresh campaigns after creation
        await fetchCampaigns();
    };

    const getChannelIcon = (channel) => {
        switch (channel) {
            case 'email':
                return <EmailIcon sx={{ color: '#1976d2' }} />;
            case 'phone':
                return <PhoneIcon sx={{ color: '#2e7d32' }} />;
            case 'linkedin':
                return <LinkedInIcon sx={{ color: '#0077b5' }} />;
            case 'instagram':
                return <InstagramIcon sx={{ color: '#e4405f' }} />;
            case 'facebook':
                return <FacebookIcon sx={{ color: '#1877f2' }} />;
            case 'twitter':
                return <TwitterIcon sx={{ color: '#000000' }} />;
            default:
                return null;
        }
    };

    const filteredCampaigns = campaigns.filter(campaign =>
        activeTab === 0 ? campaign.status === 'Active' : campaign.status === 'Inactive'
    );

    const handleMenuOpen = (event, campaign) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
        setSelectedCampaign(campaign);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedCampaign(null);
    };

    const handleCampaignClick = (campaign) => {
        navigate(`/outreach-portal/campaigns/campaign/${campaign.uuid}`);
    };

    const handleArchiveToggle = async () => {
        if (!selectedCampaign) return;

        try {
            await baserowService.updateCampaign(selectedCampaign.id, {
                'Active': selectedCampaign.status === 'Inactive'
            });
            await fetchCampaigns();
        } catch (error) {
            console.error('Error updating campaign:', error);
        }
        handleMenuClose();
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Link to="/outreach-portal" style={{ textDecoration: 'none' }}>
                        <IconButton>
                            <ArrowBackIcon />
                        </IconButton>
                    </Link>
                    <Typography variant="h4" sx={{ color: '#2D3748', fontWeight: 600 }}>
                        Campaigns
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setIsModalOpen(true)}
                    sx={{
                        bgcolor: '#6B46C1',
                        '&:hover': { bgcolor: '#553C9A' }
                    }}
                >
                    CREATE CAMPAIGN
                </Button>
            </Box>

            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={activeTab} onChange={handleTabChange}>
                    <Tab label="Active Campaigns" />
                    <Tab label="Past Campaigns" />
                </Tabs>
            </Box>

            {isLoadingCampaigns ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                    <CircularProgress />
                </Box>
            ) : filteredCampaigns.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center', bgcolor: '#F8F9FA' }}>
                    <Typography color="textSecondary">
                        No {activeTab === 0 ? 'active' : 'past'} campaigns found
                    </Typography>
                </Paper>
            ) : (
                <Stack spacing={2}>
                    {filteredCampaigns.map((campaign) => (
                        <Paper
                            key={campaign.id}
                            onClick={() => handleCampaignClick(campaign)}
                            sx={{
                                p: 3,
                                borderRadius: 2,
                                border: '1px solid #E9D8FD',
                                cursor: 'pointer',
                                '&:hover': {
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                                    bgcolor: '#FAFAFA'
                                }
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                <Box>
                                    <Typography variant="h6" sx={{ color: '#2D3748', mb: 1 }}>
                                        {campaign.name}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                                        List: {campaign.list}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Chip
                                        label={campaign.status}
                                        color={campaign.status === 'Active' ? 'success' : 'default'}
                                        size="small"
                                    />
                                    <IconButton
                                        size="small"
                                        onClick={(e) => handleMenuOpen(e, campaign)}
                                        sx={{ ml: 1 }}
                                    >
                                        <MoreVertIcon />
                                    </IconButton>
                                </Box>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                {campaign.channels.map((channel) => (
                                    <IconButton
                                        key={channel}
                                        size="small"
                                        onClick={(e) => e.stopPropagation()}
                                        sx={{
                                            bgcolor: '#F3E8FF',
                                            '&:hover': { bgcolor: '#E9D8FD' }
                                        }}
                                    >
                                        {getChannelIcon(channel)}
                                    </IconButton>
                                ))}
                            </Box>
                        </Paper>
                    ))}
                </Stack>
            )}

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                onClick={(e) => e.stopPropagation()}
            >
                <MenuItem onClick={() => {
                    handleMenuClose();
                    selectedCampaign && handleCampaignClick(selectedCampaign);
                }}>
                    <ListItemIcon>
                        <OpenInNewIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>View Details</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleArchiveToggle}>
                    <ListItemIcon>
                        {selectedCampaign?.status === 'Active' ? (
                            <ArchiveIcon fontSize="small" />
                        ) : (
                            <UnarchiveIcon fontSize="small" />
                        )}
                    </ListItemIcon>
                    <ListItemText>
                        {selectedCampaign?.status === 'Active' ? 'Archive Campaign' : 'Reactivate Campaign'}
                    </ListItemText>
                </MenuItem>
            </Menu>

            <CampaignModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateCampaign}
                lists={lists}
                isLoading={isLoadingLists}
            />
        </Box>
    );
};

export default Campaigns; 