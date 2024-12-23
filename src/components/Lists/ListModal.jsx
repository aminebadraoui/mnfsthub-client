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
import { createListWorkflow } from '../../services/workflowService';

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setStatus('loading');
        setErrorMessage('');

        try {
            // Create a list workflow
            const listParams = {
                name: formData.name,
                tags: formData.tags,
                defaultJobTitle: formData.jobTitle,
                defaultLocation: formData.location,
                file: formData.file
            };

            // Send to backend
            await createListWorkflow(user.id, listParams);

            // Show success toast
            toast({
                title: 'Workflow Submitted',
                description: 'You can track the progress in the Workflow Tracker.',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });

            // Close modal and notify parent
            onSubmit();
            handleClose();

        } catch (error) {
            console.error('Error:', error);
            setErrorMessage(error.message || 'An error occurred while processing your request');
            setStatus('error');
        } finally {
            setIsLoading(false);
        }
    };

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
        const file = e.dataTransfer.files[0];
        if (file && validateFile(file)) {
            setFormData(prev => ({
                ...prev,
                file
            }));
        }
    };

    const handleTagInputKeyDown = (e) => {
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

    const handleRemoveTag = (tagToRemove) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    const renderContent = () => {
        if (status === 'loading') {
            return (
                <VStack spacing={6} py={8}>
                    <Spinner size="xl" color="purple.500" thickness="4px" />
                    <Text fontSize="lg" fontWeight="medium">Submitting workflow...</Text>
                    <Progress size="sm" isIndeterminate width="100%" colorScheme="purple" />
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
                            <Input
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={handleTagInputKeyDown}
                                placeholder="Type and press Enter to add tags"
                            />
                            {formData.tags.length > 0 && (
                                <Box mt={2}>
                                    <HStack spacing={2} wrap="wrap">
                                        {formData.tags.map((tag, index) => (
                                            <Tag
                                                key={index}
                                                size="md"
                                                borderRadius="full"
                                                variant="solid"
                                                colorScheme="purple"
                                            >
                                                <TagLabel>{tag}</TagLabel>
                                                <TagCloseButton
                                                    onClick={() => handleRemoveTag(tag)}
                                                />
                                            </Tag>
                                        ))}
                                    </HStack>
                                </Box>
                            )}
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel>Default Job Title</FormLabel>
                            <Input
                                name="jobTitle"
                                value={formData.jobTitle}
                                onChange={handleChange}
                                placeholder="Enter default job title"
                            />
                            <FormHelperText>
                                Used when job title is not specified in the CSV
                            </FormHelperText>
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel>Default Location</FormLabel>
                            <Input
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="Enter default location"
                            />
                            <FormHelperText>
                                Used when location is not specified in the CSV
                            </FormHelperText>
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel>Upload CSV</FormLabel>
                            <Box
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                borderWidth={2}
                                borderRadius="md"
                                borderStyle="dashed"
                                borderColor={isDragging ? dragBorderColor : borderColor}
                                bg={isDragging ? dragBgColor : bgColor}
                                p={6}
                                textAlign="center"
                                cursor="pointer"
                                transition="all 0.2s"
                                _hover={{
                                    borderColor: dragBorderColor,
                                    bg: dragBgColor
                                }}
                                onClick={() => document.getElementById('file-input').click()}
                            >
                                <Input
                                    type="file"
                                    id="file-input"
                                    display="none"
                                    accept=".csv"
                                    onChange={handleFileChange}
                                />
                                <VStack spacing={2}>
                                    <Icon
                                        as={formData.file ? MdCheckCircle : MdCloudUpload}
                                        boxSize={8}
                                        color={formData.file ? 'green.500' : 'gray.500'}
                                    />
                                    {formData.file ? (
                                        <Text color="green.500">{formData.file.name}</Text>
                                    ) : (
                                        <>
                                            <Text>Drag and drop your CSV file here</Text>
                                            <Text fontSize="sm" color="gray.500">
                                                or click to browse
                                            </Text>
                                        </>
                                    )}
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
                        colorScheme="purple"
                        leftIcon={<Icon as={MdUpload} />}
                        onClick={handleSubmit}
                        isLoading={isLoading}
                        loadingText="Uploading..."
                        isDisabled={!formData.file}
                    >
                        Upload
                    </Button>
                </ModalFooter>
            </>
        );
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            size="xl"
            closeOnOverlayClick={status !== 'loading'}
            closeOnEsc={status !== 'loading'}
        >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Add Prospects from CSV</ModalHeader>
                {status !== 'loading' && <ModalCloseButton />}
                {renderContent()}
            </ModalContent>
        </Modal>
    );
};

export default ListModal; 