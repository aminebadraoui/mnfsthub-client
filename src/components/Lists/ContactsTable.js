import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import {
    Box,
    Typography,
    Link as MuiLink,
    Chip,
    IconButton,
    Tooltip,
    Stack
} from '@mui/material';
import DataTable from 'react-data-table-component';
import baserowService from '../../services/baserow.service';
import ArrowBack from '@mui/icons-material/ArrowBack';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import { Link } from 'react-router-dom';

const ContactsTable = () => {
    const { id: listId } = useParams();
    const location = useLocation();
    const listName = location.state?.listName;

    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(25);

    const fetchContacts = async (page) => {
        setLoading(true);
        try {
            const tenantId = localStorage.getItem('tenantId');
            const response = await baserowService.getContacts({
                filters: {
                    'Tenant ID': tenantId,
                    'List Name': listName
                },
                page: page,
                size: perPage
            });
            setContacts(response.results);
            setTotalRows(response.count);
        } catch (error) {
            console.error('Error fetching contacts:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (listName) {
            fetchContacts(1);
        }
    }, [listName, perPage]);

    const handlePageChange = page => {
        fetchContacts(page);
    };

    const handlePerRowsChange = async (newPerPage, page) => {
        setLoading(true);
        try {
            const tenantId = localStorage.getItem('tenantId');
            const response = await baserowService.getContacts({
                filters: {
                    'Tenant ID': tenantId,
                    'List Name': listName
                },
                page: page,
                size: newPerPage
            });
            setContacts(response.results);
            setPerPage(newPerPage);
        } catch (error) {
            console.error('Error fetching contacts:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderTouchpoints = (row) => {
        const touchpoints = [];

        if (row['Linkedin']) {
            touchpoints.push(
                <Tooltip title="LinkedIn" key="linkedin">
                    <IconButton
                        size="small"
                        href={row['Linkedin'].startsWith('http') ? row['Linkedin'] : `http://www.linkedin.com/in/${row['Linkedin']}`}
                        target="_blank"
                        sx={{ color: '#6B46C1' }}
                    >
                        <LinkedInIcon />
                    </IconButton>
                </Tooltip>
            );
        }

        if (row['Email'] && row['Email'] !== 'No email') {
            touchpoints.push(
                <Tooltip title="Email" key="email">
                    <IconButton
                        size="small"
                        href={`mailto:${row['Email']}`}
                        sx={{ color: '#6B46C1' }}
                    >
                        <EmailIcon />
                    </IconButton>
                </Tooltip>
            );
        }

        if (row['Phone'] && !row['Phone'].includes('Request')) {
            touchpoints.push(
                <Tooltip title="Phone" key="phone">
                    <IconButton
                        size="small"
                        href={`tel:${formatPhoneNumber(row['Phone'])}`}
                        sx={{ color: '#6B46C1' }}
                    >
                        <PhoneIcon />
                    </IconButton>
                </Tooltip>
            );
        }

        if (row['Instagram']) {
            touchpoints.push(
                <Tooltip title="Instagram" key="instagram">
                    <IconButton
                        size="small"
                        href={row['Instagram']}
                        target="_blank"
                        sx={{ color: '#6B46C1' }}
                    >
                        <InstagramIcon />
                    </IconButton>
                </Tooltip>
            );
        }

        if (row['Facebook']) {
            touchpoints.push(
                <Tooltip title="Facebook" key="facebook">
                    <IconButton
                        size="small"
                        href={row['Facebook']}
                        target="_blank"
                        sx={{ color: '#6B46C1' }}
                    >
                        <FacebookIcon />
                    </IconButton>
                </Tooltip>
            );
        }

        if (row['Twitter']) {
            touchpoints.push(
                <Tooltip title="Twitter" key="twitter">
                    <IconButton
                        size="small"
                        href={row['Twitter']}
                        target="_blank"
                        sx={{ color: '#6B46C1' }}
                    >
                        <TwitterIcon />
                    </IconButton>
                </Tooltip>
            );
        }

        return touchpoints.length ? (
            <Stack direction="row" spacing={1}>
                {touchpoints}
            </Stack>
        ) : (
            <Chip label="No touchpoints" size="small" sx={{
                bgcolor: '#EDF2F7',
                color: '#718096',
                fontSize: '0.75rem'
            }} />
        );
    };

    const formatPhoneNumber = (phone) => {
        if (!phone) return phone;
        if (phone === 'Request phone number') return null;
        const cleaned = phone.replace(/[^\d+]/g, '');
        if (cleaned.startsWith('+')) return cleaned;
        if (cleaned.length === 10) return `+1${cleaned}`;
        return cleaned.startsWith('+') ? cleaned : `+${cleaned}`;
    };

    const renderCell = (value, type) => {
        if (!value || value === '' || value === 'No email' || value.includes('Request')) {
            return <Chip label="No data" size="small" sx={{
                bgcolor: '#EDF2F7',
                color: '#718096',
                fontSize: '0.75rem'
            }} />;
        }

        if (type === 'name') {
            return <Typography sx={{
                fontWeight: 600,
                color: '#2D3748'
            }}>{value}</Typography>;
        }

        if (type === 'campaign') {
            return <Chip
                label={value}
                size="small"
                sx={{
                    bgcolor: '#F3E8FF',
                    color: '#6B46C1',
                    fontWeight: 500,
                    fontSize: '0.75rem'
                }}
            />;
        }

        if (type === 'time') {
            return <Typography sx={{
                color: '#6B46C1',
                fontSize: '0.875rem',
                fontWeight: 500
            }}>{value}</Typography>;
        }

        return <span style={{ color: '#2D3748' }}>{value}</span>;
    };

    const columns = [
        {
            name: 'Full Name',
            selector: row => row['Full name'],
            sortable: true,
            cell: row => renderCell(row['Full name'], 'name'),
            grow: 1.2,
        },
        {
            name: 'Company',
            selector: row => row['Company'],
            sortable: true,
            cell: row => renderCell(row['Company'], 'text'),
            grow: 1.2,
        },
        {
            name: 'Job Title',
            selector: row => row['Job title'],
            sortable: true,
            cell: row => renderCell(row['Job title'], 'text'),
            grow: 1.2,
        },
        {
            name: 'Location',
            selector: row => row['Location'],
            sortable: true,
            cell: row => renderCell(row['Location'], 'text'),
            grow: 1,
        },
        {
            name: 'Available Touchpoints',
            cell: renderTouchpoints,
            grow: 1.5,
        },
        {
            name: 'Last Campaign',
            selector: row => row['Last Campaign'] || 'None',
            sortable: true,
            cell: row => renderCell(row['Last Campaign'] || 'None', 'campaign'),
            grow: 1,
        },
        {
            name: 'Last Time Contacted',
            selector: row => row['Last Contacted'] || 'Never',
            sortable: true,
            cell: row => renderCell(row['Last Contacted'] || 'Never', 'time'),
            grow: 1,
        },
        {
            name: 'Last Touchpoint',
            selector: row => row['Last Touchpoint'] || 'None',
            sortable: true,
            cell: row => renderCell(row['Last Touchpoint'] || 'None', 'text'),
            grow: 1,
        },
    ];

    const customStyles = {
        header: {
            style: {
                fontSize: '1.25rem',
                fontWeight: 500,
                paddingLeft: '1rem',
                paddingRight: '1rem',
            },
        },
        headRow: {
            style: {
                backgroundColor: '#F8F9FA',
                borderBottomWidth: '2px',
                borderBottomColor: '#E2E8F0',
                fontWeight: 600,
            },
        },
        headCells: {
            style: {
                color: '#4A5568',
                fontSize: '0.875rem',
            },
        },
        cells: {
            style: {
                paddingLeft: '8px',
                paddingRight: '8px',
                wordBreak: 'break-word',
                fontSize: '0.875rem',
            },
        },
        rows: {
            style: {
                minHeight: '72px',
                '&:nth-of-type(odd)': {
                    backgroundColor: '#F7FAFC',
                },
                '&:hover': {
                    backgroundColor: '#F7FAFC',
                    cursor: 'pointer',
                },
            },
        },
    };

    return (
        <Box>
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <IconButton
                    component={Link}
                    to="/outreach-portal/lists"
                    sx={{
                        mr: 2,
                        color: '#6B46C1',
                        '&:hover': {
                            backgroundColor: '#F3E8FF',
                        },
                    }}
                >
                    <ArrowBack />
                </IconButton>
                <Typography variant="h5" component="h2" sx={{ mr: 2, color: '#2D3748' }}>
                    {listName}
                </Typography>
                <Typography variant="h5" component="span" sx={{ color: '#6B46C1' }}>
                    ({totalRows})
                </Typography>
            </Box>

            <DataTable
                columns={columns}
                data={contacts}
                progressPending={loading}
                pagination
                paginationServer
                paginationTotalRows={totalRows}
                onChangeRowsPerPage={handlePerRowsChange}
                onChangePage={handlePageChange}
                persistTableHead
                customStyles={customStyles}
                highlightOnHover
                pointerOnHover
                noDataComponent={
                    <Box sx={{ p: 4, textAlign: 'center', color: '#718096' }}>
                        No contacts found
                    </Box>
                }
            />
        </Box>
    );
};

export default ContactsTable; 