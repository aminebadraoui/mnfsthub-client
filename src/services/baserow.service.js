import axios from 'axios';

const API_URL = 'http://localhost:5001/api/baserow';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

class BaserowService {
    getTenantId() {
        const tenantId = localStorage.getItem('tenantId');
        if (!tenantId) {
            throw new Error('No tenant ID found. Please sign in.');
        }
        return tenantId;
    }

    async getProspectsCount(listName) {
        try {
            const tenantId = this.getTenantId();
            const response = await api.get('/contacts/count', {
                params: {
                    'Tenant ID': tenantId,
                    'List Name': listName
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error getting prospects count:', error);
            throw error;
        }
    }

    async getLists(options = {}) {
        const { filters = {}, page = 1, size = 25 } = options;
        const queryParts = [];

        const tenantId = this.getTenantId();
        queryParts.push(`filter__Tenant ID__equal=${encodeURIComponent(tenantId)}`);

        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined) {
                    const operator = (key === 'Tenant ID' || key === 'List Name') ? 'equal' : 'contains';
                    queryParts.push(`filter__${encodeURIComponent(key)}__${operator}=${encodeURIComponent(value)}`);
                }
            });
        }

        queryParts.push(`page=${page}`);
        queryParts.push(`size=${size}`);

        const response = await api.get(`/lists?${queryParts.join('&')}`);
        return response.data;
    }

    async createList(data) {
        const listData = {
            ...data,
            'Tenant ID': this.getTenantId()
        };
        const response = await api.post('/lists', listData);
        return response.data;
    }

    async updateList(id, data) {
        const response = await api.patch(`/lists/${id}`, {
            ...data,
            'Tenant ID': this.getTenantId()
        });
        return response.data;
    }

    async deleteList(id) {
        const queryParams = new URLSearchParams();
        queryParams.append('Tenant ID', this.getTenantId());
        await api.delete(`/lists/${id}?${queryParams.toString()}`);
    }

    async getCampaigns(options = {}) {
        const { filters = {}, page = 1, size = 25 } = options;

        const queryParts = [];

        const tenantId = this.getTenantId();
        queryParts.push(`filter__Tenant ID__contains=${encodeURIComponent(tenantId)}`);

        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined) {
                    queryParts.push(`filter__${encodeURIComponent(key)}__contains=${encodeURIComponent(value)}`);
                }
            });
        }

        queryParts.push(`page=${page}`);
        queryParts.push(`size=${size}`);

        const response = await api.get(`/campaigns?${queryParts.join('&')}`);
        return response.data;
    }

    async createCampaign(data) {
        const campaignData = {
            ...data,
            'Tenant ID': this.getTenantId()
        };
        const response = await api.post('/campaigns', campaignData);
        return response.data;
    }

    async updateCampaign(id, data) {
        const response = await api.patch(`/campaigns/${id}`, {
            ...data,
            'Tenant ID': this.getTenantId()
        });
        return response.data;
    }

    async deleteCampaign(id) {
        const queryParams = new URLSearchParams();
        queryParams.append('Tenant ID', this.getTenantId());
        await api.delete(`/campaigns/${id}?${queryParams.toString()}`);
    }

    async getContacts(options = {}) {
        const { filters = {}, page = 1, size = 25 } = options;
        const queryParts = [];

        // Add filter parameters
        if (Object.keys(filters).length > 0) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== '' && value !== 'N/A') {
                    // Send plain filter keys without prefixes
                    queryParts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
                }
            });
        }

        queryParts.push(`page=${page}`);
        queryParts.push(`size=${size}`);

        const response = await api.get(`/contacts?${queryParts.join('&')}`);
        return response.data;
    }

    async createContact(data) {
        try {
            // Clean the data before sending
            const cleanData = {};
            Object.entries(data).forEach(([key, value]) => {
                if (value && value !== '' && value !== 'N/A') {
                    cleanData[key] = value;
                }
            });

            console.log('Creating contact with data:', cleanData);
            const response = await api.post('/contacts', cleanData);
            return response.data;
        } catch (error) {
            console.error('Error creating contact:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            throw error;
        }
    }
}

export default new BaserowService(); 