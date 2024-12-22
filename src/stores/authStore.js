import { create } from 'zustand';
import { signIn, signUp, signOut } from '../services/auth.service';

const useAuthStore = create((set) => ({
    user: null,
    loading: true,
    error: null,

    // Initialize auth state from localStorage
    init: () => {
        const token = localStorage.getItem('token');
        const tenantId = localStorage.getItem('tenantId');

        if (token && tenantId) {
            set({ user: { token, tenantId }, loading: false });
        } else {
            set({ user: null, loading: false });
        }
    },

    // Login action
    login: async (email, password) => {
        try {
            set({ loading: true, error: null });
            const data = await signIn(email, password);

            // Store token and tenantId in localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('tenantId', data.id);

            console.log('Login successful - Auth data:', {
                token: data.token,
                tenantId: data.id,
                rawData: data
            });

            set({
                user: {
                    ...data,
                    tenantId: data.id
                },
                loading: false
            });
            return data;
        } catch (error) {
            set({
                error: error.response?.data?.error || error.message,
                loading: false
            });
            throw error;
        }
    },

    // Register action
    register: async (userData) => {
        try {
            set({ loading: true, error: null });
            const data = await signUp(userData);

            // Store token and tenantId in localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('tenantId', data.id);

            set({
                user: {
                    ...data,
                    tenantId: data.id
                },
                loading: false
            });
            return data;
        } catch (error) {
            set({
                error: error.response?.data?.error || error.message,
                loading: false
            });
            throw error;
        }
    },

    // Logout action
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('tenantId');
        signOut();
        set({ user: null, error: null });
    },

    // Clear error
    clearError: () => set({ error: null })
}));

export default useAuthStore; 