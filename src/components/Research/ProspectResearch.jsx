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
} from '@chakra-ui/react';
import { MdSearch } from 'react-icons/md';

const ProspectResearch = () => {
    const [formData, setFormData] = useState({
        channel: '',
        jobTitle: '',
        location: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        // Handle search logic here
        console.log('Search with:', formData);
        // Simulate API call
        setTimeout(() => setIsLoading(false), 1000);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <Container maxW="container.md">
            <Box
                as="form"
                onSubmit={handleSubmit}
                bg={bgColor}
                p={6}
                borderRadius="lg"
                border="1px"
                borderColor={borderColor}
                shadow="sm"
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
                        <FormLabel>Job Title</FormLabel>
                        <Input
                            name="jobTitle"
                            value={formData.jobTitle}
                            onChange={handleChange}
                            placeholder="Enter job title"
                        />
                    </FormControl>

                    <FormControl isRequired>
                        <FormLabel>Location</FormLabel>
                        <Input
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="Enter location"
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
                </VStack>
            </Box>
        </Container>
    );
};

export default ProspectResearch; 