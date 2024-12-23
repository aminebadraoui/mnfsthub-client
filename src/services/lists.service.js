import axios from 'axios';

const API_URL = 'http://localhost:5001/api/lists';

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

export const getLists = async () => {
    try {
        const response = await api.get('');
        return response.data;
    } catch (error) {
        console.error('Error fetching lists:', error);
        throw error;
    }
};

export const createList = async (listData) => {
    try {
        const response = await api.post('', listData);
        return response.data;
    } catch (error) {
        console.error('Error creating list:', error);
        throw error;
    }
};

export const updateList = async (id, listData) => {
    try {
        const response = await api.put(`/${id}`, listData);
        return response.data;
    } catch (error) {
        console.error('Error updating list:', error);
        throw error;
    }
};

export const deleteList = async (id) => {
    try {
        const response = await api.delete(`/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting list:', error);
        throw error;
    }
};

export const getListById = async (listId) => {
    try {
        const response = await axios.get(`${API_URL}/lists/${listId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching list:', error);
        throw error;
    }
};

export const addProspectsToList = async (listId, prospects) => {
    try {
        const response = await axios.post(`${API_URL}/lists/${listId}/prospects`, { prospects });
        return response.data;
    } catch (error) {
        console.error('Error adding prospects to list:', error);
        throw error;
    }
}; 