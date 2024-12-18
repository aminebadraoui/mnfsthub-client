import React, { useState } from 'react';
import { X, Mail, Phone, Linkedin, Instagram, Facebook, Twitter } from 'lucide-react';

const CHANNELS = [
    { id: 'email', name: 'Email', icon: Mail, color: 'text-blue-600' },
    { id: 'phone', name: 'Phone', icon: Phone, color: 'text-green-600' },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'text-blue-700' },
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'text-pink-600' },
    { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'text-blue-600' },
    { id: 'twitter', name: 'X (Twitter)', icon: Twitter, color: 'text-gray-900' },
];

const CampaignModal = ({ isOpen, onClose, lists = [], onSave }) => {
    const [name, setName] = useState('');
    const [selectedList, setSelectedList] = useState(null);
    const [selectedChannels, setSelectedChannels] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = () => {
        if (!name.trim()) {
            setError('Please enter a campaign name');
            return;
        }
        if (!selectedList) {
            setError('Please select a list');
            return;
        }
        if (selectedChannels.length === 0) {
            setError('Please select at least one channel');
            return;
        }

        onSave({
            name: name.trim(),
            listId: selectedList.UUID,
            listName: selectedList.Name,
            channels: selectedChannels
        });

        // Reset form
        setName('');
        setSelectedList(null);
        setSelectedChannels([]);
        setError('');
    };

    const toggleChannel = (channelId) => {
        setSelectedChannels(prev =>
            prev.includes(channelId)
                ? prev.filter(id => id !== channelId)
                : [...prev, channelId]
        );
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-[600px] max-h-[80vh] flex flex-col">
                <div className="p-6 border-b flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Create New Campaign</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 flex-1 overflow-y-auto">
                    {error && (
                        <div className="mb-4 bg-red-50 text-red-600 px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Campaign Name
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter campaign name..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Select List
                            </label>
                            <div className="max-h-60 overflow-y-auto border rounded-lg">
                                {isLoading ? (
                                    <div className="text-center py-4">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                                        <p className="mt-2 text-gray-500">Loading lists...</p>
                                    </div>
                                ) : !Array.isArray(lists) || lists.length === 0 ? (
                                    <p className="text-gray-500 text-sm p-4">
                                        No lists available. Please create a list first.
                                    </p>
                                ) : (
                                    lists.map(list => (
                                        <div
                                            key={list.UUID}
                                            onClick={() => setSelectedList(list)}
                                            className={`p-4 border-b last:border-b-0 cursor-pointer hover:bg-gray-50 ${selectedList?.UUID === list.UUID ? 'bg-blue-50' : ''
                                                }`}
                                        >
                                            <div className="font-medium">{list.Name}</div>
                                            <div className="flex gap-2 mt-2">
                                                {list.Tags && list.Tags.split(',').map(tag => (
                                                    <span
                                                        key={tag}
                                                        className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="mt-2 text-sm text-gray-500">
                                                {list.numberProspects} prospects
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Select Channels
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {CHANNELS.map(channel => {
                                    const Icon = channel.icon;
                                    const isSelected = selectedChannels.includes(channel.id);
                                    return (
                                        <button
                                            key={channel.id}
                                            onClick={() => toggleChannel(channel.id)}
                                            className={`flex items-center p-3 border rounded-lg hover:bg-gray-50 ${isSelected ? 'border-blue-500 bg-blue-50' : ''
                                                }`}
                                        >
                                            <Icon className={`w-5 h-5 ${channel.color}`} />
                                            <span className="ml-2">{channel.name}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!name || !selectedList || selectedChannels.length === 0}
                        className={`px-4 py-2 rounded-lg ${!name || !selectedList || selectedChannels.length === 0
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                    >
                        Create Campaign
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CampaignModal; 