import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileText, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { uploadToN8N } from '../services/n8nService';

const CSVUploader = ({ onUpload, listId, listName, tags }) => {
    const [uploadStatus, setUploadStatus] = useState(null); // 'loading', 'success', 'error', or null
    const [fileName, setFileName] = useState(null);

    const onDrop = useCallback(async (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file) {
            setFileName(file.name);
            setUploadStatus('loading');

            try {
                // Upload to n8n with list details
                const result = await uploadToN8N(file, listId, listName, tags);

                // Handle the processed data from n8n
                const { emailList, phoneList, linkedinList } = result;

                setUploadStatus('success');
                onUpload({
                    email: emailList,
                    phone: phoneList,
                    linkedin: linkedinList,
                    originalFile: file.name
                });
            } catch (error) {
                console.error('Upload failed:', error);
                setUploadStatus('error');
            }
        }
    }, [onUpload, listId, listName, tags]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'text/csv': ['.csv'],
            'application/vnd.ms-excel': ['.csv']
        },
        multiple: false
    });

    const resetUploader = () => {
        setUploadStatus(null);
        setFileName(null);
    };

    return (
        <div className="w-full">
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                    ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
                    ${uploadStatus === 'success' ? 'border-green-500 bg-green-50' : ''}
                    ${uploadStatus === 'error' ? 'border-red-500 bg-red-50' : ''}
                `}
            >
                <input {...getInputProps()} />

                {uploadStatus === 'loading' ? (
                    <div className="space-y-2">
                        <Loader className="w-12 h-12 text-blue-500 mx-auto animate-spin" />
                        <p className="text-gray-600">Processing your file...</p>
                        <div className="flex items-center justify-center gap-2">
                            <FileText className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600">{fileName}</span>
                        </div>
                    </div>
                ) : uploadStatus === 'success' ? (
                    <div className="space-y-2">
                        <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                        <div className="flex items-center justify-center gap-2">
                            <FileText className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600">{fileName}</span>
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                resetUploader();
                            }}
                            className="text-sm text-blue-600 hover:text-blue-700"
                        >
                            Upload a different file
                        </button>
                    </div>
                ) : uploadStatus === 'error' ? (
                    <div className="space-y-2">
                        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
                        <p className="text-red-600">Error processing file</p>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                resetUploader();
                            }}
                            className="text-sm text-blue-600 hover:text-blue-700"
                        >
                            Try again
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                        <div>
                            <p className="text-gray-600">
                                {isDragActive ? (
                                    "Drop your CSV file here"
                                ) : (
                                    <>
                                        Drag and drop your CSV file here, or{" "}
                                        <span className="text-blue-600">browse</span>
                                    </>
                                )}
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                                Only CSV files are supported
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CSVUploader; 