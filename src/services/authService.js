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
        console.log('Sign in response:', data);
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
            body: JSON.stringify({
                name,
                email,
                password
            })
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error);
        }

        const data = await response.json();
        console.log('Sign up response:', data);
        return data;
    } catch (error) {
        console.error('Sign up error:', error);
        throw error;
    }
}; 