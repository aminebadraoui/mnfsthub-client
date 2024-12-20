import React from 'react';
import { Box, List, ListItem, ListItemText, Drawer, Divider, useMediaQuery, useTheme } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link } from 'react-router-dom';

const DRAWER_WIDTH = 240;

const Navigation = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const mainMenuItems = [
        { text: "Dashboard", icon: <DashboardIcon sx={{ fontSize: 18, color: '#E9D8FD' }} />, path: "/" },
        { text: "Outreach Portal", icon: null, path: "/outreach-portal" },
        { text: "Marketing Portal", icon: null, path: "/marketing-portal" },
        { text: "Sales Portal", icon: null, path: "/sales-portal" },
        { text: "Customer Experience Portal", icon: null, path: "/cx-portal" },
        { text: "Knowledge Base", icon: null, path: "/knowledge-base" }
    ];

    const bottomMenuItems = [
        { text: "Profile", icon: <PersonIcon sx={{ fontSize: 18, color: '#E9D8FD' }} />, path: "/profile" },
        { text: "Logout", icon: <LogoutIcon sx={{ fontSize: 18, color: '#E9D8FD' }} />, path: "/logout" }
    ];

    const MenuList = ({ items }) => (
        <List>
            {items.map((item) => (
                <ListItem
                    key={item.text}
                    component={Link}
                    to={item.path}
                    sx={{
                        py: 0.75,
                        px: 2,
                        color: 'inherit',
                        textDecoration: 'none',
                        '&:hover': {
                            bgcolor: '#553C9A',
                            '& .MuiListItemText-primary': {
                                color: '#E9D8FD'
                            },
                            '& .MuiSvgIcon-root': {
                                color: '#E9D8FD'
                            }
                        }
                    }}
                >
                    {item.icon && <Box sx={{ mr: 2 }}>{item.icon}</Box>}
                    <ListItemText
                        primary={item.text}
                        sx={{
                            ml: item.icon ? 0 : 1,
                            '& .MuiListItemText-primary': {
                                fontSize: '13px',
                                color: '#E9D8FD',
                                transition: 'color 0.2s'
                            }
                        }}
                    />
                </ListItem>
            ))}
        </List>
    );

    return (
        <Drawer
            variant={isMobile ? "temporary" : "permanent"}
            open={!isMobile}
            sx={{
                width: DRAWER_WIDTH,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: DRAWER_WIDTH,
                    boxSizing: 'border-box',
                    bgcolor: '#2D1B69',
                    borderRight: 'none',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    height: '100vh',
                    pt: '40px',
                    display: 'flex',
                    flexDirection: 'column',
                    '& .MuiList-root': {
                        padding: 0
                    }
                },
            }}
        >
            <Box sx={{ flexGrow: 1 }}>
                <MenuList items={mainMenuItems} />
            </Box>
            <Divider sx={{ borderColor: '#553C9A' }} />
            <MenuList items={bottomMenuItems} />
        </Drawer>
    );
};

export default Navigation; 