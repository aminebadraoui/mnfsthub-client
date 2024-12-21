import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Menu,
    MenuItem,
    ListItemIcon,
    Typography,
    Chip,
    Skeleton
} from '@mui/material';
import {
    MoreVert as MoreVertIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Email as EmailIcon,
    Phone as PhoneIcon
} from '@mui/icons-material';
import { getContacts } from '../../services/contacts.service';

const ContactsTable = () => {
    const { listId } = useParams();
    const [contacts, setContacts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const [selectedContact, setSelectedContact] = useState(null);

    useEffect(() => {
        fetchContacts();
    }, [listId]);

    const fetchContacts = async () => {
        setIsLoading(true);
        try {
            const fetchedContacts = await getContacts({ listId });
            setContacts(fetchedContacts);
        } catch (error) {
            console.error('Error fetching contacts:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleMenuOpen = (event, contact) => {
        setMenuAnchorEl(event.currentTarget);
        setSelectedContact(contact);
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
        setSelectedContact(null);
    };

    return (
        <Box>
            <TableContainer component={Paper} sx={{ borderRadius: 2, border: '1px solid #E9D8FD' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Contact Info</TableCell>
                            <TableCell>Channels</TableCell>
                            <TableCell>Campaigns</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {isLoading ? (
                            Array.from({ length: 3 }).map((_, index) => (
                                <TableRow key={index}>
                                    <TableCell><Skeleton width={150} /></TableCell>
                                    <TableCell><Skeleton width={200} /></TableCell>
                                    <TableCell><Skeleton width={100} /></TableCell>
                                    <TableCell><Skeleton width={150} /></TableCell>
                                    <TableCell align="right"><Skeleton width={40} /></TableCell>
                                </TableRow>
                            ))
                        ) : contacts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    <Typography sx={{ color: '#4A5568', py: 4 }}>
                                        No contacts found in this list.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            contacts.map((contact) => (
                                <TableRow key={contact.id} hover>
                                    <TableCell>
                                        <Typography variant="body1">
                                            {contact.firstName} {contact.lastName}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Box display="flex" flexDirection="column" gap={1}>
                                            {contact.email && (
                                                <Box display="flex" alignItems="center" gap={1}>
                                                    <EmailIcon sx={{ fontSize: 16, color: '#6B46C1' }} />
                                                    <Typography variant="body2">{contact.email}</Typography>
                                                </Box>
                                            )}
                                            {contact.phone && (
                                                <Box display="flex" alignItems="center" gap={1}>
                                                    <PhoneIcon sx={{ fontSize: 16, color: '#6B46C1' }} />
                                                    <Typography variant="body2">{contact.phone}</Typography>
                                                </Box>
                                            )}
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        {contact.channels ? (
                                            contact.channels.split(',').map((channel, index) => (
                                                <Chip
                                                    key={index}
                                                    label={channel.trim()}
                                                    size="small"
                                                    sx={{
                                                        m: 0.5,
                                                        bgcolor: '#F3E8FF',
                                                        color: '#6B46C1'
                                                    }}
                                                />
                                            ))
                                        ) : (
                                            '-'
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {contact.campaigns ? (
                                            contact.campaigns.split(',').map((campaign, index) => (
                                                <Chip
                                                    key={index}
                                                    label={campaign.trim()}
                                                    size="small"
                                                    sx={{
                                                        m: 0.5,
                                                        bgcolor: '#F3E8FF',
                                                        color: '#6B46C1'
                                                    }}
                                                />
                                            ))
                                        ) : (
                                            '-'
                                        )}
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton
                                            onClick={(e) => handleMenuOpen(e, contact)}
                                            sx={{ color: '#4A5568' }}
                                        >
                                            <MoreVertIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Menu
                anchorEl={menuAnchorEl}
                open={Boolean(menuAnchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <MenuItem onClick={handleMenuClose}>
                    <ListItemIcon>
                        <EditIcon fontSize="small" />
                    </ListItemIcon>
                    Edit Contact
                </MenuItem>
                <MenuItem onClick={handleMenuClose} sx={{ color: '#E53E3E' }}>
                    <ListItemIcon>
                        <DeleteIcon fontSize="small" sx={{ color: '#E53E3E' }} />
                    </ListItemIcon>
                    Delete Contact
                </MenuItem>
            </Menu>
        </Box>
    );
};

export default ContactsTable; 