import React, { useState, useEffect } from 'react';
import {
    Box,
    VStack,
    HStack,
    Text,
    Icon,
    Badge,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Button,
    Spinner,
    useColorModeValue,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    useToast,
    Alert,
    AlertIcon
} from '@chakra-ui/react';
import { MdFilterList, MdSearch, MdViewList, MdRefresh } from 'react-icons/md';
import { getWorkflows, WorkflowType, WorkflowStatus, getN8nExecutionData } from '../../services/workflowService';
import useAuthStore from '../../stores/authStore';

const WorkflowTracker = () => {
    const [workflows, setWorkflows] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedType, setSelectedType] = useState(null);
    const { user } = useAuthStore();
    const toast = useToast();

    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    const fetchWorkflows = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await getWorkflows(user.tenantId, selectedType);
            setWorkflows(data || []);
        } catch (error) {
            console.error('Error fetching workflows:', error);
            setError(error.message);
            toast({
                title: 'Error',
                description: 'Failed to fetch workflows',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            // Set empty workflows array on error
            setWorkflows([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        console.log('WorkflowTracker useEffect running, user:', user);
        if (user?.tenantId) {
            console.log('Tenant ID found:', user.tenantId);
            fetchWorkflows();
            // Test n8n execution data retrieval
            getN8nExecutionData(43158)
                .then(data => console.log('Test execution data:', data))
                .catch(error => console.error('Test execution error:', error));
        } else {
            console.log('No tenant ID found');
            // Clear loading state if no user
            setIsLoading(false);
        }
    }, [user?.tenantId, selectedType]);

    const getStatusColor = (status) => {
        switch (status) {
            case WorkflowStatus.COMPLETED:
                return 'green';
            case WorkflowStatus.FAILED:
                return 'red';
            case WorkflowStatus.PENDING:
            default:
                return 'yellow';
        }
    };

    const getWorkflowIcon = (type) => {
        switch (type) {
            case WorkflowType.SEARCH:
                return MdSearch;
            case WorkflowType.LIST:
                return MdViewList;
            default:
                return MdSearch;
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    if (isLoading) {
        return (
            <Box p={8} textAlign="center">
                <Spinner size="xl" color="purple.500" thickness="4px" />
            </Box>
        );
    }

    return (
        <Box p={6}>
            <HStack spacing={4} mb={6} justify="space-between">
                <Text fontSize="2xl" fontWeight="bold">Workflow Tracker</Text>
                <HStack spacing={4}>
                    <Menu>
                        <MenuButton as={Button} leftIcon={<Icon as={MdFilterList} />} variant="outline">
                            {selectedType ? `Filter: ${selectedType}` : 'Filter'}
                        </MenuButton>
                        <MenuList>
                            <MenuItem onClick={() => setSelectedType(null)}>All</MenuItem>
                            <MenuItem onClick={() => setSelectedType(WorkflowType.SEARCH)}>Search</MenuItem>
                            <MenuItem onClick={() => setSelectedType(WorkflowType.LIST)}>List</MenuItem>
                        </MenuList>
                    </Menu>
                    <Button
                        leftIcon={<Icon as={MdRefresh} />}
                        onClick={fetchWorkflows}
                        colorScheme="purple"
                        variant="ghost"
                    >
                        Refresh
                    </Button>
                </HStack>
            </HStack>

            {error && (
                <Alert status="error" mb={6}>
                    <AlertIcon />
                    {error}
                </Alert>
            )}

            {workflows.length === 0 ? (
                <Box
                    p={8}
                    bg={bgColor}
                    borderRadius="lg"
                    border="1px"
                    borderColor={borderColor}
                    textAlign="center"
                >
                    <Text>
                        {selectedType
                            ? `No ${selectedType} workflows found`
                            : 'No workflows found'}
                    </Text>
                </Box>
            ) : (
                <Box
                    bg={bgColor}
                    borderRadius="lg"
                    border="1px"
                    borderColor={borderColor}
                    overflow="hidden"
                >
                    <Table variant="simple">
                        <Thead>
                            <Tr>
                                <Th>Type</Th>
                                <Th>Name</Th>
                                <Th>Status</Th>
                                <Th>Created</Th>
                                <Th>Updated</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {workflows.map((workflow) => (
                                <Tr key={workflow.id}>
                                    <Td>
                                        <HStack>
                                            <Icon as={getWorkflowIcon(workflow.type)} />
                                            <Text>{workflow.type}</Text>
                                        </HStack>
                                    </Td>
                                    <Td>{workflow.name}</Td>
                                    <Td>
                                        <Badge colorScheme={getStatusColor(workflow.status)}>
                                            {workflow.status}
                                        </Badge>
                                    </Td>
                                    <Td>{formatDate(workflow.createdAt)}</Td>
                                    <Td>{formatDate(workflow.updatedAt)}</Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </Box>
            )}
        </Box>
    );
};

export default WorkflowTracker; 