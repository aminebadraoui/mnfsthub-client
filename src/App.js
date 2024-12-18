import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './components/Auth/SignIn';
import SignUp from './components/Auth/SignUp';
import Dashboard from './components/Dashboard';
import OutreachPortal from './components/OutreachPortal';
import DashboardLayout from './components/DashboardLayout';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const tenantId = localStorage.getItem('tenantId');

  if (!token || !tenantId) {
    return <Navigate to="/signin" replace />;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/outreach-portal/*"
          element={
            <ProtectedRoute>
              <OutreachPortal />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;