import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Home,
    BarChart2,
    Settings,
    HelpCircle,
    Menu,
    Mail,
    PenTool,
    Headphones,
    MessageSquare
} from 'lucide-react';

const Dashboard = () => {
    const navigate = useNavigate();

    const agents = [
        {
            name: 'Julie',
            role: 'Sales Outreach Agent',
            description: 'Cold emails, calls, and direct messages',
            icon: <Mail className="w-6 h-6" />,
            path: '/agents/julie',
            color: 'bg-blue-50',
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80'
        },
        {
            name: 'Sophie',
            role: 'Marketing Agent',
            description: 'Marketing content and SEO strategy',
            icon: <PenTool className="w-6 h-6" />,
            path: '/agents/sophie',
            color: 'bg-purple-50',
            image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80'
        },
        {
            name: 'Lucas',
            role: 'Sales Coach Agent',
            description: 'Call analysis and feedback',
            icon: <Headphones className="w-6 h-6" />,
            path: '/agents/lucas',
            color: 'bg-green-50',
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80'
        },
        {
            name: 'Alex',
            role: 'Client Experience Agent',
            description: 'Customer support and assistance',
            icon: <MessageSquare className="w-6 h-6" />,
            path: '/agents/alex',
            color: 'bg-orange-50',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80'
        }
    ];

    const handleAgentClick = (path) => {
        if (path === '/agents/julie') {
            navigate('/outreach-portal');
        } else {
            console.log(`Navigation to ${path} not implemented yet`);
        }
    };

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">AI Agents</h1>
                <p className="text-gray-600">Select an agent to access their portal</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {agents.map((agent) => (
                    <div
                        key={agent.name}
                        onClick={() => handleAgentClick(agent.path)}
                        className={`${agent.color} rounded-lg p-6 shadow-sm hover:shadow-xl transition-all cursor-pointer transform hover:-translate-y-1`}
                    >
                        <div className="flex items-start gap-6">
                            <img
                                src={agent.image}
                                alt={agent.name}
                                className="w-48 h-48 rounded-lg object-cover shadow-md"
                            />
                            <div className="flex flex-col flex-1">
                                <div className="mb-3">
                                    <h2 className="text-2xl font-bold">{agent.name}</h2>
                                    <p className="text-sm text-gray-600">{agent.role}</p>
                                </div>
                                <p className="text-gray-700 mb-4">{agent.description}</p>
                                <div className="mt-auto">
                                    <span className="text-sm font-medium text-gray-500">Click to access portal →</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;