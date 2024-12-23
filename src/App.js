import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { ChakraProvider, Box, Flex, Spinner, Center } from '@chakra-ui/react';
import theme from './theme';
import SignIn from './components/Auth/SignIn';
import SignUp from './components/Auth/SignUp';
import Dashboard from './components/dashboard/Dashboard';
import Navigation from './components/layout/Navigation/Navigation';
import OutreachPortal from './components/OutreachPortal';
import ProtectedRoute from './components/common/ProtectedRoute';
import useAuthStore from './stores/authStore';
import Profile from './components/Profile/Profile';
import WorkflowTracker from './components/Workflows/WorkflowTracker';

const DRAWER_WIDTH = '240px';

const DashboardLayout = () => {
  return (
    <Flex h="100vh" overflow="hidden">
      {/* Sidebar */}
      <Box w={DRAWER_WIDTH} h="100vh" position="fixed" top="0" left="0">
        <Navigation />
      </Box>

      {/* Main Content */}
      <Box
        ml={DRAWER_WIDTH}
        w={`calc(100% - ${DRAWER_WIDTH})`}
        h="100vh"
        overflow="auto"
        bg="gray.50"
        _dark={{ bg: 'gray.900' }}
        p={6}
      >
        <Outlet />
      </Box>
    </Flex>
  );
};

const LoadingScreen = () => (
  <Center h="100vh">
    <Spinner size="xl" color="purple.500" thickness="4px" />
  </Center>
);

function App() {
  const { init, loading } = useAuthStore();

  useEffect(() => {
    init();
  }, [init]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Protected Routes with Layout */}
          <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route path="/" element={<Dashboard />} />
            <Route path="outreach-portal/*" element={<OutreachPortal />} />
            <Route path="marketing-portal" element={<Box>Marketing Portal (Coming Soon)</Box>} />
            <Route path="sales-portal" element={<Box>Sales Portal (Coming Soon)</Box>} />
            <Route path="cx-portal" element={<Box>Customer Experience Portal (Coming Soon)</Box>} />
            <Route path="knowledge-base" element={<Box>Knowledge Base (Coming Soon)</Box>} />
            <Route path="workflows" element={<WorkflowTracker />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;