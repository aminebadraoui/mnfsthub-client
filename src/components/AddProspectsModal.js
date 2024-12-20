import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Button,
    TextField,
    Box,
    Typography,
    IconButton,
    Chip,
} from '@mui/material';
import { Close as CloseIcon, Upload as UploadIcon } from '@mui/icons-material';
import baserowService from '../services/baserow.service';

const AddProspectsModal = ({ open, onClose, lists, onListCreated, onProspectsAdded }) => {
    const [mode, setMode] = useState('select'); // 'select' or 'create'
    const [selectedList, setSelectedList] = useState('');
    const [newListName, setNewListName] = useState('');
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState('');
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleTagInputKeyPress = (e) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            setTags([...tags, tagInput.trim()]);
            setTagInput('');
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
        setError(''); // Clear any previous errors
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            // Check for duplicate list name
            const duplicate = lists.find(list => list.name.toLowerCase() === newListName.toLowerCase());
            if (duplicate) {
                setError('A list with this name already exists');
                setLoading(false);
                return;
            }

            // Create new list in Baserow
            const newList = await baserowService.createList({
                'Name': newListName,
                'Tags': tags.join(','),
                'Tenant ID': localStorage.getItem('tenantId'),
                'Active': true
            });

            // Upload prospects to n8n webhook
            const formData = new FormData();
            formData.append('file', file);
            formData.append('listId', newList.id);
            formData.append('listName', newListName);

            const response = await fetch('https://mnfst-n8n.mnfstagency.com/webhook/outreach/lists/add', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            console.log(data);

            if (!response.ok) {
                throw new Error('Failed to upload prospects');
            }

            // Add contacts to Baserow contacts table
            if (data.list && Array.isArray(data.list)) {
                const contactPromises = data.list.map(contact =>
                    baserowService.createContact({
                        'Company': contact.Company || 'N/A',
                        'Email': contact.Email || 'N/A',
                        'Employee Number': contact['Employee Number'] || 'N/A',
                        'Facebook': contact.Facebook || '',
                        'First name': contact['First name'] || '',
                        'Full name': contact['Full name'] || '',
                        'Industry': contact.Industry || 'N/A',
                        'Instagram': contact.Instagram || '',
                        'Job title': contact['Job title'] || 'N/A',
                        'Last name': contact['Last name'] || '',
                        'LinkedIn': contact.LinkedIn || 'N/A',
                        'List Name': contact['List Name'] || newListName,
                        'Location': contact.Location || 'N/A',
                        'Phone': contact.Phone || 'N/A',
                        'Tags': contact.Tags || '',
                        'Tenant ID': localStorage.getItem('tenantId'),
                        'Tiktok': contact.Tiktok || null,
                        'Twitter': contact.Twitter || ''
                    })
                );

                await Promise.all(contactPromises);
            }

            // Close modal and trigger processing state
            onClose();
            onListCreated(newList);
            onProspectsAdded(newListName);

        } catch (error) {
            console.error('Error submitting list:', error);
            setError('Failed to create list and add contacts. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: '12px',
                }
            }}
        >
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">Add Prospects to List</Typography>
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent>
                <Box mb={3}>
                    <Typography variant="subtitle1" gutterBottom>
                        Select List
                    </Typography>
                    <Box display="flex" gap={2} mb={3}>
                        <select
                            value={selectedList}
                            onChange={(e) => {
                                if (e.target.value === 'create') {
                                    setMode('create');
                                    setSelectedList('');
                                } else {
                                    setMode('select');
                                    setSelectedList(e.target.value);
                                }
                            }}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select a list...</option>
                            {lists.map((list) => (
                                <option key={list.id} value={list.id}>
                                    {list.name}
                                </option>
                            ))}
                            <option value="create">+ Create new list</option>
                        </select>
                    </Box>

                    {mode === 'create' && (
                        <>
                            <Box mb={3}>
                                <Typography variant="subtitle1" gutterBottom>
                                    List Name
                                </Typography>
                                <TextField
                                    fullWidth
                                    placeholder="Enter list name"
                                    value={newListName}
                                    onChange={(e) => setNewListName(e.target.value)}
                                    variant="outlined"
                                    size="small"
                                />
                            </Box>

                            <Box mb={3}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Tags
                                </Typography>
                                <TextField
                                    fullWidth
                                    placeholder="Press Enter to add tags"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyPress={handleTagInputKeyPress}
                                    variant="outlined"
                                    size="small"
                                />
                                <Box sx={{ mt: 1 }}>
                                    {tags.map((tag, index) => (
                                        <Chip
                                            key={index}
                                            label={tag}
                                            onDelete={() => handleRemoveTag(tag)}
                                            sx={{ mr: 0.5, mb: 0.5 }}
                                        />
                                    ))}
                                </Box>
                            </Box>
                        </>
                    )}

                    <Box>
                        <Typography variant="subtitle1" gutterBottom>
                            Upload CSV
                        </Typography>
                        <Box
                            sx={{
                                border: '2px dashed #E5E7EB',
                                borderRadius: '8px',
                                p: 3,
                                textAlign: 'center',
                                cursor: 'pointer',
                                '&:hover': {
                                    borderColor: '#9CA3AF'
                                }
                            }}
                        >
                            <input
                                accept=".csv"
                                style={{ display: 'none' }}
                                id="prospects-file"
                                type="file"
                                onChange={handleFileChange}
                            />
                            <label htmlFor="prospects-file" style={{ cursor: 'pointer' }}>
                                <UploadIcon sx={{ fontSize: 40, color: '#9CA3AF', mb: 1 }} />
                                <Typography>
                                    {file ? file.name : 'Upload a file or drag and drop'}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    CSV file up to 10MB
                                </Typography>
                            </label>
                        </Box>
                    </Box>

                    {error && (
                        <Box sx={{ mt: 2, mb: 2 }}>
                            <Typography color="error" variant="body2">
                                {error}
                            </Typography>
                        </Box>
                    )}

                    <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
                        <Button onClick={onClose}>
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleSubmit}
                            disabled={loading || !file || (mode === 'select' && !selectedList) || (mode === 'create' && !newListName)}
                        >
                            {loading ? 'Adding Prospects...' : 'Add Prospects'}
                        </Button>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default AddProspectsModal; 