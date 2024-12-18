import React, { useState } from 'react';
import { X, Plus, Tag, CheckCircle } from 'lucide-react';
import CSVUploader from './CSVUploader';

const ListModal = ({ isOpen, onClose, onSave }) => {
    const [step, setStep] = useState('select'); // 'select' or 'create'
    const [selectedList, setSelectedList] = useState(null);
    const [newListName, setNewListName] = useState('');
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState('');
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [uploadedCount, setUploadedCount] = useState(0);

    // Sample existing lists - would come from your backend
    const [lists, setLists] = useState([
        { id: 1, name: 'Tech Companies SF', tags: ['tech', 'san-francisco'] },
        { id: 2, name: 'Healthcare Decision Makers', tags: ['healthcare', 'executive'] },
    ]);

    const handleTagKeyDown = (e) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            const newTag = tagInput.trim().toLowerCase();
            if (!tags.includes(newTag)) {
                setTags([...tags, newTag]);
            }
            setTagInput('');
        } else if (e.key === ' ' && tagInput.trim()) {
            e.preventDefault();
            const newTag = tagInput.trim().toLowerCase();
            if (!tags.includes(newTag)) {
                setTags([...tags, newTag]);
            }
            setTagInput('');
        }
    };

    const handleTagInputChange = (e) => {
        const value = e.target.value;
        if (value.endsWith(' ')) {
            const newTag = value.trim().toLowerCase();
            if (newTag && !tags.includes(newTag)) {
                setTags([...tags, newTag]);
                setTagInput('');
            }
        } else {
            setTagInput(value);
        }
    };

    const removeTag = (tagToRemove) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleCSVUpload = (processedData) => {
        if (step === 'select' && !selectedList) {
            return;
        }

        const listData = {
            listId: step === 'select' ? selectedList.id : lists.length + 1,
            name: step === 'select' ? selectedList.name : newListName,
            tags: step === 'select' ? selectedList.tags : tags,
            ...processedData // This will include email, phone, and linkedin lists
        };

        if (step === 'create') {
            const newList = {
                id: lists.length + 1,
                name: newListName,
                tags: tags
            };
            setLists([...lists, newList]);
            setSelectedList(newList);
        }

        onSave(listData);
        setUploadedCount(
            (processedData.email?.length || 0) +
            (processedData.phone?.length || 0) +
            (processedData.linkedin?.length || 0)
        );
        setUploadSuccess(true);
    };

    const handleBack = () => {
        setStep('select');
        setNewListName('');
        setTags([]);
        setTagInput('');
    };

    const handleDone = () => {
        setUploadSuccess(false);
        setUploadedCount(0);
        setStep('select');
        setSelectedList(null);
        setNewListName('');
        setTags([]);
        setTagInput('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-[600px] max-h-[80vh] flex flex-col">
                <div className="p-6 border-b flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Add Prospects to List</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 flex-1 overflow-y-auto">
                    {uploadSuccess ? (
                        <div className="text-center py-8">
                            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Upload Successful!</h3>
                            <p className="text-gray-600 mb-8">
                                {uploadedCount} prospects have been added to{' '}
                                <span className="font-medium">
                                    {selectedList ? selectedList.name : newListName}
                                </span>
                            </p>
                            <button
                                onClick={handleDone}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Done
                            </button>
                        </div>
                    ) : (
                        <>
                            {step === 'select' ? (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-medium">Select Existing List</h3>
                                        <button
                                            onClick={() => setStep('create')}
                                            className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                                        >
                                            <Plus className="w-4 h-4" />
                                            Create New List
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        {lists.map(list => (
                                            <div
                                                key={list.id}
                                                onClick={() => setSelectedList(list)}
                                                className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${selectedList?.id === list.id ? 'border-blue-500 bg-blue-50' : ''}`}
                                            >
                                                <div className="font-medium">{list.name}</div>
                                                <div className="flex gap-2 mt-2">
                                                    {list.tags.map(tag => (
                                                        <span
                                                            key={tag}
                                                            className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-6">
                                        <CSVUploader
                                            onUpload={handleCSVUpload}
                                            listId={selectedList?.id || lists.length + 1}
                                            listName={selectedList?.name || newListName}
                                            tags={selectedList?.tags || tags}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            List Name
                                        </label>
                                        <input
                                            type="text"
                                            value={newListName}
                                            onChange={(e) => setNewListName(e.target.value)}
                                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Enter list name..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Tags
                                        </label>
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {tags.map(tag => (
                                                <span
                                                    key={tag}
                                                    className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-sm flex items-center gap-1"
                                                >
                                                    <Tag className="w-4 h-4" />
                                                    {tag}
                                                    <button
                                                        onClick={() => removeTag(tag)}
                                                        className="hover:text-blue-800"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                        <input
                                            type="text"
                                            value={tagInput}
                                            onChange={handleTagInputChange}
                                            onKeyDown={handleTagKeyDown}
                                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Type tag and press Space or Enter..."
                                        />
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {!uploadSuccess && (
                    <div className="p-6 border-t flex justify-between">
                        {step === 'create' && (
                            <button
                                onClick={handleBack}
                                className="text-gray-600 hover:text-gray-800"
                            >
                                Back to List Selection
                            </button>
                        )}
                        {step === 'create' && (
                            <button
                                onClick={() => {
                                    const newList = {
                                        id: lists.length + 1,
                                        name: newListName,
                                        tags: tags
                                    };
                                    setLists([...lists, newList]);
                                    setSelectedList(newList);
                                    setStep('select');
                                }}
                                disabled={!newListName}
                                className={`px-4 py-2 rounded-lg ${newListName
                                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                Done
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ListModal; 