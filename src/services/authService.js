const N8N_AUTH_WEBHOOK = process.env.REACT_APP_N8N_AUTH_WEBHOOK || 'https://mnfst-n8n.mnfstagency.com/webhook/auth';

export const signIn = async (email, password) => {
    try {
        const response = await fetch(`${N8N_AUTH_WEBHOOK}/signin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error);
        }

        const data = await response.json();

        // Make sure we have a tenantId before storing
        if (!data.tenantId) {
            throw new Error('No tenant ID received from server');
        }

        localStorage.setItem('token', data.token);
        localStorage.setItem('tenantId', data.tenantId);
        return data;
    } catch (error) {
        console.error('Sign in error:', error);
        throw error;
    }
};

export const signUp = async (name, email, password) => {
    try {
        const response = await fetch(`${N8N_AUTH_WEBHOOK}/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        // Check if response contains error field
        if (data.error) {
            throw new Error(data.error);
        }

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error);
        }

        return data;
    } catch (error) {
        console.error('Sign up error:', error);
        throw error;
    }
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tenantId');
}; 