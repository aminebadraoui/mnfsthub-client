import { v4 as uuidv4 } from 'uuid';

const WEBHOOK_BASE_URL = process.env.REACT_APP_WEBHOOK_BASE_URL || 'http://localhost:5001';

// In-memory store for jobs (in a real app, this would be in a database)
const jobStore = new Map();

export const JobStatus = {
    PENDING: 'pending',
    COMPLETED: 'completed',
    FAILED: 'failed'
};

export const WorkflowType = {
    SEARCH: 'search',
    LIST: 'list'
};

export const createSearchJob = (searchParams) => {
    const jobId = uuidv4();
    const job = {
        id: jobId,
        type: WorkflowType.SEARCH,
        status: JobStatus.PENDING,
        params: searchParams,
        createdAt: new Date().toISOString(),
        results: null,
        error: null,
        n8nWorkflowId: null
    };
    jobStore.set(jobId, job);
    return job;
};

export const createListJob = (listParams) => {
    const jobId = uuidv4();
    const job = {
        id: jobId,
        type: WorkflowType.LIST,
        status: JobStatus.PENDING,
        params: listParams,
        createdAt: new Date().toISOString(),
        results: null,
        error: null,
        n8nWorkflowId: null
    };
    jobStore.set(jobId, job);
    return job;
};

export const updateJobStatus = (jobId, status, data = null, error = null) => {
    const job = jobStore.get(jobId);
    if (job) {
        job.status = status;
        if (data) job.results = data;
        if (error) job.error = error;
        job.updatedAt = new Date().toISOString();
        jobStore.set(jobId, job);
        return job;
    }
    return null;
};

export const updateJobWorkflowId = (jobId, n8nWorkflowId) => {
    const job = jobStore.get(jobId);
    if (job) {
        job.n8nWorkflowId = n8nWorkflowId;
        jobStore.set(jobId, job);
        return job;
    }
    return null;
};

export const getJob = (jobId) => {
    return jobStore.get(jobId);
};

export const getAllJobs = () => {
    return Array.from(jobStore.values()).sort((a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
    );
};

export const getJobsByType = (type) => {
    return getAllJobs().filter(job => job.type === type);
};

export const registerWebhook = async (jobId) => {
    try {
        const response = await fetch(`${WEBHOOK_BASE_URL}/api/webhooks/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                jobId,
                callbackUrl: `${WEBHOOK_BASE_URL}/api/webhooks/search/${jobId}`
            })
        });

        if (!response.ok) {
            throw new Error('Failed to register webhook');
        }

        return await response.json();
    } catch (error) {
        console.error('Error registering webhook:', error);
        throw error;
    }
}; 