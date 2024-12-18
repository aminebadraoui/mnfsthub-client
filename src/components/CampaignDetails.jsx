import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, Linkedin, Phone, User, MessageSquare, Calendar, Clock, X, Plus } from 'lucide-react';
import CSVUploader from './CSVUploader';
import ListModal from './ListModal';

const CampaignDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [selectedChannel, setSelectedChannel] = useState('all');
    const [selectedProspect, setSelectedProspect] = useState(null);
    const [isListModalOpen, setIsListModalOpen] = useState(false);

    // Sample data - would typically come from an API
    const campaign = {
        id: 1,
        name: 'Q4 Tech Outreach',
        status: 'active',
        startDate: '2024-12-01',
        endDate: '2024-12-31',
        progress: 45,
        channels: {
            email: {
                sent: 250,
                opened: 180,
                replied: 45,
                meetings: 8
            },
            linkedin: {
                sent: 150,
                accepted: 89,
                responded: 34,
                meetings: 4
            },
            phone: {
                calls: 50,
                connected: 25,
                meetings: 6
            }
        },
        prospects: [
            {
                id: 1,
                name: 'John Smith',
                title: 'CTO',
                company: 'Tech Corp',
                touchpoints: [
                    {
                        channel: 'email',
                        type: 'sent',
                        date: '2024-03-15T10:00:00',
                        content: 'Initial outreach email sent'
                    },
                    {
                        channel: 'email',
                        type: 'replied',
                        date: '2024-03-16T14:30:00',
                        content: 'Showed interest in product demo'
                    },
                    {
                        channel: 'linkedin',
                        type: 'connected',
                        date: '2024-03-17T09:00:00',
                        content: 'Connection accepted'
                    },
                    {
                        channel: 'phone',
                        type: 'call',
                        date: '2024-03-18T11:00:00',
                        content: 'Discovery call completed'
                    }
                ]
            },
            // Add more prospects...
        ]
    };

    const channelIcons = {
        email: <Mail className="w-5 h-5" />,
        linkedin: <Linkedin className="w-5 h-5" />,
        phone: <Phone className="w-5 h-5" />,
        all: <MessageSquare className="w-5 h-5" />
    };

    const ProspectDetails = ({ prospect }) => (
        <div className="fixed inset-y-0 right-0 w-[400px] bg-white shadow-lg border-l p-6 overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-xl font-semibold">{prospect.name}</h3>
                    <p className="text-sm text-gray-600">{prospect.title} at {prospect.company}</p>
                </div>
                <button
                    onClick={() => setSelectedProspect(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="space-y-6">
                <h4 className="font-medium">Interaction Timeline</h4>
                <div className="space-y-4">
                    {prospect.touchpoints.sort((a, b) => new Date(b.date) - new Date(a.date)).map((touchpoint, idx) => (
                        <div key={idx} className="flex gap-4">
                            <div className="flex-shrink-0">
                                {channelIcons[touchpoint.channel]}
                            </div>
                            <div>
                                <p className="font-medium">{touchpoint.content}</p>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Clock className="w-4 h-4" />
                                    {new Date(touchpoint.date).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const handleCSVUpload = (prospects) => {
        console.log('Uploaded prospects:', prospects);
        // Here you would typically:
        // 1. Process the prospects data
        // 2. Update the campaign with new prospects
        // 3. Show a success message
    };

    const handleListSave = (listData) => {
        console.log('List data:', listData);
        // Here you would:
        // 1. If it's a new list, create it
        // 2. Add the prospects to the list
        // 3. Update the campaign's prospects
    };

    const ProspectsSection = () => (
        <div className="bg-white rounded-lg shadow-sm mb-8">
            <div className="p-6 border-b flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-semibold">Prospects</h2>
                    <p className="text-sm text-gray-600 mt-1">
                        Manage prospect lists for this campaign
                    </p>
                </div>
                <button
                    onClick={() => setIsListModalOpen(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Add Prospects
                </button>
            </div>
            <div className="divide-y">
                {campaign.prospects.map(prospect => (
                    <div
                        key={prospect.id}
                        className="p-4 hover:bg-gray-50 cursor-pointer"
                        onClick={() => setSelectedProspect(prospect)}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-medium">{prospect.name}</h3>
                                <p className="text-sm text-gray-600">
                                    {prospect.title} • {prospect.company}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                {[...new Set(prospect.touchpoints.map(t => t.channel))].map(channel => (
                                    <div key={channel} className="text-gray-600">
                                        {channelIcons[channel]}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/outreach-portal')}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <h1 className="text-xl font-semibold">{campaign.name}</h1>
                        </div>
                        <div className="flex gap-2">
                            {Object.entries(channelIcons).map(([channel, icon]) => (
                                <button
                                    key={channel}
                                    onClick={() => setSelectedChannel(channel)}
                                    className={`p-2 rounded-lg flex items-center gap-2 ${selectedChannel === channel
                                        ? 'bg-blue-50 text-blue-600'
                                        : 'hover:bg-gray-100'
                                        }`}
                                >
                                    {icon}
                                    <span className="capitalize">{channel}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Channel-specific metrics */}
                <div className="grid grid-cols-4 gap-6 mb-8">
                    {selectedChannel === 'all' ? (
                        Object.entries(campaign.channels).map(([channel, metrics]) => (
                            <div key={channel} className="bg-white p-6 rounded-lg shadow-sm">
                                <div className="flex items-center gap-2 mb-4">
                                    {channelIcons[channel]}
                                    <span className="font-medium capitalize">{channel}</span>
                                </div>
                                {Object.entries(metrics).map(([metric, value]) => (
                                    <div key={metric} className="mt-2">
                                        <div className="text-sm text-gray-600 capitalize">{metric}</div>
                                        <div className="font-semibold">{value}</div>
                                    </div>
                                ))}
                            </div>
                        ))
                    ) : (
                        Object.entries(campaign.channels[selectedChannel]).map(([metric, value]) => (
                            <div key={metric} className="bg-white p-6 rounded-lg shadow-sm">
                                <div className="text-sm text-gray-600 capitalize">{metric}</div>
                                <div className="text-2xl font-semibold">{value}</div>
                            </div>
                        ))
                    )}
                </div>

                <ProspectsSection />

                <ListModal
                    isOpen={isListModalOpen}
                    onClose={() => setIsListModalOpen(false)}
                    onSave={handleListSave}
                />
            </div>

            {/* Prospect Details Sidebar */}
            {selectedProspect && <ProspectDetails prospect={selectedProspect} />}
        </div>
    );
};

export default CampaignDetails; 