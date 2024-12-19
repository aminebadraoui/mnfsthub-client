import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Box, Tabs, Tab, Container } from '@mui/material';

export default function Navigation() {
    const location = useLocation();
    const currentPath = location.pathname;

    return (
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Container maxWidth="md">
                <Tabs value={currentPath} aria-label="navigation tabs">
                    <Tab
                        label="Lists"
                        value="/lists"
                        component={Link}
                        to="/lists"
                    />
                    <Tab
                        label="Campaigns"
                        value="/campaigns"
                        component={Link}
                        to="/campaigns"
                    />
                </Tabs>
            </Container>
        </Box>
    );
} 