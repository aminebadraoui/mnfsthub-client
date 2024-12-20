import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();

    const agents = [
        {
            name: "Julie",
            role: "Sales Outreach Agent",
            description: "Cold emails, calls, and direct messages",
            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
            path: "/outreach-portal",
            bgColor: '#F3E8FF'
        },
        {
            name: "Sophie",
            role: "Marketing Agent",
            description: "Marketing content and SEO strategy",
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
            path: "/marketing-portal",
            bgColor: '#FDF2F8'
        },
        {
            name: "Lucas",
            role: "Sales Coach Agent",
            description: "Call analysis and feedback",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
            path: "/sales-portal",
            bgColor: '#F0FFF4'
        },
        {
            name: "Alex",
            role: "Client Experience Agent",
            description: "Customer support and assistance",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
            path: "/cx-portal",
            bgColor: '#FFF5F5'
        }
    ];

    return (
        <Box>
            <Box mb={4}>
                <Typography variant="h4" gutterBottom sx={{ color: '#2D3748', fontWeight: 700 }}>
                    AI Agents
                </Typography>
                <Typography variant="body1" sx={{ color: '#4A5568' }}>
                    Select an agent to access their portal
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {agents.map((agent) => (
                    <Grid item xs={12} sm={6} key={agent.name}>
                        <Paper
                            onClick={() => navigate(agent.path)}
                            sx={{
                                p: 3,
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: 3,
                                cursor: 'pointer',
                                bgcolor: agent.bgColor,
                                border: '1px solid',
                                borderColor: 'rgba(0, 0, 0, 0.05)',
                                borderRadius: 2,
                                transition: 'transform 0.2s ease-in-out',
                                '&:hover': {
                                    transform: 'translateY(-4px)'
                                }
                            }}
                        >
                            <Box
                                component="img"
                                src={agent.image}
                                alt={agent.name}
                                sx={{
                                    width: 120,
                                    height: 120,
                                    borderRadius: '8px',
                                    objectFit: 'cover'
                                }}
                            />
                            <Box>
                                <Typography variant="h5" gutterBottom sx={{ color: '#2D3748', fontWeight: 600 }}>
                                    {agent.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    {agent.role}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    {agent.description}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: '#6B46C1',
                                        display: 'flex',
                                        alignItems: 'center',
                                        mt: 1,
                                        fontWeight: 500
                                    }}
                                >
                                    Click to access portal →
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            <Box mt={6}>
                <Typography variant="h4" gutterBottom sx={{ color: '#2D3748', fontWeight: 700 }}>
                    Business Overview
                </Typography>
            </Box>
        </Box>
    );
};

export default Dashboard;