import React from 'react';
import {
    Box,
    VStack,
    List,
    ListItem,
    Text,
    Divider,
    Icon,
    useColorModeValue,
    useBreakpointValue,
} from '@chakra-ui/react';
import { MdDashboard, MdPerson, MdLogout, MdTimeline } from 'react-icons/md';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../../stores/authStore';

const Navigation = () => {
    const isMobile = useBreakpointValue({ base: true, md: false });
    const navigate = useNavigate();
    const location = useLocation();
    const logout = useAuthStore(state => state.logout);

    const bgHover = useColorModeValue('purple.50', 'purple.900');
    const textColor = useColorModeValue('gray.800', 'white');
    const borderColor = useColorModeValue('gray.200', 'gray.600');
    const bgColor = useColorModeValue('white', 'gray.800');
    const activeColor = useColorModeValue('purple.600', 'purple.200');
    const activeBg = useColorModeValue('purple.50', 'purple.900');

    const mainMenuItems = [
        { text: "Dashboard", icon: MdDashboard, path: "/" },
        { text: "Outreach Portal", path: "/outreach-portal" },
        { text: "Marketing Portal", path: "/marketing-portal" },
        { text: "Sales Portal", path: "/sales-portal" },
        { text: "Customer Experience Portal", path: "/cx-portal" },
        { text: "Knowledge Base", path: "/knowledge-base" },
        { text: "Workflow Tracker", icon: MdTimeline, path: "workflows" }
    ];

    const bottomMenuItems = [
        { text: "Profile", icon: MdPerson, path: "/profile" }
    ];

    const handleLogout = () => {
        logout();
        navigate('/signin');
    };

    const MenuList = ({ items }) => (
        <List w="100%" spacing={0}>
            {items.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                    <ListItem key={item.text}>
                        <Box
                            as={Link}
                            to={item.path}
                            display="flex"
                            alignItems="center"
                            py={2}
                            px={4}
                            color={isActive ? activeColor : textColor}
                            bg={isActive ? activeBg : 'transparent'}
                            fontSize="sm"
                            _hover={{
                                bg: bgHover,
                                color: activeColor,
                                textDecoration: 'none',
                            }}
                            transition="all 0.2s"
                        >
                            {item.icon && (
                                <Icon
                                    as={item.icon}
                                    boxSize={4}
                                    mr={2}
                                />
                            )}
                            <Text ml={item.icon ? 0 : 6}>{item.text}</Text>
                        </Box>
                    </ListItem>
                );
            })}
        </List>
    );

    return (
        <Box
            h="100vh"
            w="100%"
            bg={bgColor}
            borderRight="1px"
            borderColor={borderColor}
            display={isMobile ? 'none' : 'block'}
        >
            <VStack h="100%" spacing={0} pt={10}>
                <Box flex="1" w="100%">
                    <MenuList items={mainMenuItems} />
                </Box>
                <Divider borderColor={borderColor} />
                <Box w="100%">
                    <MenuList items={bottomMenuItems} />
                    <Box
                        as="button"
                        onClick={handleLogout}
                        display="flex"
                        alignItems="center"
                        w="100%"
                        py={2}
                        px={4}
                        color={textColor}
                        fontSize="sm"
                        _hover={{
                            bg: bgHover,
                            color: activeColor,
                        }}
                        transition="all 0.2s"
                    >
                        <Icon as={MdLogout} boxSize={4} mr={2} />
                        <Text>Logout</Text>
                    </Box>
                </Box>
            </VStack>
        </Box>
    );
};

export default Navigation; 