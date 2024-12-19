import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Mail,
    PenTool,
    Headphones,
    MessageSquare,
    Users,
    BarChart3,
    TrendingUp,
    Calendar,
    Linkedin,
    ArrowUp,
    ArrowDown,
    Activity,
    Target,
    UserCheck,
    Clock,
    DollarSign,
    Heart,
    Star,
    TrendingDown
} from 'lucide-react';

const Dashboard = () => {
    const navigate = useNavigate();

    // Original agents array
    const agents = [
        {
            name: 'Julie',
            role: 'Sales Outreach Agent',
            description: 'Cold emails, calls, and direct messages',
            icon: <Mail className="w-6 h-6" />,
            path: '/outreach-portal',
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
        navigate(path);
    };

    // Add business metrics data
    const businessMetrics = {
        revenue: {
            total: '1.2M',
            trend: 15.4,
            timeframe: 'vs last month'
        },
        outreach: {
            prospects: 12458,
            meetings: 186,
            responses: 2341,
            conversion: 3.2,
            trend: 12.5
        },
        marketing: {
            websiteVisits: '45.2K',
            leads: 876,
            conversion: 4.8,
            trend: 8.3
        },
        customerSuccess: {
            activeClients: 234,
            satisfaction: 98,
            churnRate: 0.8,
            trend: -0.5
        }
    };

    const MetricCard = ({ title, value, trend, timeframe, icon: Icon, color = 'blue' }) => (
        <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <span className="text-gray-500 text-sm">{title}</span>
                <div className={`p-2 bg-${color}-50 text-${color}-600 rounded-lg`}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
            <div className="flex items-end justify-between">
                <div>
                    <div className="text-2xl font-semibold mb-1">{value}</div>
                    <div className="text-sm text-gray-500">{timeframe}</div>
                </div>
                {trend && (
                    <div className={`flex items-center ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {trend > 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                        <span className="font-medium">{Math.abs(trend)}%</span>
                    </div>
                )}
            </div>
        </div>
    );

    const DepartmentSection = ({ title, metrics, icon: Icon, color }) => (
        <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
                <div className={`p-2 bg-${color}-50 text-${color}-600 rounded-lg`}>
                    <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold">{title}</h3>
            </div>
            <div className="space-y-4">
                {Object.entries(metrics).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center">
                        <span className="text-gray-600 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <span className="font-medium">
                            {typeof value === 'number' ?
                                value % 1 === 0 ? value.toLocaleString() : `${value}%`
                                : value}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* AI Agents Section */}
            <div className="mb-12">
                <h1 className="text-3xl font-bold mb-2">AI Agents</h1>
                <p className="text-gray-600 mb-6">Select an agent to access their portal</p>

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

            {/* Business Overview Section */}
            <div>
                <h2 className="text-2xl font-bold mb-6">Business Overview</h2>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <MetricCard
                        title="Revenue"
                        value={`$${businessMetrics.revenue.total}`}
                        trend={businessMetrics.revenue.trend}
                        timeframe="vs last month"
                        icon={DollarSign}
                        color="emerald"
                    />
                    <MetricCard
                        title="Active Clients"
                        value={businessMetrics.customerSuccess.activeClients}
                        trend={8.2}
                        timeframe="vs last month"
                        icon={Users}
                        color="blue"
                    />
                    <MetricCard
                        title="Customer Satisfaction"
                        value={`${businessMetrics.customerSuccess.satisfaction}%`}
                        trend={2.1}
                        timeframe="vs last month"
                        icon={Heart}
                        color="rose"
                    />
                    <MetricCard
                        title="Churn Rate"
                        value={`${businessMetrics.customerSuccess.churnRate}%`}
                        trend={-0.3}
                        timeframe="vs last month"
                        icon={TrendingDown}
                        color="orange"
                    />
                </div>

                {/* Department Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <DepartmentSection
                        title="Outreach Performance"
                        metrics={businessMetrics.outreach}
                        icon={Mail}
                        color="blue"
                    />
                    <DepartmentSection
                        title="Marketing Performance"
                        metrics={businessMetrics.marketing}
                        icon={Target}
                        color="purple"
                    />
                    <DepartmentSection
                        title="Customer Success"
                        metrics={businessMetrics.customerSuccess}
                        icon={Star}
                        color="amber"
                    />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;