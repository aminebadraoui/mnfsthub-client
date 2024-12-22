import React, { useState, useCallback } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalCloseButton,
    Button,
    FormControl,
    FormLabel,
    Input,
    VStack,
    Box,
    Text,
    useToast,
    Tag,
    HStack,
    InputGroup,
    Icon,
    useColorModeValue,
    Progress,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Center,
    Spinner,
    FormHelperText,
    TagLabel,
    TagCloseButton,
} from '@chakra-ui/react';
import { MdUpload, MdCheckCircle, MdError, MdCloudUpload } from 'react-icons/md';
import useAuthStore from '../../stores/authStore';

const ListModal = ({ isOpen, onClose, onSubmit }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [formData, setFormData] = useState({
        name: '',
        tags: [],
        file: null,
        jobTitle: '',
        location: '',
    });
    const [tagInput, setTagInput] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successData, setSuccessData] = useState(null);
    const toast = useToast();
    const { user } = useAuthStore();

    const borderColor = useColorModeValue('gray.200', 'gray.600');
    const dragBorderColor = useColorModeValue('purple.500', 'purple.300');
    const bgColor = useColorModeValue('gray.50', 'gray.700');
    const dragBgColor = useColorModeValue('purple.50', 'purple.900');

    const handleClose = () => {
        if (status === 'loading') {
            return; // Prevent closing during loading
        }
        setStatus('idle');
        setErrorMessage('');
        setSuccessData(null);
        setFormData({
            name: '',
            tags: [],
            file: null,
            jobTitle: '',
            location: '',
        });
        onClose();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateFile = (file) => {
        if (!file.name.toLowerCase().endsWith('.csv')) {
            toast({
                title: 'Invalid file type',
                description: 'Please upload a CSV file',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return false;
        }
        if (file.size > 10 * 1024 * 1024) { // 10MB
            toast({
                title: 'File too large',
                description: 'Please upload a file smaller than 10MB',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return false;
        }
        return true;
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && validateFile(file)) {
            setFormData(prev => ({
                ...prev,
                file
            }));
        }
    };

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file && validateFile(file)) {
            setFormData(prev => ({
                ...prev,
                file
            }));
        }
    }, []);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleTagAdd = (e) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            if (!formData.tags.includes(tagInput.trim())) {
                setFormData(prev => ({
                    ...prev,
                    tags: [...prev.tags, tagInput.trim()]
                }));
            }
            setTagInput('');
        }
    };

    const handleTagRemove = (tagToRemove) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setStatus('loading');
        setErrorMessage('');

        console.log('Starting submission process...');
        console.log('Auth data:', {
            token: localStorage.getItem('token'),
            tenantId: localStorage.getItem('tenantId'),
            user: user
        });

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found. Please sign in again.');
            }

            // First, upload the CSV file to n8n
            const formDataToSend = new FormData();
            formDataToSend.append('file', formData.file);
            formDataToSend.append('name', formData.name);
            formDataToSend.append('tags', JSON.stringify(formData.tags));
            formDataToSend.append('defaultJobTitle', formData.jobTitle);
            formDataToSend.append('defaultLocation', formData.location);

            console.log('Sending request to n8n:', {
                file: formData.file,
                name: formData.name,
                tags: formData.tags,
                defaultJobTitle: formData.jobTitle,
                defaultLocation: formData.location
            });

            // Step 1: Process CSV through n8n
            const n8nResponse = await fetch('https://mnfst-n8n.mnfstagency.com/webhook/outreach/lists/add', {
                method: 'POST',
                body: formDataToSend
            });

            console.log('n8n Response status:', n8nResponse.status);
            console.log('n8n Response headers:', Object.fromEntries(n8nResponse.headers.entries()));

            if (!n8nResponse.ok) {
                console.error('n8n request failed:', n8nResponse);
                throw new Error('Failed to process CSV file');
            }

            const n8nData = await n8nResponse.json();
            console.log('Step 1 Complete - Response from n8n:', n8nData);
            console.log('Number of contacts in response:', n8nData.list?.length);

            if (!n8nData || !n8nData.list) {
                console.error('Invalid n8n response structure:', n8nData);
                throw new Error('Invalid response from server');
            }

            // Step 2: Create the list in our database
            const tenantId = localStorage.getItem('tenantId');
            console.log('Retrieved tenant ID:', tenantId);

            if (!tenantId) {
                throw new Error('No tenant ID found. Please sign in again.');
            }

            const listRequestBody = {
                name: formData.name,
                tags: formData.tags,
                tenant_id: localStorage.getItem('tenantId')
            };
            console.log('Step 2: Creating list with:', listRequestBody);

            const listResponse = await fetch('http://localhost:5001/api/lists', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(listRequestBody)
            });

            console.log('List creation response status:', listResponse.status);
            console.log('List creation response headers:', Object.fromEntries(listResponse.headers.entries()));

            if (!listResponse.ok) {
                console.error('List creation failed:', listResponse);
                const errorText = await listResponse.text();
                console.error('List creation error details:', errorText);
                throw new Error('Failed to create list');
            }

            const listData = await listResponse.json();
            console.log('Step 2 Complete - List created:', listData);
            const listId = listData.id;

            // Step 3: Process and upload contacts
            console.log('Step 3: Processing contacts...');
            const processedContacts = n8nData.list.map(contact => {
                const output = contact.output;
                const processedContact = {
                    tenant_id: localStorage.getItem('tenantId'),
                    list_id: listId,
                    list_name: formData.name,
                    fullName: output.full_name || '',
                    firstName: output.first_name || '',
                    lastName: output.last_name || '',
                    location: output.location || '',
                    jobTitle: output.job_title || '',
                    company: output.company || '',
                    email: output.email || '',
                    phone: output.phone || '',
                    linkedin: output.linkedin || '',
                    facebook: output.facebook || '',
                    twitter: output.twitter || '',
                    instagram: output.instagram || '',
                    whatsapp: output.whatsapp || '',
                    tiktok: output.tiktok || '',
                    employeeNumber: output.employee_number || '',
                    industry: output.industry || '',
                    campaigns: output.campaigns || [],
                    lastCampaign: output.last_campaign || null,
                    contactChannels: output.contact_channels || [],
                    lastContactChannel: output.last_contact_channel || '',
                    lastContactedAt: output.last_contacted_at || null
                };
                console.log('Processed contact:', processedContact);
                return processedContact;
            });

            console.log('Sending batch contacts request with:', {
                numberOfContacts: processedContacts.length,
                sampleContact: processedContacts[0]
            });

            const contactsResponse = await fetch('http://localhost:5001/api/contacts/batch', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    contacts: processedContacts,
                    defaultJobTitle: formData.jobTitle,
                    defaultLocation: formData.location
                })
            });

            console.log('Contacts creation response status:', contactsResponse.status);
            console.log('Contacts creation response headers:', Object.fromEntries(contactsResponse.headers.entries()));

            if (!contactsResponse.ok) {
                console.error('Contacts creation failed:', contactsResponse);
                const errorText = await contactsResponse.text();
                console.error('Contacts creation error details:', errorText);
                throw new Error('Failed to create contacts');
            }

            const contactsData = await contactsResponse.json();
            console.log('Step 3 Complete - Contacts created:', contactsData);

            console.log('All steps completed successfully!');

            setSuccessData({
                name: formData.name,
                contactsCount: processedContacts.length
            });
            setStatus('success');

            // Call onSubmit with the processed data
            await onSubmit({
                name: formData.name,
                tags: formData.tags,
                contacts: processedContacts
            });

        } catch (error) {
            console.error('Error processing prospects:', error);
            console.error('Error stack:', error.stack);
            setErrorMessage(error.message || 'Failed to add prospects. Please try again.');
            setStatus('error');
        } finally {
            console.log('Process completed with status:', status);
            setIsLoading(false);
        }
    };

    const renderContent = () => {
        if (status === 'loading') {
            return (
                <VStack spacing={6} py={8}>
                    <Spinner size="xl" color="purple.500" thickness="4px" />
                    <Text fontSize="lg" fontWeight="medium">Processing your prospects...</Text>
                    <Progress size="sm" isIndeterminate width="100%" colorScheme="purple" />
                    <Alert status="warning" variant="left-accent">
                        <AlertIcon />
                        <AlertDescription>
                            Please do not close this window or tab until the process is complete.
                        </AlertDescription>
                    </Alert>
                </VStack>
            );
        }

        if (status === 'success') {
            return (
                <VStack spacing={6} py={8}>
                    <Icon as={MdCheckCircle} boxSize={16} color="green.500" />
                    <Text fontSize="lg" fontWeight="medium">Prospects Added Successfully!</Text>
                    <Text>
                        Added {successData.contactsCount} prospects to "{successData.name}"
                    </Text>
                    <Button colorScheme="purple" onClick={handleClose}>
                        Done
                    </Button>
                </VStack>
            );
        }

        if (status === 'error') {
            return (
                <VStack spacing={6} py={8}>
                    <Icon as={MdError} boxSize={16} color="red.500" />
                    <Text fontSize="lg" fontWeight="medium">Error Adding Prospects</Text>
                    <Text color="red.500">{errorMessage}</Text>
                    <HStack spacing={4}>
                        <Button variant="ghost" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button colorScheme="purple" onClick={() => setStatus('idle')}>
                            Try Again
                        </Button>
                    </HStack>
                </VStack>
            );
        }

        return (
            <>
                <ModalBody>
                    <VStack spacing={4}>
                        <FormControl isRequired>
                            <FormLabel>List Name</FormLabel>
                            <Input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter list name"
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel>Tags</FormLabel>
                            <InputGroup>
                                <Input
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={handleTagAdd}
                                    placeholder="Type and press Enter to add tags"
                                />
                            </InputGroup>
                            {formData.tags.length > 0 && (
                                <HStack spacing={2} mt={2} wrap="wrap">
                                    {formData.tags.map((tag) => (
                                        <Tag
                                            key={tag}
                                            size="md"
                                            variant="subtle"
                                            colorScheme="purple"
                                            cursor="pointer"
                                            onClick={() => handleTagRemove(tag)}
                                        >
                                            {tag}
                                        </Tag>
                                    ))}
                                </HStack>
                            )}
                        </FormControl>

                        <FormControl>
                            <FormLabel>Default Job Title (Optional)</FormLabel>
                            <Input
                                placeholder="Enter default job title"
                                value={formData.jobTitle}
                                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                            />
                            <FormHelperText>
                                Will be used if job title is missing in the CSV
                            </FormHelperText>
                        </FormControl>

                        <FormControl>
                            <FormLabel>Default Location (Optional)</FormLabel>
                            <Input
                                placeholder="Enter default location"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            />
                            <FormHelperText>
                                Will be used if location is missing in the CSV
                            </FormHelperText>
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel>Upload CSV</FormLabel>
                            <Box
                                borderWidth={2}
                                borderStyle="dashed"
                                borderColor={isDragging ? dragBorderColor : borderColor}
                                borderRadius="lg"
                                bg={isDragging ? dragBgColor : bgColor}
                                p={6}
                                textAlign="center"
                                transition="all 0.2s"
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                            >
                                <Input
                                    type="file"
                                    height="100%"
                                    width="100%"
                                    position="absolute"
                                    top="0"
                                    left="0"
                                    opacity="0"
                                    aria-hidden="true"
                                    accept=".csv"
                                    onChange={handleFileChange}
                                />
                                <Icon as={MdUpload} boxSize={8} color="purple.500" mb={2} />
                                <VStack spacing={1}>
                                    <Text fontWeight="medium">
                                        {formData.file ? (
                                            <>Selected: {formData.file.name}</>
                                        ) : (
                                            <>
                                                <Button
                                                    as="span"
                                                    variant="link"
                                                    color="purple.500"
                                                    _hover={{ textDecoration: 'underline' }}
                                                >
                                                    Upload a file
                                                </Button>
                                                {' '}or drag and drop
                                            </>
                                        )}
                                    </Text>
                                    <Text fontSize="sm" color="gray.500">
                                        CSV file up to 10MB
                                    </Text>
                                </VStack>
                            </Box>
                        </FormControl>
                    </VStack>
                </ModalBody>

                <ModalFooter>
                    <Button variant="ghost" mr={3} onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        colorScheme="purple"
                        isLoading={isLoading}
                        loadingText="Adding..."
                        isDisabled={!formData.name || !formData.file}
                    >
                        Add Prospects
                    </Button>
                </ModalFooter>
            </>
        );
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            size="md"
            closeOnOverlayClick={status !== 'loading'}
            closeOnEsc={status !== 'loading'}
        >
            <ModalOverlay />
            <ModalContent>
                {status === 'idle' && <ModalHeader>Add Prospects</ModalHeader>}
                {status === 'idle' && <ModalCloseButton />}
                <form onSubmit={handleSubmit}>
                    {renderContent()}
                </form>
            </ModalContent>
        </Modal>
    );
};

export default ListModal; 