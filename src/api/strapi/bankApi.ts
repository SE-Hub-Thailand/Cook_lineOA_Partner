const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:1400';  // Fallback to default if env variable not set

export const getAllBank = async (): Promise<Bank[]> => {
    try {
        const url = `${API_URL}/api/banks`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error fetching banks:', errorData);
            throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();

        // Map the response data to an array of Bank objects
        const bankData = data.data.map((item: any) => ({
            id: item.id,
            name: item.attributes.name,
        }));

        return bankData;
    } catch (error) {
        console.error('Error fetching bank data:', (error as Error).message);
        throw error;
    }
};
