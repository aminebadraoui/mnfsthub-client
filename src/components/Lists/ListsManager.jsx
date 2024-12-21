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
import { MdAdd, MdFormatListBulleted } from 'react-icons/md';
import ListModal from './ListModal';

const ListsManager = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [lists, setLists] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const textColor = useColorModeValue('gray.600', 'gray.300');

    const EmptyState = () => (
        <Center py={12}>
            <VStack spacing={4}>
                <Icon as={MdFormatListBulleted} boxSize={12} color="purple.400" />
                <Text fontSize="xl" fontWeight="medium">No Lists Yet</Text>
                <Text color={textColor} textAlign="center">
                    Create your first prospect list to start organizing your outreach.
                </Text>
                <Button
                    leftIcon={<Icon as={MdAdd} />}
                    colorScheme="purple"
                    onClick={() => setIsModalOpen(true)}
                >
                    Create List
                </Button>
            </VStack>
        </Center>
    );

    const LoadingState = () => (
        <Center py={12}>
            <VStack spacing={4}>
                <Spinner size="xl" color="purple.400" thickness="4px" />
                <Text color={textColor}>Loading your lists...</Text>
            </VStack>
        </Center>
    );

    if (isLoading) {
        return <LoadingState />;
    }

    return (
        <Box>
            {lists.length > 0 && (
                <Box mb={6} display="flex" justifyContent="flex-end">
                    <Button
                        leftIcon={<Icon as={MdAdd} />}
                        colorScheme="purple"
                        onClick={() => setIsModalOpen(true)}
                    >
                        Create List
                    </Button>
                </Box>
            )}

            {lists.length === 0 ? (
                <EmptyState />
            ) : (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                    {lists.map((list) => (
                        <Box
                            key={list.id}
                            p={6}
                            bg={bgColor}
                            borderRadius="lg"
                            border="1px"
                            borderColor={borderColor}
                            shadow="sm"
                        >
                            <Text fontWeight="medium" fontSize="lg" mb={2}>
                                {list.name}
                            </Text>
                            <Text color={textColor} fontSize="sm" mb={4}>
                                {list.description}
                            </Text>
                            <Text color={textColor} fontSize="sm">
                                {list.prospects?.length || 0} prospects
                            </Text>
                        </Box>
                    ))}
                </SimpleGrid>
            )}

            <ListModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={(list) => {
                    // Handle list creation here
                    setLists([...lists, { ...list, id: Date.now() }]);
                    setIsModalOpen(false);
                }}
            />
        </Box>
    );
};

export default ListsManager; 