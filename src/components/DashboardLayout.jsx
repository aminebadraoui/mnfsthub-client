import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutGrid, Users, Settings, LogOut, BookOpen } from 'lucide-react';
import { logout } from '../services/authService';

const DashboardLayout = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        {
            name: 'Dashboard',
            icon: <LayoutGrid className="w-5 h-5" />,
            path: '/'
        },
        {
            name: 'Outreach Portal',
            icon: <Users className="w-5 h-5" />,
            path: '/outreach-portal'
        },
        {
            name: 'Add Knowledge Base',
            icon: <BookOpen className="w-5 h-5" />,
            path: '/knowledge-base'
        },
        {
            name: 'Settings',
            icon: <Settings className="w-5 h-5" />,
            path: '/settings'
        }
    ];

    const handleLogout = () => {
        logout();
        navigate('/signin');
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <div className="w-64 bg-white border-r border-gray-200">
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="p-6 border-b border-gray-200">
                        <h1 className="text-xl font-bold">MNFST Hub</h1>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4">
                        <ul className="space-y-1">
                            {menuItems.map((item) => (
                                <li key={item.name}>
                                    <button
                                        onClick={() => navigate(item.path)}
                                        className={`w-full flex items-center px-4 py-2 text-sm rounded-lg ${location.pathname === item.path
                                            ? 'bg-gray-100 text-gray-900'
                                            : 'text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        {item.icon}
                                        <span className="ml-3">{item.name}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Logout Button */}
                    <div className="p-4 border-t border-gray-200">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="ml-3">Logout</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                {children}
            </div>
        </div>
    );
};

export default DashboardLayout; 