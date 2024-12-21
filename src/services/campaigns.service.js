import axios from 'axios';

const API_URL = 'http://localhost:5001/api/campaigns';

// Create an axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add a request interceptor to add the auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const getCampaigns = async () => {
    try {
        const response = await api.get('');
        return response.data;
    } catch (error) {
        console.error('Error fetching campaigns:', error);
        throw error;
    }
};

export const createCampaign = async (campaignData) => {
    try {
        const response = await api.post('', campaignData);
        return response.data;
    } catch (error) {
        console.error('Error creating campaign:', error);
        throw error;
    }
};

export const updateCampaign = async (id, campaignData) => {
    try {
        const response = await api.put(`/${id}`, campaignData);
        return response.data;
    } catch (error) {
        console.error('Error updating campaign:', error);
        throw error;
    }
};

export const deleteCampaign = async (id) => {
    try {
        const response = await api.delete(`/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting campaign:', error);
        throw error;
    }
};

export const getCampaignById = async (campaignId) => {
    try {
        const response = await axios.get(`${API_URL}/campaigns/${campaignId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching campaign:', error);
        throw error;
    }
}; 