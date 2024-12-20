import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Box, Typography, Paper, Grid, Button, Skeleton, Tooltip, IconButton } from '@mui/material';
import { BarChart, People, Campaign, Refresh, Info, FormatListBulleted, AddCircleOutline, Assessment, Settings, PlayArrow, PauseCircle } from '@mui/icons-material';
import baserowService from '../services/baserow.service';
import AddProspectsModal from './AddProspectsModal';
import ProcessingBanner from './ProcessingBanner';
import ProcessingListsModal from './ProcessingListsModal';
import ProcessingNotification from './ProcessingNotification';
import { getLists } from '../services/lists.service';

const OutreachPortal = () => {
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(new Date());
    const [stats, setStats] = useState({
        totalProspects: 0,
        activeCampaigns: 0,
        responseRate: 0
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [processingLists, setProcessingLists] = useState(new Map());
    const [showProcessingModal, setShowProcessingModal] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [lists, setLists] = useState([]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            // Get tenant ID
            const tenantId = localStorage.getItem('tenantId');
            if (!tenantId) {
                throw new Error('No tenant ID found');
            }

            // Fetch lists to calculate total prospects
            const listsResponse = await baserowService.getLists({
                filters: {
                    'Tenant ID': tenantId,
                    'Active': true
                }
            });

            // Store the lists
            setLists(listsResponse.results.map(list => ({
                id: list.id,
                name: list.Name,
                count: 0,
                tags: list.Tags || ''
            })));

            // Get contacts count for each list
            let totalProspects = 0;
            for (const list of listsResponse.results) {
                const contactsResponse = await baserowService.getContacts({
                    filters: {
                        'Tenant ID': tenantId,
                        'List Name': list.Name
                    }
                });
                totalProspects += contactsResponse.count || 0;
                // Update the list count
                setLists(prevLists => prevLists.map(l =>
                    l.name === list.Name ? { ...l, count: contactsResponse.count || 0 } : l
                ));
            }

            // Fetch campaigns to get active count
            const campaignsResponse = await baserowService.getCampaigns({
                filters: {
                    'Tenant ID': tenantId,
                    'Status': 'Active'
                }
            });

            setStats({
                totalProspects,
                activeCampaigns: campaignsResponse.count || 0,
                responseRate: 24 // This would need to be calculated based on actual response data
            });
        } catch (error) {
            console.error('Error fetching portal data:', error);
        } finally {
            setIsLoading(false);
            setLastUpdated(new Date());
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleRefresh = () => {
        fetchData();
    };

    const handleAddProspects = (listName) => {
        const processingList = {
            name: listName,
            startTime: new Date().toISOString()
        };
        setProcessingLists(prev => new Map(prev.set(listName, processingList)));

        setTimeout(() => {
            setProcessingLists(prev => {
                const newMap = new Map(prev);
                newMap.delete(listName);
                return newMap;
            });
            setShowNotification(true);
            setNotificationMessage(`List "${listName}" has been processed successfully`);
            fetchData();
        }, 5000);
    };

    const handleListCreated = () => {
        fetchData();
    };

    const StatCard = ({ icon, title, value, trend, info }) => (
        <Paper sx={{
            p: 3,
            height: '100%',
            background: 'linear-gradient(135deg, #F3E8FF 0%, #FFFFFF 100%)',
            border: '1px solid #E9D8FD',
            borderRadius: 2,
            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
            '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }
        }}>
            <Box display="flex" alignItems="center" mb={2} justifyContent="space-between">
                <Box display="flex" alignItems="center">
                    <Box sx={{
                        bgcolor: '#6B46C1',
                        p: 1,
                        borderRadius: 1,
                        display: 'flex',
                        mr: 2
                    }}>
                        {React.cloneElement(icon, { sx: { fontSize: 20, color: '#fff' } })}
                    </Box>
                    <Typography variant="h6" sx={{ color: '#2D3748' }}>
                        {title}
                    </Typography>
                </Box>
                {info && (
                    <Tooltip title={info} arrow placement="top">
                        <IconButton size="small">
                            <Info sx={{ fontSize: 16, color: '#6B46C1' }} />
                        </IconButton>
                    </Tooltip>
                )}
            </Box>
            {isLoading ? (
                <Skeleton variant="text" width="60%" height={40} />
            ) : (
                <Box>
                    <Typography variant="h4" sx={{ color: '#6B46C1', fontWeight: 600 }}>
                        {value}
                    </Typography>
                    {trend && (
                        <Typography variant="body2" sx={{
                            color: trend >= 0 ? '#048527' : '#E53E3E',
                            display: 'flex',
                            alignItems: 'center',
                            mt: 1
                        }}>
                            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% from last week
                        </Typography>
                    )}
                </Box>
            )}
        </Paper>
    );

    const PortalHome = () => (
        <Box>
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

            <AddProspectsModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onListCreated={handleListCreated}
                onProspectsAdded={handleAddProspects}
                processingLists={processingLists}
                lists={lists}
            />

            <Box mb={6} display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                    <Typography variant="h4" gutterBottom sx={{ color: '#2D3748', fontWeight: 600 }}>
                        Hi, I'm Julie! 👋
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#4A5568' }}>
                        Welcome to your outreach portal. Here's an overview of your current activities.
                    </Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="body2" sx={{ color: '#718096' }}>
                        Last updated: {lastUpdated.toLocaleTimeString()}
                    </Typography>
                    <IconButton
                        onClick={handleRefresh}
                        disabled={isLoading}
                        sx={{
                            '&:hover': { bgcolor: '#F3E8FF' },
                            animation: isLoading ? 'spin 1s linear infinite' : 'none',
                            '@keyframes spin': {
                                '0%': { transform: 'rotate(0deg)' },
                                '100%': { transform: 'rotate(360deg)' }
                            }
                        }}
                    >
                        <Refresh />
                    </IconButton>
                </Box>
            </Box>

            <Grid container spacing={3} mb={6}>
                <Grid item xs={12} sm={6} md={4}>
                    <StatCard
                        icon={<People />}
                        title="Total Prospects"
                        value={stats.totalProspects.toLocaleString()}
                        trend={2.5}
                        info="Total number of prospects in your active campaigns"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <StatCard
                        icon={<Campaign />}
                        title="Active Campaigns"
                        value={stats.activeCampaigns.toString()}
                        info="Number of currently running outreach campaigns"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <StatCard
                        icon={<BarChart />}
                        title="Response Rate"
                        value={`${stats.responseRate}%`}
                        trend={-1.2}
                        info="Percentage of prospects who responded to your outreach"
                    />
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <Paper sx={{
                        p: 3,
                        borderRadius: 2,
                        border: '1px solid #E9D8FD',
                        height: '100%'
                    }}>
                        <Typography variant="h6" gutterBottom sx={{ color: '#2D3748', fontWeight: 600 }}>
                            Navigation
                        </Typography>
                        <Grid container spacing={2}>
                            {/* Lists Section */}
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" sx={{ color: '#4A5568', mb: 1, fontWeight: 600 }}>
                                    Lists Management
                                </Typography>
                                <Box display="flex" gap={2} flexWrap="wrap">
                                    <Link to="/outreach-portal/lists" style={{ textDecoration: 'none' }}>
                                        <Button
                                            variant="outlined"
                                            startIcon={<FormatListBulleted />}
                                            sx={{
                                                color: '#6B46C1',
                                                borderColor: '#E9D8FD',
                                                '&:hover': {
                                                    borderColor: '#6B46C1',
                                                    bgcolor: '#F3E8FF'
                                                }
                                            }}
                                        >
                                            View All Lists
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => setIsModalOpen(true)}
                                        sx={{
                                            color: '#6B46C1',
                                            borderColor: '#E9D8FD',
                                            '&:hover': {
                                                borderColor: '#6B46C1',
                                                bgcolor: '#F3E8FF'
                                            }
                                        }}
                                    >
                                        CREATE NEW LIST
                                    </Button>
                                </Box>
                            </Grid>

                            {/* Campaigns Section */}
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" sx={{ color: '#4A5568', mb: 1, fontWeight: 600 }}>
                                    Campaign Management
                                </Typography>
                                <Box display="flex" gap={2} flexWrap="wrap">
                                    <Link to="/outreach-portal/campaigns" style={{ textDecoration: 'none' }}>
                                        <Button
                                            variant="outlined"
                                            startIcon={<Campaign />}
                                            sx={{
                                                color: '#6B46C1',
                                                borderColor: '#E9D8FD',
                                                '&:hover': {
                                                    borderColor: '#6B46C1',
                                                    bgcolor: '#F3E8FF'
                                                }
                                            }}
                                        >
                                            View Campaigns
                                        </Button>
                                    </Link>
                                    <Link to="/outreach-portal/campaigns/new" style={{ textDecoration: 'none' }}>
                                        <Button
                                            variant="outlined"
                                            startIcon={<AddCircleOutline />}
                                            sx={{
                                                color: '#6B46C1',
                                                borderColor: '#E9D8FD',
                                                '&:hover': {
                                                    borderColor: '#6B46C1',
                                                    bgcolor: '#F3E8FF'
                                                }
                                            }}
                                        >
                                            Create Campaign
                                        </Button>
                                    </Link>
                                </Box>
                            </Grid>

                            {/* Analytics Section */}
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" sx={{ color: '#4A5568', mb: 1, fontWeight: 600 }}>
                                    Analytics & Reports
                                </Typography>
                                <Box display="flex" gap={2} flexWrap="wrap">
                                    <Link to="/outreach-portal/analytics" style={{ textDecoration: 'none' }}>
                                        <Button
                                            variant="outlined"
                                            startIcon={<Assessment />}
                                            sx={{
                                                color: '#6B46C1',
                                                borderColor: '#E9D8FD',
                                                '&:hover': {
                                                    borderColor: '#6B46C1',
                                                    bgcolor: '#F3E8FF'
                                                }
                                            }}
                                        >
                                            View Analytics
                                        </Button>
                                    </Link>
                                    <Link to="/outreach-portal/settings" style={{ textDecoration: 'none' }}>
                                        <Button
                                            variant="outlined"
                                            startIcon={<Settings />}
                                            sx={{
                                                color: '#6B46C1',
                                                borderColor: '#E9D8FD',
                                                '&:hover': {
                                                    borderColor: '#6B46C1',
                                                    bgcolor: '#F3E8FF'
                                                }
                                            }}
                                        >
                                            Settings
                                        </Button>
                                    </Link>
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Paper sx={{
                        p: 3,
                        borderRadius: 2,
                        border: '1px solid #E9D8FD',
                        height: '100%'
                    }}>
                        <Typography variant="h6" gutterBottom sx={{ color: '#2D3748', fontWeight: 600 }}>
                            Recent Activity
                        </Typography>
                        {isLoading ? (
                            <Box sx={{ mt: 2 }}>
                                <Skeleton variant="text" width="100%" height={30} />
                                <Skeleton variant="text" width="80%" height={30} />
                                <Skeleton variant="text" width="90%" height={30} />
                            </Box>
                        ) : (
                            <Typography sx={{ color: '#4A5568' }}>
                                No recent activity to show.
                            </Typography>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );

    return location.pathname === '/outreach-portal' ? <PortalHome /> : <Outlet />;
};

export default OutreachPortal;