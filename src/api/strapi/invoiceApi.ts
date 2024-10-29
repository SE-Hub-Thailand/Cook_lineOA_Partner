import { Invoice } from './types';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:1400';  // Fallback to default if env variable not set

export const createInvoice = async (invoiceData: Record<string, any>) => {
    try {
        const url = `${API_URL}/api/invoices`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                // Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data: invoiceData }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error creating invoice:', errorData);
            throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error creating invoice:', error.message);
        throw error;
    }
};

export const getInvoiceByRedeemId = async (redeemId: number): Promise<Invoice> => {
    try {
        const url = `${API_URL}/api/invoices?populate[transferImage]=true&populate[redeem]=true&filters[redeem][$eq]=${redeemId}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                // Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error fetching invoices:', errorData);
            throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();

        // Map the response data to an array of Product objects
        const invoices: Invoice = {
            id: data.data.id,
            amount: data.data.attributes.amount,
            status: data.data.attributes.status,
            transferImage: data.data.attributes.transferImage,
            createdAt: data.data.attributes.createdAt,
            updatedAt: data.data.attributes.updatedAt,
            redeem: {
                // id: data.data.attributes.shop.data.id,
                status: data.data.attributes.status,
				qrCode: data.data.attributes.qrCode,
				productJsonArray: data.data.attributes.productJsonArray,
            },
        };

        return invoices;
    } catch (error) {
        console.error('Error fetching invoices:', error.message);
        throw error;
    }
};
