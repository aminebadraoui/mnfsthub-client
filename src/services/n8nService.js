const N8N_ADD_LIST_WEBHOOK = process.env.REACT_APP_N8N_ADD_LIST_WEBHOOK || 'https://mnfst-n8n.mnfstagency.com/webhook/add-list';

export const uploadToN8N = async (file, listId, listName, tags) => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('listId', listId);
        formData.append('listName', listName);

        // Format tags as a comma-separated string instead of JSON
        const tagsString = tags.join(',');
        formData.append('tags', tagsString);

        const response = await fetch(N8N_ADD_LIST_WEBHOOK, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Upload failed: ${errorText}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error uploading to n8n:', error);
        throw error;
    }
}; 