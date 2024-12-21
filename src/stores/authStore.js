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
            set({ user: data, loading: false });
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
            set({ user: data, loading: false });
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
        signOut();
        set({ user: null, error: null });
    },

    // Clear error
    clearError: () => set({ error: null })
}));

export default useAuthStore; 