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
        try {
            setLoading(true);
            setError(''); // Clear any previous errors
            let listId;
            let listName;
            let listTags;
            const tenantId = localStorage.getItem('tenantId'); // Get tenant ID

            // Step 1: If creating new list, check for duplicates and add to Baserow Lists table
            if (mode === 'create') {
                // Check for duplicate lists first
                console.log('Checking for duplicate list:', {
                    'Tenant ID': tenantId,
                    'Name': newListName
                });

                const existingLists = await baserowService.getLists({
                    filters: {
                        'Tenant ID': tenantId
                    }
                });

                // Check for exact name match (case-sensitive)
                const hasDuplicate = existingLists.results.some(list =>
                    list.Name === newListName
                );

                if (hasDuplicate) {
                    throw new Error(`A list with name "${newListName}" already exists`);
                }

                // Create list data with exact column names from Baserow
                const listData = {
                    'Name': newListName,
                    'Tags': tags.join(','),
                    'Tenant ID': tenantId,
                    'Active': true
                };

                console.log('Creating new list with data:', listData);
                const newList = await baserowService.createList(listData);

                console.log('New list created:', newList);
                listId = newList.id;
                listName = newListName;
                listTags = tags.join(',');
                onListCreated(newList);
            } else {
                // Get the selected list's details
                const selectedListDetails = lists.find(l => l.id === selectedList);
                listName = selectedListDetails.Name;
                listTags = selectedListDetails.Tags;
                listId = selectedList;
            }

            // Step 2: Send CSV to n8n webhook for normalization
            const formData = new FormData();
            formData.append('file', file);

            console.log('Sending file to n8n webhook for normalization');
            const response = await fetch('https://mnfst-n8n.mnfstagency.com/webhook/outreach/lists/add', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to normalize data through n8n');
            }

            const normalizedData = await response.json();
            console.log('Normalized data received from n8n:', normalizedData);

            // Check if normalizedData has the expected structure
            if (!normalizedData?.list || !Array.isArray(normalizedData.list)) {
                throw new Error('Invalid response format from n8n');
            }

            // Step 3: Add list details to each contact in normalized data
            const contacts = normalizedData.list.map(contact => {
                // Create a new contact object with the exact Baserow field names
                const contactData = {
                    'Tenant ID': tenantId,
                    'Full name': contact['Full name'] || contact['Full Name'] || '',
                    'First n': contact['First name'] || contact['First Name'] || '',
                    'Last': contact['Last name'] || contact['Last Name'] || '',
                    'Location': contact['Location'] || '',
                    'Job title': contact['Job title'] || contact['Job Title'] || '',
                    'Company': contact['Company'] || '',
                    'Email': contact['Email'] || '',
                    'Phone': contact['Phone'] || '',
                    'LinkedIn': contact['LinkedIn'] || contact['Linkedin'] || '',
                    'Instagram': contact['Instagram'] || '',
                    'Facebook': contact['Facebook'] || '',
                    'Twitter': contact['Twitter'] || '',
                    'Industry': contact['Industry'] || '',
                    'List Name': listName,
                    'Tags': listTags,
                    'Active': true
                };

                // Log the contact data for debugging
                console.log('Created contact data:', contactData);
                return contactData;
            });

            console.log('Contacts to add:', contacts);

            // Step 4: Check for duplicates and add to Baserow Contacts table
            let addedCount = 0;
            let duplicateCount = 0;

            for (const contact of contacts) {
                try {
                    // Only check for duplicates if we have an email
                    if (contact.Email && contact.Email !== 'N/A') {
                        // Check for duplicates based on Tenant ID and Email
                        const existingContacts = await baserowService.getContacts({
                            filters: {
                                'Tenant ID': contact['Tenant ID'],  // Use exact Baserow field name with space
                                'Email': contact.Email
                            }
                        });

                        if (existingContacts.count === 0) {
                            // Not a duplicate, add to Baserow
                            console.log('Adding new contact:', contact);
                            await baserowService.createContact(contact);
                            addedCount++;
                        } else {
                            console.log('Found duplicate contact:', contact);
                            duplicateCount++;
                        }
                    } else {
                        // If no email, just add the contact
                        console.log('Adding contact without email check:', contact);
                        await baserowService.createContact(contact);
                        addedCount++;
                    }
                } catch (error) {
                    console.error('Error processing contact:', error);
                    // Continue with the next contact even if one fails
                }
            }

            console.log(`Added ${addedCount} contacts, found ${duplicateCount} duplicates`);
            onProspectsAdded();
            onClose();
        } catch (error) {
            console.error('Error adding prospects:', error);
            setError(error.message);
            // TODO: Show error message to user
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
                                    {list.Name}
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