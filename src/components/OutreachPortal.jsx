import React from 'react';
import {
    Box,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    Text,
    Container,
    VStack,
    useColorModeValue,
    Button,
    Icon,
    Flex,
} from '@chakra-ui/react';
import { MdArrowBack } from 'react-icons/md';
import { Routes, Route, useNavigate } from 'react-router-dom';
import ListsManager from './Lists/ListsManager';
import CampaignsManager from './Campaigns/CampaignsManager';
import ProspectResearch from './Research/ProspectResearch';
import ContactsTable from './Lists/ContactsTable';

const OutreachPortal = () => {
    const navigate = useNavigate();
    const headingColor = useColorModeValue('gray.700', 'white');
    const textColor = useColorModeValue('gray.600', 'gray.200');
    const tabColor = useColorModeValue('brand.500', 'brand.300');

    return (
        <Container maxW="container.xl">
            <Flex mb={6} alignItems="center">
                <Button
                    leftIcon={<Icon as={MdArrowBack} />}
                    variant="ghost"
                    colorScheme="purple"
                    size="md"
                    onClick={() => navigate(-1)}
                    _hover={{
                        bg: 'purple.50',
                        _dark: {
                            bg: 'purple.900'
                        }
                    }}
                >
                    Back
                </Button>
            </Flex>
            <VStack align="stretch" mb={8} spacing={2}>
                <Text fontSize="2xl" fontWeight="bold" color={headingColor}>
                    Outreach Portal
                </Text>
                <Text color={textColor}>
                    Manage your prospect lists, campaigns, and research
                </Text>
            </VStack>

            <Routes>
                <Route path="lists/:listId/contacts" element={<ContactsTable />} />
                <Route path="*" element={
                    <Tabs colorScheme="brand" isLazy>
                        <TabList borderBottomWidth="1px" borderBottomColor="gray.200">
                            <Tab
                                fontSize="md"
                                fontWeight="medium"
                                _selected={{
                                    color: tabColor,
                                    borderBottomColor: tabColor,
                                }}
                            >
                                Lists
                            </Tab>
                            <Tab
                                fontSize="md"
                                fontWeight="medium"
                                _selected={{
                                    color: tabColor,
                                    borderBottomColor: tabColor,
                                }}
                            >
                                Campaigns
                            </Tab>
                            <Tab
                                fontSize="md"
                                fontWeight="medium"
                                _selected={{
                                    color: tabColor,
                                    borderBottomColor: tabColor,
                                }}
                            >
                                Research
                            </Tab>
                        </TabList>

                        <TabPanels>
                            <TabPanel px={0} py={6}>
                                <ListsManager />
                            </TabPanel>
                            <TabPanel px={0} py={6}>
                                <CampaignsManager />
                            </TabPanel>
                            <TabPanel px={0} py={6}>
                                <ProspectResearch />
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                } />
            </Routes>
        </Container>
    );
};

export default OutreachPortal;