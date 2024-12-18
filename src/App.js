import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import OutreachPortal from './components/OutreachPortal';
import CampaignDetails from './components/CampaignDetails';
import DashboardLayout from './components/DashboardLayout';
import SignIn from './components/Auth/SignIn';
import SignUp from './components/Auth/SignUp';
import './App.css';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  console.log(token);

  // Check if token exists and is not "undefined"
  if (!token || token === "undefined" || token === "null") {
    localStorage.removeItem('token'); // Clean up invalid token
    return <Navigate to="/signin" />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }>
          <Route path="/" element={<Dashboard />} />
          <Route path="/outreach-portal" element={<OutreachPortal />} />
          <Route path="/outreach-portal/campaign/:id" element={<CampaignDetails />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;