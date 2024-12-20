import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import Navigation from './Navigation/Navigation';

const DashboardLayout = () => {
    return (
        <Box>
            <Navigation />
            <Container maxWidth="lg">
                <Outlet />
            </Container>
        </Box>
    );
};

export default DashboardLayout; 