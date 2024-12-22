import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Text,
    VStack,
    HStack,
    Tag,
    Icon,
    useColorModeValue,
} from '@chakra-ui/react';
import { MdPeople } from 'react-icons/md';

const ListCard = ({ list }) => {
    const navigate = useNavigate();
    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    const handleClick = () => {
        navigate(`/outreach-portal/lists/${list.id}/contacts`);
    };

    return (
        <Box
            bg={bgColor}
            borderWidth="1px"
            borderColor={borderColor}
            borderRadius="lg"
            p={4}
            shadow="sm"
            transition="all 0.2s"
            _hover={{ shadow: 'md' }}
            cursor="pointer"
            onClick={handleClick}
        >
            <VStack align="stretch" spacing={3}>
                <Text fontSize="lg" fontWeight="semibold" noOfLines={1}>
                    {list.name}
                </Text>

                {list.tags && list.tags.length > 0 && (
                    <HStack spacing={2} wrap="wrap">
                        {list.tags.map((tag, index) => (
                            <Tag
                                key={index}
                                size="sm"
                                colorScheme="purple"
                                variant="subtle"
                            >
                                {tag}
                            </Tag>
                        ))}
                    </HStack>
                )}

                <HStack spacing={2} color="gray.500">
                    <Icon as={MdPeople} />
                    <Text fontSize="sm">
                        {list.contactCount} prospects
                    </Text>
                </HStack>

                <Text fontSize="sm" color="gray.500">
                    Created {new Date(list.createdAt).toLocaleDateString()}
                </Text>
            </VStack>
        </Box>
    );
};

export default ListCard; 