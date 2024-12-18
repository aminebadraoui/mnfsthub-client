import React from 'react';
import { X, Plus, Download, Trash2 } from 'lucide-react';
import { removeList } from '../services/n8nService';

const ListsModal = ({ isOpen, onClose, lists = [], onAddProspects, onListRemoved }) => {
    console.log('ListsModal received lists:', lists);

    const handleRemoveList = async (list) => {
        if (window.confirm(`Are you sure you want to remove the list "${list.Name}"?`)) {
            try {
                await removeList(list.UUID);
                onListRemoved(); // This will trigger a refresh of the lists
            } catch (error) {
                console.error('Error removing list:', error);
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-[800px] max-h-[80vh] flex flex-col">
                <div className="p-6 border-b flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Your Lists</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 flex-1 overflow-y-auto">
                    {!Array.isArray(lists) || lists.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            No lists available. Create your first list to get started.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {lists.map(list => (
                                <div
                                    key={list.UUID}
                                    className="p-4 border rounded-lg hover:border-gray-300 transition-colors"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-medium text-gray-900">{list.Name}</h3>
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
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => onAddProspects(list)}
                                                className="flex items-center px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg"
                                            >
                                                <Plus className="w-4 h-4 mr-1" />
                                                Add Prospects
                                            </button>
                                            <button
                                                className="flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
                                            >
                                                <Download className="w-4 h-4 mr-1" />
                                                Export
                                            </button>
                                            <button
                                                onClick={() => handleRemoveList(list)}
                                                className="flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                                            >
                                                <Trash2 className="w-4 h-4 mr-1" />
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ListsModal; 