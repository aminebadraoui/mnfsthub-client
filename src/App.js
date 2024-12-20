import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './components/Auth/SignIn';
import SignUp from './components/Auth/SignUp';
import Dashboard from './components/Dashboard';
import Lists from './components/Lists/Lists';
import Campaigns from './components/Campaigns/Campaigns';
import KnowledgeBase from './components/KnowledgeBase';
import OutreachPortal from './components/OutreachPortal';
import CampaignDetails from './components/CampaignDetails';
import ContactsTable from './components/Lists/ContactsTable';
import { Box, Container } from '@mui/material';
import Navigation from './components/Navigation/Navigation';

const DRAWER_WIDTH = 240;

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const tenantId = localStorage.getItem('tenantId');

  if (!token || !tenantId) {
    return <Navigate to="/signin" replace />;
  }

  return children;
};

const MainLayout = ({ children }) => (
  <Box sx={{
    display: 'flex',
    minHeight: '100vh',
    bgcolor: '#fff'
  }}>
    <Navigation />
    <Box
      component="main"
      sx={{
        width: `100%`,
        display: 'flex',
        flexDirection: 'column',
        p: '32px'
      }}
    >
      {children}
    </Box>
  </Box>
);

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/*" element={
          <ProtectedRoute>
            <MainLayout>
              <Routes>
                <Route index element={<Dashboard />} />
                <Route path="outreach-portal" element={<OutreachPortal />} />
                <Route path="outreach-portal/lists/*" element={<Lists />} />
                <Route path="outreach-portal/lists/:listId" element={<ContactsTable />} />
                <Route path="outreach-portal/campaigns/*" element={<Campaigns />} />
                <Route path="outreach-portal/campaigns/:id" element={<CampaignDetails />} />
                <Route path="marketing-portal" element={<div>Marketing Portal</div>} />
                <Route path="sales-portal" element={<div>Sales Portal</div>} />
                <Route path="cx-portal" element={<div>Customer Experience Portal</div>} />
                <Route path="knowledge-base" element={<KnowledgeBase />} />
                <Route path="profile" element={<div>Profile</div>} />
                <Route path="logout" element={<Navigate to="/signin" replace />} />
              </Routes>
            </MainLayout>
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
};

export default App;