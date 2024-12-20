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
    Button
} from '@mui/material';
import { Link } from 'react-router-dom';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import CampaignModal from '../CampaignModal';
import baserowService from '../../services/baserow.service';

const Campaigns = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [lists, setLists] = useState([]);
    const [isLoadingLists, setIsLoadingLists] = useState(false);

    useEffect(() => {
        fetchLists();
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

            console.log('Lists with counts:', listsWithCounts);

            setLists(listsWithCounts);
        } catch (error) {
            console.error('Error fetching lists:', error);
        } finally {
            setIsLoadingLists(false);
        }
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleCreateCampaign = (campaignData) => {
        console.log('Creating campaign:', campaignData);
        setIsModalOpen(false);
        // Add campaign creation logic here
    };

    const campaigns = [
        {
            name: "CEOs in Dubai",
            status: "Active",
            list: "ceo dubai",
            channels: ["email", "phone", "linkedin", "facebook", "instagram", "twitter"]
        }
    ];

    const renderChannelIcons = (channels) => {
        const iconMap = {
            email: <EmailIcon />,
            phone: <PhoneIcon />,
            linkedin: <LinkedInIcon />,
            facebook: <FacebookIcon />,
            instagram: <InstagramIcon />,
            twitter: <TwitterIcon />
        };

        return (
            <Stack direction="row" spacing={1}>
                {channels.map(channel => (
                    <IconButton
                        key={channel}
                        size="small"
                        sx={{
                            color: '#6B46C1',
                            '&:hover': {
                                bgcolor: '#F3E8FF'
                            }
                        }}
                    >
                        {iconMap[channel]}
                    </IconButton>
                ))}
            </Stack>
        );
    };

    return (
        <Box>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={4}>
                <Box display="flex" alignItems="center" gap={2}>
                    <IconButton
                        component={Link}
                        to="/outreach-portal"
                        sx={{
                            color: '#6B46C1',
                            '&:hover': {
                                bgcolor: '#F3E8FF'
                            }
                        }}
                    >
                        <ArrowBackIcon />
                    </IconButton>
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
                        '&:hover': {
                            bgcolor: '#553C9A'
                        }
                    }}
                >
                    Create Campaign
                </Button>
            </Box>

            <CampaignModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateCampaign}
                lists={lists}
                isLoading={isLoadingLists}
            />

            <Tabs
                value={activeTab}
                onChange={handleTabChange}
                sx={{
                    mb: 4,
                    '& .MuiTab-root': {
                        color: '#4A5568',
                        '&.Mui-selected': {
                            color: '#6B46C1'
                        }
                    },
                    '& .MuiTabs-indicator': {
                        backgroundColor: '#6B46C1'
                    }
                }}
            >
                <Tab
                    label="ACTIVE CAMPAIGNS"
                    sx={{
                        fontWeight: 600,
                        fontSize: '0.875rem'
                    }}
                />
                <Tab
                    label="PAST CAMPAIGNS"
                    sx={{
                        fontWeight: 600,
                        fontSize: '0.875rem'
                    }}
                />
            </Tabs>

            {activeTab === 0 && (
                <Box>
                    {campaigns.map((campaign) => (
                        <Paper
                            key={campaign.name}
                            sx={{
                                p: 3,
                                mb: 2,
                                borderRadius: 2,
                                border: '1px solid #E9D8FD',
                                cursor: 'pointer',
                                '&:hover': {
                                    boxShadow: '0 4px 6px -1px rgba(107, 70, 193, 0.1), 0 2px 4px -1px rgba(107, 70, 193, 0.06)',
                                    bgcolor: '#FAFAFA'
                                }
                            }}
                        >
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="h6" gutterBottom sx={{ color: '#2D3748', fontWeight: 600 }}>
                                    {campaign.name}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                    <Chip
                                        label={campaign.status}
                                        size="small"
                                        sx={{
                                            bgcolor: '#F3E8FF',
                                            color: '#6B46C1',
                                            fontWeight: 500
                                        }}
                                    />
                                    <Chip
                                        label={`List: ${campaign.list}`}
                                        size="small"
                                        sx={{
                                            bgcolor: '#F3E8FF',
                                            color: '#6B46C1',
                                            fontWeight: 500
                                        }}
                                    />
                                </Box>
                            </Box>
                            {renderChannelIcons(campaign.channels)}
                        </Paper>
                    ))}
                </Box>
            )}

            {activeTab === 1 && (
                <Box sx={{ textAlign: 'center', color: '#4A5568', mt: 4 }}>
                    No past campaigns to show.
                </Box>
            )}
        </Box>
    );
};

export default Campaigns; 