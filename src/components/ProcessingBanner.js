import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import SyncIcon from '@mui/icons-material/Sync';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const ProcessingBanner = ({ count, onClick }) => {
    if (!count || count === 0) return null;

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                bgcolor: '#6B46C1',
                color: 'white',
                py: 1,
                px: 2,
                mb: 3,
                borderRadius: 1,
                cursor: 'pointer',
            }}
            onClick={onClick}
        >
            <SyncIcon
                sx={{
                    animation: 'spin 2s linear infinite',
                    '@keyframes spin': {
                        '0%': {
                            transform: 'rotate(0deg)',
                        },
                        '100%': {
                            transform: 'rotate(360deg)',
                        },
                    },
                }}
            />
            <Typography>
                {count} {count === 1 ? 'list' : 'lists'} currently processing
            </Typography>
            <ExpandMoreIcon />
        </Box>
    );
};

export default ProcessingBanner; 