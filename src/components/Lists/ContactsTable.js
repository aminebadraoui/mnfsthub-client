import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    IconButton,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Text,
    Tag,
    Skeleton,
    useColorModeValue,
    Button,
    Icon,
    Flex,
    VStack,
    Badge,
    HStack,
    Link,
} from '@chakra-ui/react';
import {
    MdMoreVert,
    MdEdit,
    MdDelete,
    MdLocationOn,
    MdArrowBack,
    MdEmail,
    MdPhone,
} from 'react-icons/md';
import {
    FaLinkedin,
    FaInstagram,
    FaFacebook,
    FaTwitter,
    FaTiktok,
    FaWhatsapp,
} from 'react-icons/fa';
import { getContacts } from '../../services/contacts.service';

const ContactsTable = () => {
    const { listId } = useParams();
    const navigate = useNavigate();
    const [contacts, setContacts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const bgColor = useColorModeValue('white', 'gray.800');
    const textColor = useColorModeValue('gray.600', 'gray.300');
    const iconColor = useColorModeValue('purple.500', 'purple.300');

    useEffect(() => {
        console.log('Current contacts state:', contacts);
    }, [contacts]);

    useEffect(() => {
        fetchContacts();
    }, [listId]);

    const fetchContacts = async () => {
        setIsLoading(true);
        try {
            const fetchedContacts = await getContacts({ listId });
            console.log('Fetched contacts:', fetchedContacts);
            setContacts(fetchedContacts);
        } catch (error) {
            console.error('Error fetching contacts:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <Box>
            <VStack align="stretch" spacing={6}>
                <Flex justifyContent="space-between" alignItems="center">
                    <Button
                        leftIcon={<Icon as={MdArrowBack} />}
                        variant="ghost"
                        colorScheme="purple"
                        onClick={() => navigate('/outreach-portal')}
                    >
                        Back to Lists
                    </Button>
                </Flex>

                <Box
                    bg={bgColor}
                    borderWidth="1px"
                    borderColor={borderColor}
                    borderRadius="lg"
                    overflow="hidden"
                >
                    <Table variant="simple">
                        <Thead>
                            <Tr>
                                <Th>Contact</Th>
                                <Th>Location</Th>
                                <Th>Available Touchpoints</Th>
                                <Th>Contact Status</Th>
                                <Th>Last Touchpoint</Th>
                                <Th isNumeric>Actions</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {isLoading ? (
                                Array.from({ length: 3 }).map((_, index) => (
                                    <Tr key={index}>
                                        <Td><Skeleton height="20px" width="200px" /></Td>
                                        <Td><Skeleton height="20px" width="150px" /></Td>
                                        <Td><Skeleton height="20px" width="150px" /></Td>
                                        <Td><Skeleton height="20px" width="100px" /></Td>
                                        <Td><Skeleton height="20px" width="200px" /></Td>
                                        <Td isNumeric><Skeleton height="20px" width="40px" /></Td>
                                    </Tr>
                                ))
                            ) : contacts.length === 0 ? (
                                <Tr>
                                    <Td colSpan={6}>
                                        <Text textAlign="center" color={textColor} py={4}>
                                            No contacts found in this list.
                                        </Text>
                                    </Td>
                                </Tr>
                            ) : (
                                contacts.map((contact) => (
                                    <Tr key={contact.id}>
                                        <Td>
                                            <Text fontWeight="medium">
                                                {contact.fullName || `${contact.firstName} ${contact.lastName}`.trim()}
                                            </Text>
                                            {contact.jobTitle && contact.jobTitle !== 'N/A' && (
                                                <Text fontSize="sm" color={textColor}>
                                                    {contact.jobTitle}
                                                </Text>
                                            )}
                                        </Td>
                                        <Td>
                                            <Flex align="center" gap={1}>
                                                <Icon as={MdLocationOn} color="gray.500" />
                                                <Text fontSize="sm">
                                                    {contact.location || '-'}
                                                </Text>
                                            </Flex>
                                        </Td>
                                        <Td>
                                            <HStack spacing={2} wrap="wrap">
                                                {(contact.availableChannels || []).map((channel, index) => {
                                                    let icon;
                                                    let url;
                                                    switch (channel) {
                                                        case 'email':
                                                            icon = MdEmail;
                                                            url = `mailto:${contact.email}`;
                                                            break;
                                                        case 'phone':
                                                            icon = MdPhone;
                                                            url = `tel:${contact.phone}`;
                                                            break;
                                                        case 'linkedin':
                                                            icon = FaLinkedin;
                                                            url = contact.linkedin;
                                                            break;
                                                        case 'instagram':
                                                            icon = FaInstagram;
                                                            url = contact.instagram;
                                                            break;
                                                        case 'facebook':
                                                            icon = FaFacebook;
                                                            url = contact.facebook;
                                                            break;
                                                        case 'twitter':
                                                            icon = FaTwitter;
                                                            url = contact.twitter;
                                                            break;
                                                        case 'tiktok':
                                                            icon = FaTiktok;
                                                            url = contact.tiktok;
                                                            break;
                                                        case 'whatsapp':
                                                            icon = FaWhatsapp;
                                                            url = `https://wa.me/${contact.whatsapp.replace(/\D/g, '')}`;
                                                            break;
                                                        default:
                                                            return null;
                                                    }
                                                    return (
                                                        <Link
                                                            key={index}
                                                            href={url}
                                                            isExternal
                                                            _hover={{ color: iconColor }}
                                                        >
                                                            <Icon
                                                                as={icon}
                                                                boxSize={5}
                                                                color="gray.500"
                                                                _hover={{ color: iconColor }}
                                                                title={url}
                                                            />
                                                        </Link>
                                                    );
                                                })}
                                            </HStack>
                                        </Td>
                                        <Td>
                                            <Badge
                                                colorScheme={contact.hasBeenContacted ? 'green' : 'yellow'}
                                                variant="subtle"
                                                px={2}
                                                py={1}
                                                borderRadius="full"
                                            >
                                                {contact.hasBeenContacted ? 'Contacted' : 'Not Contacted'}
                                            </Badge>
                                        </Td>
                                        <Td>
                                            <VStack align="start" spacing={0}>
                                                <Text fontSize="sm">
                                                    {formatDate(contact.lastTouchpointTime)}
                                                </Text>
                                                {contact.lastTouchpointChannel && (
                                                    <Text fontSize="xs" color={textColor}>
                                                        via {contact.lastTouchpointChannel}
                                                    </Text>
                                                )}
                                            </VStack>
                                        </Td>
                                        <Td isNumeric>
                                            <Menu>
                                                <MenuButton
                                                    as={IconButton}
                                                    icon={<MdMoreVert />}
                                                    variant="ghost"
                                                    size="sm"
                                                />
                                                <MenuList>
                                                    <MenuItem icon={<MdEdit />}>
                                                        Edit Contact
                                                    </MenuItem>
                                                    <MenuItem icon={<MdDelete />} color="red.500">
                                                        Delete Contact
                                                    </MenuItem>
                                                </MenuList>
                                            </Menu>
                                        </Td>
                                    </Tr>
                                ))
                            )}
                        </Tbody>
                    </Table>
                </Box>
            </VStack>
        </Box>
    );
};

export default ContactsTable; 