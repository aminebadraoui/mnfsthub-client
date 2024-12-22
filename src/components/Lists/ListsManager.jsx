import React, { useState, useEffect } from 'react';
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
    useToast,
    Flex,
} from '@chakra-ui/react';
import { MdAdd, MdFormatListBulleted, MdOutlinePlaylistAdd } from 'react-icons/md';
import ListModal from './ListModal';
import useAuthStore from '../../stores/authStore';
import ListCard from './ListCard';

const ListsManager = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [lists, setLists] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { token, tenantId } = useAuthStore();
    const toast = useToast();

    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const textColor = useColorModeValue('gray.600', 'gray.300');

    const fetchLists = async () => {
        try {
            setIsLoading(true);
            const storedToken = localStorage.getItem('token');
            const tenantId = localStorage.getItem('tenantId');

            if (!storedToken) {
                throw new Error('No authentication token found');
            }

            if (!tenantId) {
                throw new Error('No tenant ID found');
            }

            const response = await fetch(`http://localhost:5001/api/lists?tenant_id=${tenantId}`, {
                headers: {
                    'Authorization': `Bearer ${storedToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Lists response error:', errorText);
                throw new Error('Failed to fetch lists');
            }

            const data = await response.json();
            setLists(data);
        } catch (error) {
            console.error('Error fetching lists:', error);
            toast({
                title: 'Error',
                description: 'Failed to fetch lists. Please try again.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            fetchLists();
        }
    }, []);

    const handleListSubmit = async (listData) => {
        try {
            await fetchLists(); // Refresh the lists after successful submission
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error handling list submission:', error);
        }
    };

    const EmptyState = () => (
        <Center p={8} textAlign="center">
            <VStack spacing={4}>
                <Icon as={MdOutlinePlaylistAdd} boxSize={12} color="purple.500" />
                <Text fontSize="xl" fontWeight="medium">No Lists Yet</Text>
                <Text color="gray.500">Create your first list to start managing your prospects.</Text>
                <Button
                    leftIcon={<MdAdd />}
                    colorScheme="purple"
                    onClick={() => setIsModalOpen(true)}
                >
                    Add Prospects
                </Button>
            </VStack>
        </Center>
    );

    const LoadingState = () => (
        <Center p={8}>
            <VStack spacing={4}>
                <Spinner size="xl" color="purple.500" thickness="4px" />
                <Text fontSize="lg" color="gray.600">Loading lists...</Text>
            </VStack>
        </Center>
    );

    return (
        <Box p={4}>
            <Flex justifyContent="space-between" alignItems="center" mb={6}>
                <Text fontSize="2xl" fontWeight="bold">Lists</Text>
                {lists.length > 0 && (
                    <Button
                        leftIcon={<MdAdd />}
                        colorScheme="purple"
                        onClick={() => setIsModalOpen(true)}
                    >
                        Add Prospects
                    </Button>
                )}
            </Flex>

            {isLoading ? (
                <LoadingState />
            ) : lists.length === 0 ? (
                <EmptyState />
            ) : (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                    {lists.map((list) => (
                        <ListCard key={list.id} list={list} />
                    ))}
                </SimpleGrid>
            )}

            <ListModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleListSubmit}
            />
        </Box>
    );
};

export default ListsManager; 