import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ListPlus, Activity, Clock, List, UserPlus } from 'lucide-react';
import ListModal from './ListModal';
import ListsModal from './ListsModal';
import CampaignModal from './CampaignModal';
import {
    getLists,
    uploadToN8N,
    addProspectsToList,
    getCampaigns,
    createCampaign,
    deactivateCampaign,
    activateCampaign,
    removeCampaign
} from '../services/n8nService';

const JULIE_IMAGE = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80';

const EmptyState = ({ title, description }) => (
    <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
        <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
            <Activity className="w-full h-full" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-500">{description}</p>
    </div>
);

const LoadingCampaignCard = () => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="flex gap-2">
            <div className="h-6 bg-gray-200 rounded-full w-16"></div>
            <div className="h-6 bg-gray-200 rounded-full w-20"></div>
            <div className="h-6 bg-gray-200 rounded-full w-24"></div>
        </div>
    </div>
);

const LoadingCampaignsSection = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <LoadingCampaignCard />
        <LoadingCampaignCard />
        <LoadingCampaignCard />
    </div>
);

const OutreachPortal = () => {
    const navigate = useNavigate();
    const [isListModalOpen, setIsListModalOpen] = useState(false);
    const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
    const [lists, setLists] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isListsModalOpen, setIsListsModalOpen] = useState(false);
    const [isAddProspectsModalOpen, setIsAddProspectsModalOpen] = useState(false);
    const [selectedList, setSelectedList] = useState(null);
    const [isMounted, setIsMounted] = useState(true);
    const [campaigns, setCampaigns] = useState({ active: [], inactive: [] });

    useEffect(() => {
        setIsMounted(true);
        fetchData();
        return () => setIsMounted(false);
    }, []);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            console.log('Starting data fetch...');

            const listsData = await getLists();
            console.log('Lists data received:', listsData);
            setLists(listsData);

            const campaignsData = await getCampaigns();
            console.log('Campaigns data received:', campaignsData);

            // Process campaigns data - it's directly an array
            if (Array.isArray(campaignsData)) {
                // Set campaigns state based on Active property
                setCampaigns({
                    active: campaignsData.filter(campaign => campaign.Active === true),
                    inactive: campaignsData.filter(campaign => campaign.Active === false)
                });
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Failed to fetch data');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateCampaign = async (campaignData) => {
        try {
            await createCampaign(campaignData);
            await fetchData(); // Refresh data
            setIsCampaignModalOpen(false);
        } catch (error) {
            console.error('Error creating campaign:', error);
        }
    };

    const handleDeactivateCampaign = async (campaignId) => {
        try {
            await deactivateCampaign(campaignId);
            await fetchData(); // Refresh data
        } catch (error) {
            console.error('Error deactivating campaign:', error);
        }
    };

    const handleActivateCampaign = async (campaignId) => {
        try {
            await activateCampaign(campaignId);
            await fetchData(); // Refresh data
        } catch (error) {
            console.error('Error activating campaign:', error);
        }
    };

    const CampaignCard = ({ campaign }) => (
        <div
            onClick={() => navigate(`/outreach-portal/campaign/${campaign.id}`)}
            className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-200"
        >
            <h3 className="text-lg font-semibold text-gray-900">{campaign.Name}</h3>
            <p className="text-sm text-gray-500 mt-2">List: {campaign.List}</p>
            <div className="mt-4 flex flex-wrap gap-2">
                {Object.entries({
                    Email: campaign.Email,
                    Phone: campaign.Phone,
                    LinkedIn: campaign.Linkedin,
                    Facebook: campaign.Facebook,
                    Instagram: campaign.Instagram,
                    Twitter: campaign.Twitter
                })
                    .filter(([_, enabled]) => enabled === true)
                    .map(([channel]) => (
                        <span
                            key={channel}
                            className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium"
                        >
                            {channel}
                        </span>
                    ))}
            </div>
        </div>
    );

    const handleAddProspects = (list) => {
        setSelectedList(list);
        setIsListsModalOpen(false);
        setIsAddProspectsModalOpen(true);
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Welcome Message */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-2xl mb-8 border border-blue-100">
                <div className="flex items-center gap-8">
                    <img
                        src={JULIE_IMAGE}
                        alt="Julie AI Assistant"
                        className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                    />
                    <div className="max-w-3xl">
                        <h1 className="text-2xl font-semibold text-gray-900 mb-4">
                            Hi, I'm Julie!
                        </h1>
                        <p className="text-lg text-gray-600">
                            I'm here to help you manage your outreach campaigns effectively.
                            Whether you're reaching out to potential clients, partners, or building
                            your network, I'll help you stay organized and efficient.
                        </p>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-8">
                <button
                    onClick={() => setIsCampaignModalOpen(true)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    New Campaign
                </button>
                <button
                    onClick={() => setIsListModalOpen(true)}
                    className="flex items-center px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                    <ListPlus className="w-5 h-5 mr-2" />
                    Add List
                </button>
                <button
                    onClick={() => setIsListsModalOpen(true)}
                    className="flex items-center px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                    <List className="w-5 h-5 mr-2" />
                    View Lists
                </button>
                <button
                    onClick={() => setIsAddProspectsModalOpen(true)}
                    className="flex items-center px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                    <UserPlus className="w-5 h-5 mr-2" />
                    Add Prospects
                </button>
            </div>

            {/* Active Campaigns */}
            <div className="mb-8">
                <div className="flex items-center mb-4">
                    <Activity className="w-5 h-5 text-green-500 mr-2" />
                    <h2 className="text-xl font-semibold text-gray-900">Active Campaigns</h2>
                </div>
                {isLoading ? (
                    <LoadingCampaignsSection />
                ) : campaigns.active.length === 0 ? (
                    <EmptyState
                        title="No Active Campaigns"
                        description="Create a new campaign to start reaching out to your prospects."
                    />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {campaigns.active.map(campaign => (
                            <CampaignCard key={campaign.id} campaign={campaign} />
                        ))}
                    </div>
                )}
            </div>

            {/* Inactive Campaigns */}
            <div>
                <div className="flex items-center mb-4">
                    <Clock className="w-5 h-5 text-gray-400 mr-2" />
                    <h2 className="text-xl font-semibold text-gray-900">Past Campaigns</h2>
                </div>
                {isLoading ? (
                    <LoadingCampaignsSection />
                ) : campaigns.inactive.length === 0 ? (
                    <EmptyState
                        title="No Past Campaigns"
                        description="Completed or deactivated campaigns will appear here."
                    />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {campaigns.inactive.map(campaign => (
                            <CampaignCard key={campaign.id} campaign={campaign} />
                        ))}
                    </div>
                )}
            </div>

            {/* Add Campaign Modal */}
            <CampaignModal
                isOpen={isCampaignModalOpen}
                onClose={() => setIsCampaignModalOpen(false)}
                lists={lists || []}
                onSave={handleCreateCampaign}
            />

            {/* List Modal */}
            <ListModal
                isOpen={isListModalOpen}
                onClose={() => setIsListModalOpen(false)}
                onSave={async (listData) => {
                    try {
                        await uploadToN8N(listData.file, listData.name, listData.tags);
                        await fetchData(); // Refresh lists after successful upload
                        setIsListModalOpen(false);
                    } catch (error) {
                        console.error('Error creating list:', error);
                        // Handle error (you might want to show an error message)
                    }
                }}
            />

            {/* Lists Modal */}
            <ListsModal
                isOpen={isListsModalOpen}
                onClose={() => setIsListsModalOpen(false)}
                lists={lists}
                onAddProspects={handleAddProspects}
                onListRemoved={fetchData}
            />

            {/* Add Prospects Modal */}
            <ListModal
                isOpen={isAddProspectsModalOpen}
                onClose={() => {
                    setIsAddProspectsModalOpen(false);
                    setSelectedList(null);
                }}
                mode="addProspects"
                lists={lists}
                onSave={async (data) => {
                    try {
                        await addProspectsToList(data.selectedListId, data.file);
                        await fetchData();
                        setIsAddProspectsModalOpen(false);
                        setSelectedList(null);
                    } catch (error) {
                        console.error('Error adding prospects:', error);
                    }
                }}
            />
        </div>
    );
};

export default OutreachPortal;