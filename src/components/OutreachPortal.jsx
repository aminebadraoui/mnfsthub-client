import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Box, Typography, Paper, Grid, Button } from '@mui/material';
import { BarChart, People, Campaign } from '@mui/icons-material';

const OutreachPortal = () => {
    const location = useLocation();

    const StatCard = ({ icon, title, value }) => (
        <Paper sx={{
            p: 3,
            height: '100%',
            background: 'linear-gradient(135deg, #F3E8FF 0%, #FFFFFF 100%)',
            border: '1px solid #E9D8FD',
            borderRadius: 2
        }}>
            <Box display="flex" alignItems="center" mb={2}>
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
            <Typography variant="h4" sx={{ color: '#6B46C1', fontWeight: 600 }}>
                {value}
            </Typography>
        </Paper>
    );

    const PortalHome = () => (
        <Box>
            <Box mb={6}>
                <Typography variant="h4" gutterBottom sx={{ color: '#2D3748', fontWeight: 600 }}>
                    Hi, I'm Julie! 👋
                </Typography>
                <Typography variant="body1" sx={{ color: '#4A5568' }}>
                    Welcome to your outreach portal. Here's an overview of your current activities.
                </Typography>
            </Box>

            <Grid container spacing={3} mb={6}>
                <Grid item xs={12} sm={6} md={4}>
                    <StatCard
                        icon={<People />}
                        title="Total Prospects"
                        value="1,234"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <StatCard
                        icon={<Campaign />}
                        title="Active Campaigns"
                        value="3"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <StatCard
                        icon={<BarChart />}
                        title="Response Rate"
                        value="24%"
                    />
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <Paper sx={{
                        p: 3,
                        borderRadius: 2,
                        border: '1px solid #E9D8FD'
                    }}>
                        <Typography variant="h6" gutterBottom sx={{ color: '#2D3748', fontWeight: 600 }}>
                            Quick Actions
                        </Typography>
                        <Box display="flex" gap={2}>
                            <Link to="/outreach-portal/lists" style={{ textDecoration: 'none' }}>
                                <Button
                                    variant="contained"
                                    sx={{
                                        bgcolor: '#6B46C1',
                                        '&:hover': {
                                            bgcolor: '#553C9A'
                                        }
                                    }}
                                >
                                    View Lists
                                </Button>
                            </Link>
                            <Link to="/outreach-portal/campaigns" style={{ textDecoration: 'none' }}>
                                <Button
                                    variant="contained"
                                    sx={{
                                        bgcolor: '#6B46C1',
                                        '&:hover': {
                                            bgcolor: '#553C9A'
                                        }
                                    }}
                                >
                                    View Campaigns
                                </Button>
                            </Link>
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Paper sx={{
                        p: 3,
                        borderRadius: 2,
                        border: '1px solid #E9D8FD'
                    }}>
                        <Typography variant="h6" gutterBottom sx={{ color: '#2D3748', fontWeight: 600 }}>
                            Recent Activity
                        </Typography>
                        <Typography sx={{ color: '#4A5568' }}>
                            No recent activity to show.
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );

    return location.pathname === '/outreach-portal' ? <PortalHome /> : <Outlet />;
};

export default OutreachPortal;