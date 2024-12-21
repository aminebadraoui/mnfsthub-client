import axios from 'axios';

const API_URL = 'http://localhost:5001/api/contacts';

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

export const getContacts = async () => {
    try {
        const response = await api.get('');
        return response.data;
    } catch (error) {
        console.error('Error fetching contacts:', error);
        throw error;
    }
};

export const createContact = async (contactData) => {
    try {
        const response = await api.post('', contactData);
        return response.data;
    } catch (error) {
        console.error('Error creating contact:', error);
        throw error;
    }
};

export const updateContact = async (id, contactData) => {
    try {
        const response = await api.put(`/${id}`, contactData);
        return response.data;
    } catch (error) {
        console.error('Error updating contact:', error);
        throw error;
    }
};

export const deleteContact = async (id) => {
    try {
        const response = await api.delete(`/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting contact:', error);
        throw error;
    }
};

export const getContactById = async (contactId) => {
    try {
        const response = await axios.get(`${API_URL}/contacts/${contactId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching contact:', error);
        throw error;
    }
}; 