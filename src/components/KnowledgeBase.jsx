import React, { useState } from 'react';
import { Upload, Plus, FileText, Trash2 } from 'lucide-react';

const KnowledgeBase = () => {
    const [isDragging, setIsDragging] = useState(false);
    const [files, setFiles] = useState([]);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        const droppedFiles = Array.from(e.dataTransfer.files);
        setFiles([...files, ...droppedFiles]);
    };

    const handleFileSelect = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles([...files, ...selectedFiles]);
    };

    const removeFile = (index) => {
        const newFiles = files.filter((_, i) => i !== index);
        setFiles(newFiles);
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Knowledge Base</h1>
                <p className="text-gray-600">Upload documents to train your AI agents</p>
            </div>

            {/* Upload Area */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-8 text-center ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                    }`}
            >
                <div className="mx-auto w-12 h-12 mb-4">
                    <Upload className="w-full h-full text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Drop your files here
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                    or click to browse from your computer
                </p>
                <label className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                    <Plus className="w-5 h-5 mr-2" />
                    Add Files
                    <input
                        type="file"
                        multiple
                        className="hidden"
                        onChange={handleFileSelect}
                    />
                </label>
            </div>

            {/* File List */}
            {files.length > 0 && (
                <div className="mt-8">
                    <h2 className="text-lg font-semibold mb-4">Uploaded Files</h2>
                    <div className="space-y-3">
                        {files.map((file, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200"
                            >
                                <div className="flex items-center">
                                    <FileText className="w-5 h-5 text-gray-400 mr-3" />
                                    <div>
                                        <p className="font-medium">{file.name}</p>
                                        <p className="text-sm text-gray-500">
                                            {(file.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => removeFile(index)}
                                    className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-100"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default KnowledgeBase; 