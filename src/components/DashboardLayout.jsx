import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Settings,
    LogOut
} from 'lucide-react';

const DashboardLayout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/signin');
    };

    const menuItems = [
        {
            icon: <LayoutDashboard className="w-6 h-6" />,
            label: 'Dashboard',
            path: '/'
        },
        {
            icon: <Users className="w-6 h-6" />,
            label: 'Outreach Portal',
            path: '/outreach-portal'
        },
        {
            icon: <Settings className="w-6 h-6" />,
            label: 'Settings',
            path: '/settings'
        }
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-white shadow-sm">
                <div className="flex flex-col h-full">
                    {/* Logo area */}
                    <div className="p-4 border-b">
                        <h1 className="text-xl font-bold">MNFST Hub</h1>
                    </div>

                    {/* Menu items */}
                    <nav className="flex-1 p-4">
                        <ul className="space-y-1">
                            {menuItems.map((item, index) => (
                                <li key={index}>
                                    <button
                                        onClick={() => navigate(item.path)}
                                        className="flex items-center w-full px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100"
                                    >
                                        {item.icon}
                                        <span className="ml-3">{item.label}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Logout button at bottom */}
                    <div className="p-4 border-t">
                        <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-4 py-2 text-red-600 rounded-lg hover:bg-red-50"
                        >
                            <LogOut className="w-6 h-6" />
                            <span className="ml-3">Logout</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="flex-1 overflow-auto">
                <Outlet />
            </div>
        </div>
    );
};

export default DashboardLayout; 