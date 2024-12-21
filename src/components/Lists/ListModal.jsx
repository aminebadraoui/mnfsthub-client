import React, { useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalCloseButton,
    Button,
    Input,
    VStack,
    HStack,
    Text,
    Tag,
    TagLabel,
    TagCloseButton,
    Box,
    Select,
    Alert,
    AlertIcon,
    Icon,
    useColorModeValue,
} from '@chakra-ui/react';
import { AddIcon, CloseIcon } from '@chakra-ui/icons';
import { FiUpload } from 'react-icons/fi';

const ListModal = ({ isOpen, onClose, onSave, mode = 'create', selectedList = null, lists = [] }) => {
    const [name, setName] = useState('');
    const [file, setFile] = useState(null);
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedListId, setSelectedListId] = useState(selectedList?.UUID || '');
    const [isCreatingNew, setIsCreatingNew] = useState(false);

    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.600');
    const tagBg = useColorModeValue('brand.50', 'brand.900');
    const tagColor = useColorModeValue('brand.600', 'brand.200');

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === 'text/csv') {
            setFile(selectedFile);
            setError('');
        } else {
            setError('Please select a valid CSV file');
            setFile(null);
        }
    };

    const handleAddTag = () => {
        const trimmedTag = tagInput.trim().toLowerCase();
        if (trimmedTag && !tags.includes(trimmedTag)) {
            setTags([...tags, trimmedTag]);
            setTagInput('');
        }
    };

    const handleSubmit = async () => {
        if ((mode === 'create' || isCreatingNew) && !name.trim()) {
            setError('Please enter a List Name');
            return;
        }
        if (!file) {
            setError('Please select a CSV file');
            return;
        }
        if (mode === 'addProspects' && !isCreatingNew && !selectedListId) {
            setError('Please select a list');
            return;
        }

        setIsLoading(true);
        try {
            await onSave({
                name: name.trim(),
                file,
                tags,
                selectedListId: isCreatingNew ? null : selectedListId,
                isCreatingNew
            });

            // Reset form
            setName('');
            setFile(null);
            setTags([]);
            setTagInput('');
            setError('');
            setSelectedListId('');
            setIsCreatingNew(false);
        } catch (err) {
            setError(err.message || 'Failed to process list');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
            <ModalOverlay />
            <ModalContent bg={bgColor}>
                <ModalHeader>
                    {mode === 'create' ? 'Create New List' : isCreatingNew ? 'Create New List' : 'Add Prospects to List'}
                </ModalHeader>
                <ModalCloseButton />

                <ModalBody>
                    {error && (
                        <Alert status="error" mb={4} borderRadius="md">
                            <AlertIcon />
                            {error}
                        </Alert>
                    )}

                    <VStack spacing={6}>
                        {mode === 'addProspects' && !isCreatingNew ? (
                            <Box w="100%">
                                <Text mb={2} fontWeight="medium">Select List</Text>
                                <Select
                                    value={selectedListId}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (value === 'create_new') {
                                            setIsCreatingNew(true);
                                            setSelectedListId('');
                                        } else {
                                            setSelectedListId(value);
                                        }
                                    }}
                                >
                                    <option value="">Select a list...</option>
                                    <option value="create_new" style={{ color: 'var(--chakra-colors-brand-500)' }}>
                                        + Create New List
                                    </option>
                                    {lists.map(list => (
                                        <option key={list.UUID} value={list.UUID}>
                                            {list.Name} ({list.numberProspects} prospects)
                                        </option>
                                    ))}
                                </Select>
                            </Box>
                        ) : null}

                        {(mode === 'create' || isCreatingNew) && (
                            <>
                                <Box w="100%">
                                    <Text mb={2} fontWeight="medium">List Name</Text>
                                    <Input
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Enter list name..."
                                    />
                                </Box>

                                <Box w="100%">
                                    <Text mb={2} fontWeight="medium">Tags</Text>
                                    <HStack spacing={2} mb={2} flexWrap="wrap">
                                        {tags.map(tag => (
                                            <Tag
                                                key={tag}
                                                size="md"
                                                borderRadius="full"
                                                bg={tagBg}
                                                color={tagColor}
                                            >
                                                <TagLabel>{tag}</TagLabel>
                                                <TagCloseButton
                                                    onClick={() => setTags(tags.filter(t => t !== tag))}
                                                />
                                            </Tag>
                                        ))}
                                    </HStack>
                                    <HStack>
                                        <Input
                                            value={tagInput}
                                            onChange={(e) => setTagInput(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                                            placeholder="Add tags..."
                                        />
                                        <Button
                                            onClick={handleAddTag}
                                            leftIcon={<AddIcon />}
                                            colorScheme="brand"
                                        >
                                            Add
                                        </Button>
                                    </HStack>
                                </Box>
                            </>
                        )}

                        <Box w="100%">
                            <Text mb={2} fontWeight="medium">Upload CSV</Text>
                            <Box
                                borderWidth={2}
                                borderStyle="dashed"
                                borderColor={borderColor}
                                borderRadius="lg"
                                p={6}
                                textAlign="center"
                            >
                                <Icon as={FiUpload} boxSize={8} color="gray.400" mb={2} />
                                <VStack spacing={1}>
                                    <Text>
                                        <Button
                                            as="label"
                                            variant="link"
                                            cursor="pointer"
                                            colorScheme="brand"
                                        >
                                            Upload a file
                                            <input
                                                type="file"
                                                hidden
                                                accept=".csv"
                                                onChange={handleFileChange}
                                            />
                                        </Button>
                                        {' '}or drag and drop
                                    </Text>
                                    <Text fontSize="sm" color="gray.500">
                                        CSV file up to 10MB
                                    </Text>
                                    {file && (
                                        <Text fontSize="sm" color="green.500">
                                            Selected: {file.name}
                                        </Text>
                                    )}
                                </VStack>
                            </Box>
                        </Box>
                    </VStack>
                </ModalBody>

                <ModalFooter>
                    <Button
                        variant="ghost"
                        mr={3}
                        onClick={() => {
                            if (isCreatingNew) {
                                setIsCreatingNew(false);
                                setName('');
                                setTags([]);
                            } else {
                                onClose();
                            }
                        }}
                    >
                        {isCreatingNew ? 'Back' : 'Cancel'}
                    </Button>
                    <Button
                        colorScheme="brand"
                        onClick={handleSubmit}
                        isLoading={isLoading}
                        loadingText={mode === 'create' || isCreatingNew ? 'Creating...' : 'Adding...'}
                        isDisabled={
                            (!name && (mode === 'create' || isCreatingNew)) ||
                            !file ||
                            (!selectedListId && mode === 'addProspects' && !isCreatingNew)
                        }
                    >
                        {mode === 'create' || isCreatingNew ? 'Create List' : 'Add Prospects'}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ListModal; 