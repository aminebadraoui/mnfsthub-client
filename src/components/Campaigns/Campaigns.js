import React, { useState } from 'react';
import {
    Box,
    Typography,
    Tabs,
    Tab,
    Paper,
    Chip,
    IconButton,
    Stack
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';

const Campaigns = () => {
    const [activeTab, setActiveTab] = useState(0);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const campaigns = [
        {
            name: "CEOs in Dubai",
            status: "Active",
            list: "ceo dubai",
            channels: ["email", "phone", "linkedin", "facebook", "instagram", "twitter"]
        }
    ];

    const renderChannelIcons = (channels) => {
        const iconMap = {
            email: <EmailIcon />,
            phone: <PhoneIcon />,
            linkedin: <LinkedInIcon />,
            facebook: <FacebookIcon />,
            instagram: <InstagramIcon />,
            twitter: <TwitterIcon />
        };

        return (
            <Stack direction="row" spacing={1}>
                {channels.map(channel => (
                    <IconButton
                        key={channel}
                        size="small"
                        sx={{
                            color: '#6B46C1',
                            '&:hover': {
                                bgcolor: '#F3E8FF'
                            }
                        }}
                    >
                        {iconMap[channel]}
                    </IconButton>
                ))}
            </Stack>
        );
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom sx={{ color: '#2D3748', fontWeight: 600, mb: 4 }}>
                Campaigns
            </Typography>

            <Tabs
                value={activeTab}
                onChange={handleTabChange}
                sx={{
                    mb: 4,
                    '& .MuiTab-root': {
                        color: '#4A5568',
                        '&.Mui-selected': {
                            color: '#6B46C1'
                        }
                    },
                    '& .MuiTabs-indicator': {
                        backgroundColor: '#6B46C1'
                    }
                }}
            >
                <Tab
                    label="ACTIVE CAMPAIGNS"
                    sx={{
                        fontWeight: 600,
                        fontSize: '0.875rem'
                    }}
                />
                <Tab
                    label="PAST CAMPAIGNS"
                    sx={{
                        fontWeight: 600,
                        fontSize: '0.875rem'
                    }}
                />
            </Tabs>

            {activeTab === 0 && (
                <Box>
                    {campaigns.map((campaign) => (
                        <Paper
                            key={campaign.name}
                            sx={{
                                p: 3,
                                mb: 2,
                                borderRadius: 2,
                                border: '1px solid #E9D8FD',
                                cursor: 'pointer',
                                '&:hover': {
                                    boxShadow: '0 4px 6px -1px rgba(107, 70, 193, 0.1), 0 2px 4px -1px rgba(107, 70, 193, 0.06)',
                                    bgcolor: '#FAFAFA'
                                }
                            }}
                        >
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="h6" gutterBottom sx={{ color: '#2D3748', fontWeight: 600 }}>
                                    {campaign.name}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                    <Chip
                                        label={campaign.status}
                                        size="small"
                                        sx={{
                                            bgcolor: '#F3E8FF',
                                            color: '#6B46C1',
                                            fontWeight: 500
                                        }}
                                    />
                                    <Chip
                                        label={`List: ${campaign.list}`}
                                        size="small"
                                        sx={{
                                            bgcolor: '#F3E8FF',
                                            color: '#6B46C1',
                                            fontWeight: 500
                                        }}
                                    />
                                </Box>
                            </Box>
                            {renderChannelIcons(campaign.channels)}
                        </Paper>
                    ))}
                </Box>
            )}

            {activeTab === 1 && (
                <Box sx={{ textAlign: 'center', color: '#4A5568', mt: 4 }}>
                    No past campaigns to show.
                </Box>
            )}
        </Box>
    );
};

export default Campaigns; 