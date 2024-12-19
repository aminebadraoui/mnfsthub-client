import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Tabs,
    Tab,
    Card,
    CardContent,
    Grid,
    Chip,
    CircularProgress,
    Pagination,
    IconButton
} from '@mui/material';
import { Email, Phone, LinkedIn, Facebook, Instagram, Twitter } from '@mui/icons-material';
import baserowService from '../../services/baserow.service';

export default function Campaigns() {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize] = useState(25);

    useEffect(() => {
        fetchCampaigns();
    }, [activeTab, page]);

    const fetchCampaigns = async () => {
        try {
            setLoading(true);
            const options = {
                page,
                size: pageSize,
                filters: {
                    Active: activeTab === 0 // true for active campaigns, false for past campaigns
                }
            };

            const response = await baserowService.getCampaigns(options);
            setCampaigns(response.results);
            setTotalPages(response.totalPages);
        } catch (error) {
            console.error('Error fetching campaigns:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
        setPage(1); // Reset to first page when switching tabs
    };

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const CampaignCard = ({ campaign }) => {
        const channelIcons = [
            { name: 'Email', icon: Email, enabled: campaign.Email },
            { name: 'Phone', icon: Phone, enabled: campaign.Phone },
            { name: 'LinkedIn', icon: LinkedIn, enabled: campaign.Linkedin },
            { name: 'Facebook', icon: Facebook, enabled: campaign.Facebook },
            { name: 'Instagram', icon: Instagram, enabled: campaign.Instagram },
            { name: 'Twitter', icon: Twitter, enabled: campaign.Twitter }
        ];

        return (
            <Card sx={{ height: '100%' }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        {campaign.Name}
                    </Typography>
                    <Box mt={2}>
                        <Chip
                            label={campaign.Active ? 'Active' : 'Inactive'}
                            color={campaign.Active ? 'success' : 'default'}
                            size="small"
                            sx={{ mr: 1 }}
                        />
                        <Chip
                            label={`List: ${campaign.List}`}
                            variant="outlined"
                            size="small"
                        />
                    </Box>
                    <Box mt={2} display="flex" gap={1}>
                        {channelIcons.map(({ name, icon: Icon, enabled }) => enabled && (
                            <IconButton
                                key={name}
                                size="small"
                                color="primary"
                                title={name}
                            >
                                <Icon fontSize="small" />
                            </IconButton>
                        ))}
                    </Box>
                </CardContent>
            </Card>
        );
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Campaigns
                </Typography>

                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                    <Tabs value={activeTab} onChange={handleTabChange}>
                        <Tab label="Active Campaigns" />
                        <Tab label="Past Campaigns" />
                    </Tabs>
                </Box>

                {loading ? (
                    <Box display="flex" justifyContent="center" my={4}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        <Grid container spacing={3}>
                            {campaigns.map((campaign) => (
                                <Grid item xs={12} sm={6} md={4} key={campaign.id}>
                                    <CampaignCard campaign={campaign} />
                                </Grid>
                            ))}
                        </Grid>

                        {campaigns.length === 0 && (
                            <Box textAlign="center" mt={4}>
                                <Typography color="textSecondary">
                                    {activeTab === 0
                                        ? 'No active campaigns found'
                                        : 'No past campaigns found'}
                                </Typography>
                            </Box>
                        )}

                        {campaigns.length > 0 && (
                            <Box display="flex" justifyContent="center" mt={4}>
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
            </Box>
        </Container>
    );
} 