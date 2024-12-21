const N8N_GET_USER_INFO = process.env.REACT_APP_N8N_GET_USER_INFO || 'https://mnfst-n8n.mnfstagency.com/webhook/user-info';
const N8N_LISTS_WEBHOOK = 'https://mnfst-n8n.mnfstagency.com/webhook/outreach/lists';
const N8N_CAMPAIGNS_WEBHOOK = 'https://mnfst-n8n.mnfstagency.com/webhook/outreach/campaign';

const checkTenantId = () => {
    const tenantId = localStorage.getItem('tenantId');
    if (!tenantId) {
        throw new Error('Tenant_ID not found. Please sign in again.');
    }
    return tenantId;
};

// Get lists for current user
export const getLists = async () => {
    try {
        const tenantId = checkTenantId();
        const response = await fetch(`${N8N_LISTS_WEBHOOK}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ tenantId })
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error);
        }

        const result = await response.json();
        console.log('Raw lists response:', result);

        // Extract lists from the nested data structure
        if (result.data && Array.isArray(result.data)) {
            // Each item in result.data has a data array containing the actual list
            const lists = result.data.map(item => item.data[0]);
            return lists;
        }

        return [];
    } catch (error) {
        console.error('Error getting lists:', error);
        throw error;
    }
};

// Add prospects to an existing list
export const addProspectsToList = async (listId, file) => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('listId', listId);
        formData.append('tenantId', localStorage.getItem('tenantId'));

        const response = await fetch(`${N8N_LISTS_WEBHOOK}/add-prospects`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
            },
            body: formData
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error);
        }

        return await response.json();
    } catch (error) {
        console.error('Error adding prospects:', error);
        throw error;
    }
};

// Remove a list
export const removeList = async (listId) => {
    try {
        const response = await fetch(`${N8N_LISTS_WEBHOOK}/remove`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                listId,
                tenantId: localStorage.getItem('tenantId')
            })
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error);
        }

        return await response.json();
    } catch (error) {
        console.error('Error removing list:', error);
        throw error;
    }
};

// Upload list
export const uploadToN8N = async (file, listName, tags) => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('listName', listName);
        formData.append('tags', tags.join(','));
        formData.append('tenantId', localStorage.getItem('tenantId'));

        const response = await fetch(`${N8N_LISTS_WEBHOOK}/add`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
            },
            body: formData
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Upload failed: ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error uploading to n8n:', error);
        throw error;
    }
};

// Get all campaigns for current user
export const getCampaigns = async () => {
    try {
        const tenantId = checkTenantId();
        const response = await fetch(`${N8N_CAMPAIGNS_WEBHOOK}/list`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ tenantId })
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error);
        }

        const result = await response.json();
        console.log('Raw campaigns response:', result);
        return result.data || [];
    } catch (error) {
        console.error('Error getting campaigns:', error);
        throw error;
    }
};

// Get specific campaign
export const getCampaign = async (campaignId) => {
    try {
        const tenantId = checkTenantId();
        const response = await fetch(`${N8N_CAMPAIGNS_WEBHOOK}/item`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                tenantId,
                campaignId
            })
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error);
        }

        return await response.json();
    } catch (error) {
        console.error('Error getting campaign:', error);
        throw error;
    }
};

// Create new campaign
export const createCampaign = async (campaignData) => {
    try {
        const tenantId = checkTenantId();
        const response = await fetch(`${N8N_CAMPAIGNS_WEBHOOK}/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                ...campaignData,
                tenantId
            })
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error);
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating campaign:', error);
        throw error;
    }
};

// Remove campaign
export const removeCampaign = async (campaignId) => {
    try {
        const tenantId = checkTenantId();
        const response = await fetch(`${N8N_CAMPAIGNS_WEBHOOK}/remove`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                tenantId,
                campaignId
            })
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error);
        }

        return await response.json();
    } catch (error) {
        console.error('Error removing campaign:', error);
        throw error;
    }
};

// Deactivate campaign
export const deactivateCampaign = async (campaignId) => {
    try {
        const tenantId = checkTenantId();
        const response = await fetch(`${N8N_CAMPAIGNS_WEBHOOK}/deactivate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                tenantId,
                campaignId
            })
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error);
        }

        return await response.json();
    } catch (error) {
        console.error('Error deactivating campaign:', error);
        throw error;
    }
};

// Activate campaign
export const activateCampaign = async (campaignId) => {
    try {
        const tenantId = checkTenantId();
        const response = await fetch(`${N8N_CAMPAIGNS_WEBHOOK}/activate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                tenantId,
                campaignId
            })
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error);
        }

        return await response.json();
    } catch (error) {
        console.error('Error activating campaign:', error);
        throw error;
    }
}; 