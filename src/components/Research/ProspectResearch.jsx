import React, { useState } from 'react';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Select,
    VStack,
    useColorModeValue,
    Container,
    Icon,
    useToast,
    Link,
    Text,
} from '@chakra-ui/react';
import { MdSearch, MdTimeline } from 'react-icons/md';
import { createSearchWorkflow } from '../../services/workflowService';
import { Link as RouterLink } from 'react-router-dom';
import useAuthStore from '../../stores/authStore';

const ProspectResearch = () => {
    const [formData, setFormData] = useState({
        channel: '',
        jobTitle: '',
        location: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();
    const { user } = useAuthStore();

    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Create a search workflow
            const searchParams = {
                channel: formData.channel,
                jobTitle: formData.jobTitle,
                location: formData.location
            };

            // Send to backend
            await createSearchWorkflow(user.id, searchParams);

            // Show success toast
            toast({
                title: 'Workflow Submitted',
                description: 'You can track the progress in the Workflow Tracker.',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });

            // Reset form
            setFormData({
                channel: '',
                jobTitle: '',
                location: ''
            });

        } catch (error) {
            console.error('Error:', error);
            toast({
                title: 'Error',
                description: error.message || 'Failed to submit workflow',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <Container maxW="container.xl">
            <Box
                as="form"
                onSubmit={handleSubmit}
                bg={bgColor}
                p={6}
                borderRadius="lg"
                border="1px"
                borderColor={borderColor}
                shadow="sm"
                mb={6}
            >
                <VStack spacing={4}>
                    <FormControl isRequired>
                        <FormLabel>Channel</FormLabel>
                        <Select
                            name="channel"
                            value={formData.channel}
                            onChange={handleChange}
                            placeholder="Select channel"
                        >
                            <option value="linkedin">LinkedIn</option>
                            <option value="instagram">Instagram</option>
                        </Select>
                    </FormControl>

                    <FormControl isRequired>
                        <FormLabel>Job Title Keyword</FormLabel>
                        <Input
                            name="jobTitle"
                            value={formData.jobTitle}
                            onChange={handleChange}
                            placeholder="Enter job title keyword"
                        />
                    </FormControl>

                    <FormControl isRequired>
                        <FormLabel>Location Keyword</FormLabel>
                        <Input
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="Enter location keyword"
                        />
                    </FormControl>

                    <Button
                        type="submit"
                        colorScheme="purple"
                        size="lg"
                        width="full"
                        leftIcon={<Icon as={MdSearch} />}
                        isLoading={isLoading}
                        loadingText="Searching..."
                    >
                        Search
                    </Button>

                    <Link
                        as={RouterLink}
                        to="/workflows"
                        color="purple.500"
                        display="flex"
                        alignItems="center"
                        gap={2}
                    >
                        <Icon as={MdTimeline} />
                        <Text>View all workflows in the Workflow Tracker</Text>
                    </Link>
                </VStack>
            </Box>
        </Container>
    );
};

export default ProspectResearch; 