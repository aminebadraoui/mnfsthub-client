import React, { useState } from 'react';
import {
    Mail,
    Phone,
    Linkedin,
    Instagram,
    Facebook,
    Calendar,
    Search,
    ArrowRight,
    Plus,
    X,
    MinusCircle,
    Target,
    MessageSquare,
    BarChart2,
    PlayCircle,
    PauseCircle,
    Settings,
    MoreVertical,
    ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ... (previous imports and initial states remain the same)

const OutreachPortal = () => {
    // ... (previous states remain the same)
    const [showCampaignCreator, setShowCampaignCreator] = useState(false);
    const [isSlideOverMinimized, setIsSlideOverMinimized] = useState(false);
    const [selectedChannel, setSelectedChannel] = useState('all');
    const [creationStep, setCreationStep] = useState(1);
    const [campaignData, setCampaignData] = useState({
        name: '',
        intention: '',
        startDate: '',
        endDate: '',
        selectedChannels: [],
        lists: {},
        filters: []
    });

    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [showCampaignDetails, setShowCampaignDetails] = useState(false);

    const navigate = useNavigate();

    // Sample campaigns data
    const campaigns = [
        {
            id: 1,
            name: 'Q4 Tech Outreach',
            status: 'active',
            startDate: '2024-12-01',
            endDate: '2024-12-31',
            progress: 45,
            channels: ['email', 'linkedin'],
            metrics: {
                sent: 450,
                responses: 123,
                meetings: 12
            }
        },
        {
            id: 2,
            name: 'Healthcare Decision Makers',
            status: 'paused',
            startDate: '2024-12-10',
            endDate: '2025-01-10',
            progress: 25,
            channels: ['email', 'phone'],
            metrics: {
                sent: 280,
                responses: 85,
                meetings: 8
            }
        },
        // Add more sample campaigns...
    ];

    const handleCampaignClick = (campaign) => {
        navigate(`/outreach-portal/campaign/${campaign.id}`);
    };

    const CampaignsList = () => (
        <div className="bg-white rounded-lg mb-8">
            <div className="p-4 border-b flex items-center justify-between">
                <h2 className="text-lg font-semibold">Active Campaigns</h2>
                <button
                    onClick={() => setShowCampaignCreator(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    New Campaign
                </button>
            </div>
            <div className="divide-y">
                {campaigns.map((campaign) => (
                    <div
                        key={campaign.id}
                        className="p-4 hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleCampaignClick(campaign)}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <h3 className="font-medium">{campaign.name}</h3>
                                <span className={`px-2 py-1 rounded-full text-xs ${campaign.status === 'active'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-gray-100 text-gray-700'
                                    }`}>
                                    {campaign.status}
                                </span>
                            </div>
                            <div className="flex items-center gap-4">
                                <button className="p-2 hover:bg-gray-100 rounded-lg">
                                    {campaign.status === 'active' ?
                                        <PauseCircle className="w-5 h-5 text-gray-600" /> :
                                        <PlayCircle className="w-5 h-5 text-gray-600" />
                                    }
                                </button>
                                <button className="p-2 hover:bg-gray-100 rounded-lg">
                                    <Settings className="w-5 h-5 text-gray-600" />
                                </button>
                                <button className="p-2 hover:bg-gray-100 rounded-lg">
                                    <MoreVertical className="w-5 h-5 text-gray-600" />
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-6">
                                <span className="text-gray-600">
                                    {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                                </span>
                                <div className="flex items-center gap-2">
                                    {campaign.channels.map(channel => {
                                        const ChannelIcon = {
                                            email: Mail,
                                            linkedin: Linkedin,
                                            phone: Phone
                                        }[channel];
                                        return <ChannelIcon key={channel} className="w-4 h-4 text-gray-600" />;
                                    })}
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <span className="text-gray-600">{campaign.metrics.sent} sent</span>
                                <span className="text-gray-600">{campaign.metrics.responses} responses</span>
                                <span className="text-gray-600">{campaign.metrics.meetings} meetings</span>
                            </div>
                        </div>
                        <div className="mt-3">
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-600 rounded-full"
                                    style={{ width: `${campaign.progress}%` }}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Main Dashboard */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/')}
                            className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <h1 className="text-xl font-semibold">Julie's Outreach Dashboard</h1>
                    </div>
                </div>
            </div>

            {/* Dashboard Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                <CampaignsList />

                {/* Rest of the dashboard content */}
                {/* ... (previous prospect list code remains the same) */}
            </div>

            {/* Campaign Creation Slide-over */}
            {/* ... (previous campaign creation code remains the same) */}
        </div>
    );
};

export default OutreachPortal;