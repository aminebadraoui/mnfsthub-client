import axios from 'axios';

const API_URL = 'http://localhost:5001/api/auth';

// Create an axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const signUp = async (name, email, password) => {
    try {
        const [firstName, ...lastNameParts] = name.trim().split(' ');
        const lastName = lastNameParts.join(' ') || firstName;

        const userData = {
            firstName: firstName || name.trim(),
            lastName: lastName || '',
            email: email.trim(),
            password
        };

        console.log('Sending signup data:', userData);

        const response = await api.post('/signup', userData);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('tenantId', response.data.tenantId);
            // Set the token in axios default headers for subsequent requests
            api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        }
        return response.data;
    } catch (error) {
        console.error('Error signing up:', error.response?.data || error.message);
        throw error;
    }
};

export const signIn = async (email, password) => {
    try {
        const response = await api.post('/signin', { email, password });
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('tenantId', response.data.tenantId);
            // Set the token in axios default headers for subsequent requests
            api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        }
        return response.data;
    } catch (error) {
        console.error('Error signing in:', error.response?.data || error.message);
        throw error;
    }
};

export const signOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tenantId');
    // Remove the token from axios default headers
    delete api.defaults.headers.common['Authorization'];
}; 