import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Box,
    Typography,
    Button,
    Container,
    IconButton,
    Tooltip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Skeleton,
    Chip,
    Menu,
    MenuItem
} from '@mui/material';
import {
    Add as AddIcon,
    ArrowBack,
    MoreVert as MoreVertIcon,
    ArrowUpward as ArrowUpwardIcon,
    ArrowDownward as ArrowDownwardIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Download as DownloadIcon
} from '@mui/icons-material';
import AddProspectsModal from '../AddProspectsModal';
import ProcessingBanner from '../ProcessingBanner';
import ProcessingListsModal from '../ProcessingListsModal';
import ProcessingNotification from '../ProcessingNotification';
import { getLists } from '../../services/lists.service';

const Lists = () => {
    const navigate = useNavigate();
    const [lists, setLists] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [processingLists, setProcessingLists] = useState(new Map());
    const [showProcessingModal, setShowProcessingModal] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const [selectedList, setSelectedList] = useState(null);

    useEffect(() => {
        fetchLists();
    }, []);

    const fetchLists = async () => {
        setIsLoading(true);
        try {
            const response = await getLists();
            setLists(response);
        } catch (error) {
            console.error('Error fetching lists:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleListClick = (listId, listName) => {
        navigate(`/outreach-portal/lists/${listId}`, { state: { listName } });
    };

    const handleAddProspects = (listName) => {
        const processingList = {
            name: listName,
            startTime: new Date().toISOString()
        };
        setProcessingLists(prev => new Map(prev.set(listName, processingList)));

        setTimeout(() => {
            setProcessingLists(prev => {
                const newMap = new Map(prev);
                newMap.delete(listName);
                return newMap;
            });
            setShowNotification(true);
            setNotificationMessage(`List "${listName}" has been processed successfully`);
            fetchLists();
        }, 5000);
    };

    const handleListCreated = () => {
        fetchLists();
    };

    const handleSort = (key) => {
        const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
        setSortConfig({ key, direction });
    };

    const sortedLists = [...lists].sort((a, b) => {
        if (sortConfig.key === 'name') {
            return sortConfig.direction === 'asc'
                ? a.name.localeCompare(b.name)
                : b.name.localeCompare(a.name);
        }
        if (sortConfig.key === 'count') {
            return sortConfig.direction === 'asc'
                ? a.count - b.count
                : b.count - a.count;
        }
        return 0;
    });

    const handleMenuOpen = (event, list) => {
        event.stopPropagation();
        setSelectedList(list);
        setMenuAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
        setSelectedList(null);
    };

    const SortIcon = ({ columnKey }) => {
        if (sortConfig.key !== columnKey) return null;
        return sortConfig.direction === 'asc' ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />;
    };

    return (
        <Container>
            {processingLists.size > 0 && (
                <ProcessingBanner
                    count={processingLists.size}
                    onClick={() => setShowProcessingModal(true)}
                />
            )}

            <ProcessingListsModal
                open={showProcessingModal}
                onClose={() => setShowProcessingModal(false)}
                processingLists={processingLists}
            />

            <ProcessingNotification
                open={showNotification}
                message={notificationMessage}
                onClose={() => setShowNotification(false)}
            />

            <Box sx={{ mb: 4 }}>
                <Box display="flex" alignItems="center" mb={1}>
                    <IconButton
                        component={Link}
                        to="/outreach-portal"
                        sx={{
                            mr: 2,
                            color: '#6B46C1',
                            '&:hover': {
                                bgcolor: '#F3E8FF'
                            }
                        }}
                    >
                        <ArrowBack />
                    </IconButton>
                    <Typography variant="h4" component="h1" sx={{ color: '#2D3748', fontWeight: 600 }}>
                        Lists
                    </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="body1" sx={{ color: '#4A5568' }}>
                        Manage your prospect lists and add new contacts
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setIsModalOpen(true)}
                        sx={{
                            bgcolor: '#6B46C1',
                            '&:hover': {
                                bgcolor: '#553C9A'
                            }
                        }}
                    >
                        Add Prospects
                    </Button>
                </Box>
            </Box>

            <AddProspectsModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                lists={lists}
                onListCreated={handleListCreated}
                onProspectsAdded={handleAddProspects}
                processingLists={processingLists}
            />

            <TableContainer component={Paper} sx={{
                border: '1px solid #E9D8FD',
                borderRadius: 2,
                boxShadow: 'none'
            }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ bgcolor: '#F3E8FF' }}>
                            <TableCell
                                onClick={() => handleSort('name')}
                                sx={{
                                    cursor: 'pointer',
                                    fontWeight: 600,
                                    color: '#2D3748',
                                    '&:hover': { bgcolor: '#E9D8FD' }
                                }}
                            >
                                <Box display="flex" alignItems="center">
                                    List Name
                                    <SortIcon columnKey="name" />
                                </Box>
                            </TableCell>
                            <TableCell
                                onClick={() => handleSort('count')}
                                sx={{
                                    cursor: 'pointer',
                                    fontWeight: 600,
                                    color: '#2D3748',
                                    '&:hover': { bgcolor: '#E9D8FD' }
                                }}
                            >
                                <Box display="flex" alignItems="center">
                                    Prospects
                                    <SortIcon columnKey="count" />
                                </Box>
                            </TableCell>
                            <TableCell sx={{ fontWeight: 600, color: '#2D3748' }}>Tags</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600, color: '#2D3748' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {isLoading ? (
                            Array.from(new Array(5)).map((_, index) => (
                                <TableRow key={index}>
                                    <TableCell><Skeleton /></TableCell>
                                    <TableCell><Skeleton /></TableCell>
                                    <TableCell><Skeleton /></TableCell>
                                    <TableCell><Skeleton /></TableCell>
                                </TableRow>
                            ))
                        ) : lists.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center" sx={{ py: 8 }}>
                                    <Typography variant="h6" gutterBottom sx={{ color: '#2D3748' }}>
                                        No Lists Yet
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#4A5568', mb: 3 }}>
                                        Create your first list to start managing your prospects
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        startIcon={<AddIcon />}
                                        onClick={() => setIsModalOpen(true)}
                                        sx={{
                                            bgcolor: '#6B46C1',
                                            '&:hover': {
                                                bgcolor: '#553C9A'
                                            }
                                        }}
                                    >
                                        Add Prospects
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ) : (
                            sortedLists.map((list) => (
                                <TableRow
                                    key={list.id}
                                    hover
                                    onClick={() => handleListClick(list.id, list.name)}
                                    sx={{
                                        cursor: 'pointer',
                                        '&:hover': { bgcolor: '#F3E8FF' }
                                    }}
                                >
                                    <TableCell sx={{ color: '#2D3748', fontWeight: 500 }}>
                                        {list.name}
                                    </TableCell>
                                    <TableCell sx={{ color: '#4A5568' }}>
                                        {list.count} prospects
                                    </TableCell>
                                    <TableCell>
                                        <Box display="flex" flexWrap="wrap" gap={0.5}>
                                            {list.tags && list.tags.split(',').map((tag, index) => (
                                                <Chip
                                                    key={index}
                                                    label={tag.trim()}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: '#F3E8FF',
                                                        color: '#6B46C1',
                                                        '&:hover': {
                                                            bgcolor: '#E9D8FD'
                                                        }
                                                    }}
                                                />
                                            ))}
                                        </Box>
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton
                                            size="small"
                                            onClick={(e) => handleMenuOpen(e, list)}
                                            sx={{ color: '#6B46C1' }}
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
                    <EditIcon fontSize="small" sx={{ mr: 1 }} />
                    Edit List
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                    <DownloadIcon fontSize="small" sx={{ mr: 1 }} />
                    Export List
                </MenuItem>
                <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
                    <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                    Delete List
                </MenuItem>
            </Menu>
        </Container>
    );
};

export default Lists; 