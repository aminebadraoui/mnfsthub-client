import baserowService from './baserow.service';

export const getLists = async () => {
    try {
        const tenantId = localStorage.getItem('tenantId');
        const response = await baserowService.getLists({
            filters: {
                'Tenant ID': tenantId,
                'Active': true
            }
        });

        // Get count for each list
        const listsWithCounts = await Promise.all(
            response.results.map(async (list) => {
                const contactsResponse = await baserowService.getContacts({
                    filters: {
                        'Tenant ID': tenantId,
                        'List Name': list.Name
                    }
                });

                return {
                    id: list.UUID,
                    name: list.Name,
                    tags: list.Tags,
                    count: contactsResponse.count
                };
            })
        );

        return listsWithCounts;
    } catch (error) {
        console.error('Error in getLists:', error);
        throw error;
    }
}; 