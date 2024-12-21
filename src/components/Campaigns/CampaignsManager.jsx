import React, { useState } from 'react';
import {
    Box,
    Button,
    SimpleGrid,
    Text,
    VStack,
    Icon,
    useColorModeValue,
    Spinner,
    Center,
} from '@chakra-ui/react';
import { MdAdd, MdCampaign } from 'react-icons/md';

const CampaignsManager = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const textColor = useColorModeValue('gray.600', 'gray.300');

    const EmptyState = () => (
        <Center py={12}>
            <VStack spacing={4}>
                <Icon as={MdCampaign} boxSize={12} color="purple.400" />
                <Text fontSize="xl" fontWeight="medium">No Campaigns Yet</Text>
                <Text color={textColor} textAlign="center">
                    Create your first campaign to start reaching out to prospects.
                </Text>
                <Button
                    leftIcon={<Icon as={MdAdd} />}
                    colorScheme="purple"
                    onClick={() => {
                        // Handle campaign creation
                    }}
                >
                    Create Campaign
                </Button>
            </VStack>
        </Center>
    );

    const LoadingState = () => (
        <Center py={12}>
            <VStack spacing={4}>
                <Spinner size="xl" color="purple.400" thickness="4px" />
                <Text color={textColor}>Loading your campaigns...</Text>
            </VStack>
        </Center>
    );

    if (isLoading) {
        return <LoadingState />;
    }

    return (
        <Box>
            {campaigns.length > 0 && (
                <Box mb={6} display="flex" justifyContent="flex-end">
                    <Button
                        leftIcon={<Icon as={MdAdd} />}
                        colorScheme="purple"
                        onClick={() => {
                            // Handle campaign creation
                        }}
                    >
                        Create Campaign
                    </Button>
                </Box>
            )}

            {campaigns.length === 0 ? (
                <EmptyState />
            ) : (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                    {campaigns.map((campaign) => (
                        <Box
                            key={campaign.id}
                            p={6}
                            bg={bgColor}
                            borderRadius="lg"
                            border="1px"
                            borderColor={borderColor}
                            shadow="sm"
                        >
                            <Text fontWeight="medium" fontSize="lg" mb={2}>
                                {campaign.name}
                            </Text>
                            <Text color={textColor} fontSize="sm" mb={4}>
                                {campaign.description}
                            </Text>
                            <Text color={textColor} fontSize="sm">
                                Status: {campaign.status}
                            </Text>
                        </Box>
                    ))}
                </SimpleGrid>
            )}
        </Box>
    );
};

export default CampaignsManager; 