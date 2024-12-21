import React from 'react';
import {
    Box,
    Text,
    SimpleGrid,
    Image,
    VStack,
    HStack,
    useColorModeValue,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();

    const agents = [
        {
            name: "Julie",
            role: "Sales Outreach Agent",
            description: "Cold emails, calls, and direct messages",
            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
            path: "/outreach-portal",
            bgColor: 'purple.50'
        },
        {
            name: "Sophie",
            role: "Marketing Agent",
            description: "Marketing content and SEO strategy",
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
            path: "/marketing-portal",
            bgColor: 'pink.50'
        },
        {
            name: "Lucas",
            role: "Sales Coach Agent",
            description: "Call analysis and feedback",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
            path: "/sales-portal",
            bgColor: 'green.50'
        },
        {
            name: "Alex",
            role: "Client Experience Agent",
            description: "Customer support and assistance",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
            path: "/cx-portal",
            bgColor: 'red.50'
        }
    ];

    const headingColor = useColorModeValue('gray.700', 'white');
    const textColor = useColorModeValue('gray.600', 'gray.200');
    const cardBorderColor = useColorModeValue('gray.100', 'gray.600');
    const accentColor = useColorModeValue('brand.500', 'brand.300');

    return (
        <Box>
            <VStack align="stretch" mb={8} spacing={2}>
                <Text fontSize="2xl" fontWeight="bold" color={headingColor}>
                    AI Agents
                </Text>
                <Text color={textColor}>
                    Select an agent to access their portal
                </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                {agents.map((agent) => (
                    <Box
                        key={agent.name}
                        onClick={() => navigate(agent.path)}
                        bg={agent.bgColor}
                        p={6}
                        borderRadius="lg"
                        border="1px solid"
                        borderColor={cardBorderColor}
                        cursor="pointer"
                        transition="all 0.2s"
                        _hover={{
                            transform: 'translateY(-4px)',
                            shadow: 'md',
                        }}
                    >
                        <HStack spacing={6} align="flex-start">
                            <Image
                                src={agent.image}
                                alt={agent.name}
                                boxSize="120px"
                                objectFit="cover"
                                borderRadius="md"
                            />
                            <VStack align="stretch" spacing={2}>
                                <Text fontSize="xl" fontWeight="semibold" color={headingColor}>
                                    {agent.name}
                                </Text>
                                <Text fontSize="sm" color={textColor}>
                                    {agent.role}
                                </Text>
                                <Text fontSize="sm" color={textColor}>
                                    {agent.description}
                                </Text>
                                <Text
                                    fontSize="sm"
                                    color={accentColor}
                                    fontWeight="medium"
                                    mt={2}
                                >
                                    Click to access portal →
                                </Text>
                            </VStack>
                        </HStack>
                    </Box>
                ))}
            </SimpleGrid>

            <Box mt={12}>
                <Text fontSize="2xl" fontWeight="bold" color={headingColor}>
                    Business Overview
                </Text>
            </Box>
        </Box>
    );
};

export default Dashboard;