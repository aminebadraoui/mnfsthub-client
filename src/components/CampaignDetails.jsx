import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import {
    Mail,
    ArrowLeft,
    Linkedin,
    Phone,
    MessageSquare,
    Calendar,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Clock4,
    Send,
    MessageCircle,
    ThumbsUp,
    ThumbsDown,
    ChevronRight,
    Users,
    CheckCircle,
    X
} from 'lucide-react';

const CampaignDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [selectedChannel, setSelectedChannel] = useState('all');
    const [selectedProspect, setSelectedProspect] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        console.log('Campaign UUID:', id);
        setIsLoading(false);
    }, [id]);

    // Mock data - replace with API call later
    const campaign = {
        id: 1,
        name: 'Reach out to CEOs in Dubai',
        status: 'active',
        startDate: '2024-03-01',
        endDate: '2024-04-30',
        list: 'ceo dubai',
        totalProspects: 130,
        progress: {
            contacted: 85,
            responded: 32,
            meetings: 12,
            notInterested: 18,
            pending: 45
        },
        channels: {
            email: {
                sent: 85,
                opened: 60,
                replied: 25,
                bounced: 5,
                meetings: 8,
                conversion: {
                    openRate: 70.5,
                    replyRate: 29.4,
                    meetingRate: 9.4
                }
            },
            linkedin: {
                sent: 65,
                accepted: 40,
                responded: 20,
                meetings: 4,
                conversion: {
                    acceptRate: 61.5,
                    responseRate: 30.7,
                    meetingRate: 6.2
                }
            },
            phone: {
                attempted: 45,
                connected: 20,
                interested: 12,
                meetings: 6,
                conversion: {
                    connectRate: 44.4,
                    interestRate: 26.7,
                    meetingRate: 13.3
                }
            }
        },
        recentActivity: [
            {
                id: 1,
                type: 'email_opened',
                prospect: 'Ahmed K.',
                company: 'Dubai Tech',
                time: '2 hours ago',
                channel: 'email'
            },
            {
                id: 2,
                type: 'linkedin_accepted',
                prospect: 'Mohammed R.',
                company: 'Innovation Hub',
                time: '3 hours ago',
                channel: 'linkedin'
            },
            {
                id: 3,
                type: 'meeting_scheduled',
                prospect: 'Sarah M.',
                company: 'Future Group',
                time: '5 hours ago',
                channel: 'phone'
            }
        ]
    };

    const channelIcons = {
        email: <Mail className="w-5 h-5" />,
        linkedin: <Linkedin className="w-5 h-5" />,
        phone: <Phone className="w-5 h-5" />,
        all: <MessageSquare className="w-5 h-5" />
    };

    const StatCard = ({ title, value, icon: Icon, trend = null }) => (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500 text-sm">{title}</span>
                <Icon className="w-5 h-5 text-gray-400" />
            </div>
            <div className="text-2xl font-semibold">{value}</div>
            {trend && (
                <div className={`text-sm mt-2 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {trend > 0 ? '+' : ''}{trend}% vs last week
                </div>
            )}
        </div>
    );

    const ActivityItem = ({ activity }) => {
        const getActivityIcon = (type) => {
            switch (type) {
                case 'email_opened':
                    return <Mail className="w-4 h-4 text-blue-500" />;
                case 'linkedin_accepted':
                    return <Linkedin className="w-4 h-4 text-blue-700" />;
                case 'meeting_scheduled':
                    return <Calendar className="w-4 h-4 text-green-500" />;
                default:
                    return <MessageSquare className="w-4 h-4 text-gray-500" />;
            }
        };

        return (
            <div className="flex items-center gap-4 py-3">
                {getActivityIcon(activity.type)}
                <div className="flex-1">
                    <p className="text-sm font-medium">
                        {activity.prospect} • <span className="text-gray-600">{activity.company}</span>
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
        );
    };

    const ProspectStatus = {
        PENDING: 'pending',
        CONTACTED: 'contacted',
        RESPONDED: 'responded',
        INTERESTED: 'interested',
        NOT_INTERESTED: 'not_interested',
        MEETING_SCHEDULED: 'meeting_scheduled',
        CONVERTED: 'converted'
    };

    const StatusBadge = ({ status }) => {
        const statusConfig = {
            [ProspectStatus.PENDING]: {
                color: 'bg-gray-100 text-gray-600',
                icon: Clock4
            },
            [ProspectStatus.CONTACTED]: {
                color: 'bg-blue-100 text-blue-600',
                icon: Send
            },
            [ProspectStatus.RESPONDED]: {
                color: 'bg-purple-100 text-purple-600',
                icon: MessageCircle
            },
            [ProspectStatus.INTERESTED]: {
                color: 'bg-green-100 text-green-600',
                icon: ThumbsUp
            },
            [ProspectStatus.NOT_INTERESTED]: {
                color: 'bg-red-100 text-red-600',
                icon: ThumbsDown
            },
            [ProspectStatus.MEETING_SCHEDULED]: {
                color: 'bg-emerald-100 text-emerald-600',
                icon: Calendar
            },
            [ProspectStatus.CONVERTED]: {
                color: 'bg-yellow-100 text-yellow-600',
                icon: CheckCircle2
            }
        };

        const config = statusConfig[status];
        const Icon = config.icon;

        return (
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
                <Icon className="w-3.5 h-3.5" />
                <span>{status.replace('_', ' ').toLowerCase()}</span>
            </div>
        );
    };

    // Add this component for the message sequence timeline
    const MessageSequenceDrawer = ({ prospect, channel, onClose }) => {
        const [selectedMessage, setSelectedMessage] = useState(null);
        const [viewingTemplate, setViewingTemplate] = useState(false);

        // Channel-specific sequence templates
        const sequenceTemplates = {
            email: [
                {
                    day: 1,
                    subject: "Introduction and Value Proposition",
                    template: `Hi {{firstName}},

I noticed your work at {{company}} and was particularly impressed with your role in {{industry}}.

[Value Proposition]

Would you be open to a brief conversation about how we could potentially collaborate?

Best regards,
[Your Name]`
                },
                {
                    day: 3,
                    subject: "Following up - Additional Value Points",
                    template: "..."
                },
                {
                    day: 7,
                    subject: "Case Study: Results in Your Industry",
                    template: "..."
                },
                {
                    day: 14,
                    subject: "Quick Question",
                    template: "..."
                },
                {
                    day: 21,
                    subject: "Final Follow-up",
                    template: "..."
                },
                {
                    day: 30,
                    subject: "Permission to Close File",
                    template: "..."
                }
            ],
            linkedin: [
                {
                    day: 1,
                    template: "Connection request: Hi {{firstName}}, I noticed your work in {{industry}}..."
                },
                {
                    day: 2,
                    template: "Thanks for connecting! I wanted to share..."
                },
                {
                    day: 5,
                    template: "Final outreach: Would you be interested in..."
                }
            ],
            phone: [
                {
                    day: 1,
                    template: "Initial Call Script:\n- Intro\n- Handle gatekeeper\n- Value prop\n- Meeting request",
                    retryConditions: {
                        noAnswer: "Try again in 2 business days",
                        voicemail: "Leave message and follow up in 3 days",
                        gatekeeper: "Note gatekeeper name and try different time"
                    }
                }
            ]
        };

        // Message content viewer modal
        const MessageViewer = ({ message, onClose }) => (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg w-[800px] max-h-[80vh] flex flex-col">
                    <div className="p-6 border-b flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-semibold">
                                {message.subject || message.type.charAt(0).toUpperCase() + message.type.slice(1)}
                            </h3>
                            <p className="text-sm text-gray-500">{message.date} at {message.time}</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="p-6 overflow-y-auto">
                        {message.type === 'email' && (
                            <>
                                <div className="mb-4">
                                    <p className="text-sm text-gray-500">From: Your Name</p>
                                    <p className="text-sm text-gray-500">To: {prospect.name}</p>
                                    <p className="text-sm text-gray-500">Subject: {message.subject}</p>
                                </div>
                                <div className="prose max-w-none">
                                    <pre className="whitespace-pre-wrap font-sans">{message.content}</pre>
                                </div>
                                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">Metrics</h4>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Opens</p>
                                            <p className="text-lg font-medium">{message.metrics.openCount}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Clicks</p>
                                            <p className="text-lg font-medium">{message.metrics.clicked ? 'Yes' : 'No'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Replied</p>
                                            <p className="text-lg font-medium">{message.metrics.replied ? 'Yes' : 'No'}</p>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                        {message.type === 'phone' && (
                            <div className="space-y-4">
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <h4 className="font-medium mb-2">Call Notes</h4>
                                    <p className="text-gray-600">{message.content}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <h4 className="font-medium mb-2">Call Details</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Duration</p>
                                            <p className="font-medium">{message.metrics.duration}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Outcome</p>
                                            <p className="font-medium">{message.metrics.outcome}</p>
                                        </div>
                                    </div>
                                </div>
                                {message.metrics.outcome === 'Voicemail left' && (
                                    <div className="p-4 bg-yellow-50 rounded-lg">
                                        <h4 className="font-medium text-yellow-800 mb-2">Follow-up Required</h4>
                                        <p className="text-yellow-700">Schedule follow-up call in 3 business days</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="p-6 border-t bg-gray-50">
                        <div className="flex justify-end gap-3">
                            {message.type === 'email' && (
                                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                    Send Follow-up
                                </button>
                            )}
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-gray-700 border rounded-lg hover:bg-gray-50"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );

        const getMessageIcon = (type) => {
            switch (type) {
                case 'email':
                    return <Mail className="w-4 h-4" />;
                case 'linkedin':
                    return <Linkedin className="w-4 h-4" />;
                case 'phone':
                    return <Phone className="w-4 h-4" />;
                default:
                    return <MessageSquare className="w-4 h-4" />;
            }
        };

        return (
            <div className="fixed inset-y-0 right-0 w-[500px] bg-white shadow-xl border-l transform transition-transform duration-200 ease-in-out z-50">
                <div className="h-full flex flex-col">
                    {/* Header */}
                    <div className="p-6 border-b">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h2 className="text-xl font-semibold">{prospect.name}</h2>
                                <p className="text-sm text-gray-600">{prospect.company}</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="flex items-center gap-4">
                            <StatusBadge status={prospect.status} />
                            <span className="text-sm text-gray-500">
                                Sequence: Step {prospect.sequence.currentStep} of {prospect.sequence.totalSteps}
                            </span>
                        </div>
                    </div>

                    {/* Sequence Timeline */}
                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="space-y-6">
                            {sequenceTemplates[channel === 'all' ? 'email' : channel]?.map((step, index) => {
                                const isPast = index + 1 < prospect.sequence.currentStep;
                                const isCurrent = index + 1 === prospect.sequence.currentStep;
                                const isFuture = index + 1 > prospect.sequence.currentStep;

                                return (
                                    <div key={index} className="relative">
                                        {/* Timeline connector */}
                                        {index < sequenceTemplates[channel === 'all' ? 'email' : channel].length - 1 && (
                                            <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-gray-200" />
                                        )}

                                        <div className="flex gap-4">
                                            {/* Step indicator */}
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isPast ? 'bg-green-100 text-green-600' :
                                                isCurrent ? 'bg-blue-100 text-blue-600' :
                                                    'bg-gray-100 text-gray-400'
                                                }`}>
                                                {getMessageIcon(channel === 'all' ? 'email' : channel)}
                                            </div>

                                            {/* Step content */}
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="font-medium">
                                                            Day {step.day}: {step.subject || 'Message'}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            {isPast ? 'Sent' : isCurrent ? 'Current' : 'Scheduled'}
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() => setSelectedMessage(step)}
                                                        className="text-blue-600 hover:text-blue-700 text-sm"
                                                    >
                                                        View Template
                                                    </button>
                                                </div>
                                                {step.retryConditions && (
                                                    <div className="mt-2 p-3 bg-yellow-50 rounded-lg text-sm text-yellow-700">
                                                        <p className="font-medium">Retry Conditions:</p>
                                                        <ul className="list-disc list-inside mt-1">
                                                            {Object.entries(step.retryConditions).map(([condition, action]) => (
                                                                <li key={condition}>
                                                                    <span className="font-medium">{condition}:</span> {action}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Actions Footer */}
                    <div className="p-6 border-t bg-gray-50">
                        <div className="flex gap-3">
                            <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                                Send Next Message
                            </button>
                            <button className="px-4 py-2 text-gray-700 border rounded-lg hover:bg-gray-50">
                                Edit Sequence
                            </button>
                        </div>
                    </div>
                </div>

                {/* Message Template Viewer */}
                {selectedMessage && (
                    <MessageViewer
                        message={selectedMessage}
                        onClose={() => setSelectedMessage(null)}
                    />
                )}
            </div>
        );
    };

    const ProspectDetailsDrawer = ({ prospect, onClose }) => {
        const touchpoints = [
            {
                id: 1,
                channel: 'email',
                type: 'sent',
                date: '2024-03-10',
                time: '09:00 AM',
                subject: 'Introduction and Value Proposition',
                content: 'Hi [Name], I noticed your work at [Company]...',
                metrics: {
                    opened: true,
                    openCount: 2,
                    clicked: true,
                    replied: false
                }
            },
            {
                id: 2,
                channel: 'linkedin',
                type: 'connection_request',
                date: '2024-03-12',
                time: '10:15 AM',
                content: 'Connection request sent',
                metrics: {
                    accepted: true,
                    acceptedDate: '2024-03-12 02:45 PM'
                }
            },
            {
                id: 3,
                channel: 'phone',
                type: 'call',
                date: '2024-03-14',
                time: '02:30 PM',
                content: 'Called to discuss collaboration opportunities',
                metrics: {
                    duration: '5:23',
                    outcome: 'Left voicemail'
                }
            }
        ];

        const getChannelIcon = (channel) => {
            switch (channel) {
                case 'email':
                    return <Mail className="w-4 h-4" />;
                case 'linkedin':
                    return <Linkedin className="w-4 h-4" />;
                case 'phone':
                    return <Phone className="w-4 h-4" />;
                default:
                    return <MessageSquare className="w-4 h-4" />;
            }
        };

        return (
            <div className="fixed inset-y-0 right-0 w-[500px] bg-white shadow-xl border-l transform transition-transform duration-200 ease-in-out z-50">
                <div className="h-full flex flex-col">
                    {/* Header */}
                    <div className="p-6 border-b">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h2 className="text-xl font-semibold">{prospect.name}</h2>
                                <p className="text-sm text-gray-600">{prospect.company}</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <StatusBadge status={prospect.status} />
                    </div>

                    {/* Touchpoints Timeline */}
                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="space-y-6">
                            {touchpoints.map((touchpoint, index) => (
                                <div key={touchpoint.id} className="relative">
                                    {/* Timeline connector */}
                                    {index < touchpoints.length - 1 && (
                                        <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-gray-200" />
                                    )}

                                    <div className="flex gap-4">
                                        {/* Channel icon */}
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${touchpoint.metrics.opened || touchpoint.metrics.accepted ?
                                                'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            {getChannelIcon(touchpoint.channel)}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-medium capitalize">
                                                        {touchpoint.channel} - {touchpoint.type.replace('_', ' ')}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {touchpoint.date} at {touchpoint.time}
                                                    </p>
                                                </div>
                                                {touchpoint.channel === 'email' && (
                                                    <button className="text-blue-600 hover:text-blue-700 text-sm">
                                                        View Email
                                                    </button>
                                                )}
                                            </div>

                                            {/* Channel-specific content */}
                                            {touchpoint.channel === 'email' && (
                                                <div className="mt-2">
                                                    <p className="text-sm font-medium">{touchpoint.subject}</p>
                                                    <p className="text-sm text-gray-600 mt-1">{touchpoint.content}</p>
                                                    <div className="mt-2 flex gap-4 text-xs text-gray-500">
                                                        <span>Opened: {touchpoint.metrics.openCount} times</span>
                                                        {touchpoint.metrics.clicked && <span>Links clicked</span>}
                                                        {touchpoint.metrics.replied && <span>Replied</span>}
                                                    </div>
                                                </div>
                                            )}

                                            {touchpoint.channel === 'phone' && (
                                                <div className="mt-2">
                                                    <p className="text-sm text-gray-600">{touchpoint.content}</p>
                                                    <div className="mt-2 flex gap-4 text-xs text-gray-500">
                                                        <span>Duration: {touchpoint.metrics.duration}</span>
                                                        <span>Outcome: {touchpoint.metrics.outcome}</span>
                                                    </div>
                                                    <div className="mt-2">
                                                        <a href="#" className="text-blue-600 hover:text-blue-700 text-sm mr-4">
                                                            Download Call Log
                                                        </a>
                                                        <a href="#" className="text-blue-600 hover:text-blue-700 text-sm">
                                                            Download Transcript
                                                        </a>
                                                    </div>
                                                </div>
                                            )}

                                            {touchpoint.channel === 'linkedin' && (
                                                <div className="mt-2">
                                                    <p className="text-sm text-gray-600">{touchpoint.content}</p>
                                                    {touchpoint.metrics.accepted && (
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            Accepted on {touchpoint.metrics.acceptedDate}
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Update ProspectsTable to handle row clicks
    const ProspectsTable = ({ channel, prospects }) => {
        const [selectedProspect, setSelectedProspect] = useState(null);
        const [selectedProspectDetails, setSelectedProspectDetails] = useState(null);

        const handleRowClick = (row) => {
            setSelectedProspect(row);
        };

        // Base columns that appear for all channels
        const baseColumns = [
            {
                name: 'Name',
                selector: row => row.name,
                sortable: true,
                cell: row => (
                    <div>
                        <button
                            onClick={() => setSelectedProspectDetails(row)}
                            className="text-left hover:text-blue-600"
                        >
                            <div className="font-medium">{row.name}</div>
                            <div className="text-sm text-gray-500">{row.company}</div>
                        </button>
                    </div>
                )
            },
            {
                name: 'Status',
                selector: row => row.status,
                sortable: true,
                cell: row => <StatusBadge status={row.status} />
            },
            {
                name: 'Last Contact',
                selector: row => row.lastContactDate,
                sortable: true,
                cell: row => (
                    <div className="text-sm">
                        <div>{new Date(row.lastContactDate).toLocaleDateString()}</div>
                        <div className="text-gray-500">{row.lastContactTime}</div>
                    </div>
                )
            }
        ];

        // Channel-specific columns
        const channelSpecificColumns = {
            email: [
                {
                    name: 'Sender Email',
                    selector: row => row.senderEmail,
                    sortable: true,
                    cell: row => (
                        <div className="text-sm text-gray-600">
                            {row.senderEmail || 'contact@mnfstai.com'}
                        </div>
                    )
                },
                {
                    name: 'Sequence',
                    selector: row => row.sequence,
                    sortable: true,
                    cell: row => (
                        <div className="text-sm">
                            <div>Step {row.sequence.currentStep} of {row.sequence.totalSteps}</div>
                            <button
                                onClick={() => handleRowClick(row)}
                                className="text-blue-600 hover:text-blue-700 hover:underline text-left"
                            >
                                Next: {row.sequence.nextAction}
                            </button>
                        </div>
                    )
                },
                {
                    name: 'Engagement',
                    selector: row => row.engagement.score,
                    sortable: true,
                    cell: row => (
                        <div className="flex items-center gap-2">
                            <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-500"
                                    style={{ width: `${row.engagement.score}%` }}
                                />
                            </div>
                            <span className="text-sm text-gray-600">{row.engagement.score}%</span>
                        </div>
                    )
                }
            ],
            phone: [
                {
                    name: 'Call Details',
                    cell: row => (
                        <div className="text-sm space-y-1">
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    // Handle log download
                                }}
                                className="text-blue-600 hover:text-blue-700 hover:underline block"
                            >
                                Download Call Log
                            </a>
                            {row.hasTranscript && (
                                <a
                                    href="#"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        // Handle transcript download
                                    }}
                                    className="text-blue-600 hover:text-blue-700 hover:underline block"
                                >
                                    Download Transcript
                                </a>
                            )}
                        </div>
                    )
                },
                {
                    name: 'Sequence',
                    selector: row => row.sequence,
                    sortable: true,
                    cell: row => (
                        <div className="text-sm">
                            <div>Step {row.sequence.currentStep} of {row.sequence.totalSteps}</div>
                            <button
                                onClick={() => handleRowClick(row)}
                                className="text-blue-600 hover:text-blue-700 hover:underline text-left"
                            >
                                Next: {row.sequence.nextAction}
                            </button>
                        </div>
                    )
                }
            ],
            linkedin: [
                {
                    name: 'Sequence',
                    selector: row => row.sequence,
                    sortable: true,
                    cell: row => (
                        <div className="text-sm">
                            <div>Step {row.sequence.currentStep} of {row.sequence.totalSteps}</div>
                            <button
                                onClick={() => handleRowClick(row)}
                                className="text-blue-600 hover:text-blue-700 hover:underline text-left"
                            >
                                Next: {row.sequence.nextAction}
                            </button>
                        </div>
                    )
                },
                {
                    name: 'Engagement',
                    selector: row => row.engagement.score,
                    sortable: true,
                    cell: row => (
                        <div className="flex items-center gap-2">
                            <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-500"
                                    style={{ width: `${row.engagement.score}%` }}
                                />
                            </div>
                            <span className="text-sm text-gray-600">{row.engagement.score}%</span>
                        </div>
                    )
                }
            ]
        };

        // Get the appropriate columns based on the channel
        const getColumns = () => {
            if (channel === 'all') {
                return [...baseColumns, channelSpecificColumns.email[1]]; // Just show sequence for all view
            }
            return [...baseColumns, ...(channelSpecificColumns[channel] || [])];
        };

        const columns = getColumns();

        const customStyles = {
            headRow: {
                style: {
                    backgroundColor: '#F9FAFB',
                    borderBottomColor: '#E5E7EB',
                },
            },
            headCells: {
                style: {
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#374151',
                    paddingLeft: '1rem',
                    paddingRight: '1rem',
                },
            },
            cells: {
                style: {
                    paddingLeft: '1rem',
                    paddingRight: '1rem',
                },
            },
            rows: {
                style: {
                    backgroundColor: 'white',
                    '&:hover': {
                        backgroundColor: '#F9FAFB',
                        cursor: 'pointer',
                    },
                },
            },
        };

        return (
            <>
                <DataTable
                    columns={columns}
                    data={prospects}
                    customStyles={customStyles}
                    pagination
                    paginationPerPage={10}
                    paginationRowsPerPageOptions={[10, 20, 30, 50]}
                    highlightOnHover
                    pointerOnHover
                    onRowClicked={handleRowClick}
                />
                {selectedProspect && (
                    <MessageSequenceDrawer
                        prospect={selectedProspect}
                        channel={channel}
                        onClose={() => setSelectedProspect(null)}
                    />
                )}
                {selectedProspectDetails && (
                    <ProspectDetailsDrawer
                        prospect={selectedProspectDetails}
                        onClose={() => setSelectedProspectDetails(null)}
                    />
                )}
            </>
        );
    };

    // Mock data for prospects
    const mockProspects = {
        email: [
            {
                id: 1,
                name: 'John Smith',
                company: 'Tech Corp',
                status: ProspectStatus.CONTACTED,
                lastContactDate: '2024-03-15',
                lastContactTime: '10:30 AM',
                sequence: {
                    currentStep: 2,
                    totalSteps: 5,
                    nextAction: 'Follow-up email'
                },
                engagement: {
                    score: 65,
                    details: {
                        opens: 3,
                        clicks: 1,
                        replies: 1
                    }
                }
            },
            {
                id: 2,
                name: 'Sarah Johnson',
                company: 'Digital Solutions',
                status: ProspectStatus.RESPONDED,
                lastContactDate: '2024-03-14',
                lastContactTime: '2:15 PM',
                sequence: {
                    currentStep: 3,
                    totalSteps: 5,
                    nextAction: 'Schedule meeting'
                },
                engagement: {
                    score: 85,
                    details: {
                        opens: 5,
                        clicks: 2,
                        replies: 2
                    }
                }
            },
            {
                id: 3,
                name: 'Mohammed Al Rashid',
                company: 'Dubai Innovations',
                status: ProspectStatus.MEETING_SCHEDULED,
                lastContactDate: '2024-03-13',
                lastContactTime: '11:45 AM',
                sequence: {
                    currentStep: 4,
                    totalSteps: 5,
                    nextAction: 'Meeting follow-up'
                },
                engagement: {
                    score: 95,
                    details: {
                        opens: 6,
                        clicks: 3,
                        replies: 3
                    }
                }
            },
            {
                id: 4,
                name: 'Lisa Chen',
                company: 'Global Tech',
                status: ProspectStatus.NOT_INTERESTED,
                lastContactDate: '2024-03-12',
                lastContactTime: '9:20 AM',
                sequence: {
                    currentStep: 2,
                    totalSteps: 5,
                    nextAction: 'Archived'
                },
                engagement: {
                    score: 20,
                    details: {
                        opens: 1,
                        clicks: 0,
                        replies: 1
                    }
                }
            },
            {
                id: 5,
                name: 'Ahmed Hassan',
                company: 'Future Enterprises',
                status: ProspectStatus.PENDING,
                lastContactDate: '2024-03-11',
                lastContactTime: '3:30 PM',
                sequence: {
                    currentStep: 1,
                    totalSteps: 5,
                    nextAction: 'Initial email'
                },
                engagement: {
                    score: 0,
                    details: {
                        opens: 0,
                        clicks: 0,
                        replies: 0
                    }
                }
            }
        ],
        linkedin: [
            {
                id: 6,
                name: 'David Wilson',
                company: 'Innovation Labs',
                status: ProspectStatus.CONTACTED,
                lastContactDate: '2024-03-15',
                lastContactTime: '1:30 PM',
                sequence: {
                    currentStep: 1,
                    totalSteps: 3,
                    nextAction: 'Follow-up message'
                },
                engagement: {
                    score: 40,
                    details: {
                        viewed: true,
                        connected: true,
                        responded: false
                    }
                }
            },
            {
                id: 7,
                name: 'Fatima Al Sayed',
                company: 'Tech Solutions Dubai',
                status: ProspectStatus.INTERESTED,
                lastContactDate: '2024-03-14',
                lastContactTime: '11:20 AM',
                sequence: {
                    currentStep: 2,
                    totalSteps: 3,
                    nextAction: 'Schedule call'
                },
                engagement: {
                    score: 75,
                    details: {
                        viewed: true,
                        connected: true,
                        responded: true
                    }
                }
            }
        ],
        phone: [
            {
                id: 8,
                name: 'Robert Zhang',
                company: 'Digital Ventures',
                status: ProspectStatus.CONTACTED,
                lastContactDate: '2024-03-15',
                lastContactTime: '2:45 PM',
                sequence: {
                    currentStep: 1,
                    totalSteps: 2,
                    nextAction: 'Follow-up call'
                },
                engagement: {
                    score: 50,
                    details: {
                        answered: true,
                        interested: 'maybe',
                        callback: true
                    }
                }
            },
            {
                id: 9,
                name: 'Aisha Mohammed',
                company: 'Dubai Tech Hub',
                status: ProspectStatus.MEETING_SCHEDULED,
                lastContactDate: '2024-03-14',
                lastContactTime: '10:15 AM',
                sequence: {
                    currentStep: 2,
                    totalSteps: 2,
                    nextAction: 'Meeting preparation'
                },
                engagement: {
                    score: 90,
                    details: {
                        answered: true,
                        interested: 'yes',
                        callback: false
                    }
                }
            }
        ],
        all: [
            // Combine all prospects for the "all" view
        ]
    };

    // Combine all prospects for the "all" view
    mockProspects.all = [
        ...mockProspects.email,
        ...mockProspects.linkedin,
        ...mockProspects.phone
    ];

    const ChannelTabs = ({ activeChannel, onChannelChange, channels }) => {
        return (
            <div className="border-b">
                <div className="flex space-x-4">
                    {Object.entries(channels).map(([channel, icon]) => (
                        <button
                            key={channel}
                            onClick={() => onChannelChange(channel)}
                            className={`flex items-center gap-2 px-4 py-2 border-b-2 font-medium ${activeChannel === channel
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            {icon}
                            <span className="capitalize">{channel}</span>
                        </button>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/outreach-portal')}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <div>
                                <h1 className="text-xl font-semibold">{campaign.name}</h1>
                                <p className="text-sm text-gray-500">
                                    List: {campaign.list} • {campaign.totalProspects} prospects
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {Object.entries(channelIcons).map(([channel, icon]) => (
                                <button
                                    key={channel}
                                    onClick={() => setSelectedChannel(channel)}
                                    className={`p-2 rounded-lg flex items-center gap-2 ${selectedChannel === channel
                                        ? 'bg-blue-50 text-blue-600'
                                        : 'hover:bg-gray-100'
                                        }`}
                                >
                                    {icon}
                                    <span className="capitalize">{channel}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Overview Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        title="Total Prospects"
                        value={campaign.totalProspects}
                        icon={Users}
                    />
                    <StatCard
                        title="Contacted"
                        value={campaign.progress.contacted}
                        icon={CheckCircle}
                        trend={5.2}
                    />
                    <StatCard
                        title="Meetings Booked"
                        value={campaign.progress.meetings}
                        icon={Calendar}
                        trend={12.5}
                    />
                    <StatCard
                        title="Not Interested"
                        value={campaign.progress.notInterested}
                        icon={XCircle}
                        trend={-2.1}
                    />
                </div>

                {/* Channel Tabs and Prospects Table */}
                <div className="mt-8 bg-white rounded-lg shadow-sm">
                    <ChannelTabs
                        activeChannel={selectedChannel}
                        onChannelChange={setSelectedChannel}
                        channels={channelIcons}
                    />
                    <div className="p-6">
                        <ProspectsTable
                            channel={selectedChannel}
                            prospects={mockProspects[selectedChannel] || []}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CampaignDetails; 