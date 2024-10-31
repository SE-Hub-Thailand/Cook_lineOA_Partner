// src/api/strapi/productApi.ts
import { Formula } from './types';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:1400';  // Fallback to default if env variable not set
export const getFormulaPointByPrice = async (price: number): Promise<Formula[]> => {
    try {
        const url = `${API_URL}/api/formula-products?filters[price][$eq]=1`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error fetching products:', errorData);
            throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();

        // Filter results to include only those with Price === 1
        // const shops: Shop[] = data.data.map((item: any) => ({
        const filteredData: Formula[] = data.data
            .filter((item: any) => item.attributes.price === price)
            .map((item: any) => ({
                id: item.id,
                price: item.attributes.price,
                point: item.attributes.point,
            }));
            console.log('filteredData:', filteredData);
        return filteredData;
    } catch (error) {
        console.error('Error fetching formula:', (error as Error).message);
        throw error;
    }
};
