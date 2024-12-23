const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
const N8N_API_URL = 'https://mnfst-n8n.mnfstagency.com/api/v1';
const N8N_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhNThhMTg1NS1hODQ3LTQyMzAtOTgzYi1hZWU1MGIyOTNlYjIiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzM0OTA5ODU4fQ.gFiQ9DjlEasQo5jCCB4wWF7Uc58NPeQDVmJXTL_u_78';

export const WorkflowType = {
    SEARCH: 'search',
    LIST: 'list'
};

export const WorkflowStatus = {
    PENDING: 'pending',
    COMPLETED: 'completed',
    FAILED: 'failed'
};

// Function to fetch n8n execution data
export async function getN8nExecutionData(executionId) {
    console.log('Fetching execution data for ID:', executionId);
    try {
        const url = `${N8N_API_URL}/executions/${executionId}?includeData=true`;
        console.log('Making request to:', url);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-N8N-API-KEY': N8N_API_KEY
            }
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', errorText);
            throw new Error(`Failed to fetch execution data: ${errorText}`);
        }

        const data = await response.json();
        console.log('Successfully received N8N Execution Data:', data);
        return data;
    } catch (error) {
        console.error('Error in getN8nExecutionData:', error);
        throw error;
    }
}

export async function getWorkflows(tenantId, type = null) {
    try {
        const url = new URL(`${API_URL}/webhooks/workflows/${tenantId}`);
        if (type) {
            url.searchParams.append('type', type);
        }

        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch workflows');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching workflows:', error);
        throw error;
    }
}

export async function createSearchWorkflow(tenantId, searchParams) {
    try {
        const response = await fetch(`${API_URL}/webhooks/outreach/search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                tenantId,
                ...searchParams
            })
        });

        if (!response.ok) {
            throw new Error('Failed to create search workflow');
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating search workflow:', error);
        throw error;
    }
}

export async function createListWorkflow(tenantId, listParams) {
    try {
        const formData = new FormData();
        Object.entries(listParams).forEach(([key, value]) => {
            if (key === 'tags') {
                formData.append(key, JSON.stringify(value));
            } else {
                formData.append(key, value);
            }
        });
        formData.append('tenantId', tenantId);

        const response = await fetch(`${API_URL}/webhooks/outreach/lists/add`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Failed to create list workflow');
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating list workflow:', error);
        throw error;
    }
} 