import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../../stores/authStore';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuthStore();

    // Initialize auth state if not already done
    React.useEffect(() => {
        useAuthStore.getState().init();
    }, []);

    if (loading) {
        // You can replace this with a loading spinner component
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/signin" />;
    }

    return children;
};

export default ProtectedRoute; 