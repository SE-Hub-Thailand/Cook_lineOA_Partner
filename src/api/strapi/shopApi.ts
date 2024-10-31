// src/api/strapi/shopApi.ts
import { Shop } from './types';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:1400';  // Fallback to default if env variable not set

export const getAllShops = async (token: string): Promise<Shop[]> => {
    if (!token) {
        throw new Error('No token provided. User must be authenticated.');
    }
    try {
        // const API_URL = 'https://cookbstaging.careervio.com/api/shops/?populate=image
        const url = `${API_URL}/api/shops/?populate=image`;
        // console.log('url', url);
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error fetching shops:', errorData);
            throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();
        console.log('data', data);
        // Map the response data to an array of Shop objects
        const shops: Shop[] = data.data.map((item: any) => ({
            id: item.id,
            name: item.attributes.name,
            location: item.attributes.location,
            latitude: item.attributes.latitude,
            longitude: item.attributes.longitude,
            createdAt: item.attributes.createdAt,
            updatedAt: item.attributes.updatedAt,
            publishedAt: item.attributes.publishedAt,
            bookBankNumber: item.attributes.bookBankNumber,
            bankName: item.attributes.bankName,
            bookBankImage: item.attributes.image,
            image: item.attributes.image,
        }));
        console.log('shops', shops);
        return shops;
    } catch (error) {
        console.error('Error fetching shops:', error.message);
        throw error;
    }
};

export const getShopByUserId = async (id: number, token: string): Promise<Shop> => {
    if (!token) {
        throw new Error('No token provided. User must be authenticated.');
    }
    if (!id) {
        throw new Error('No shop ID provided.');
    }

    try {
        // const url = `${API_URL}/api/shops/${id}?populate=image`;
        const url = `${API_URL}/api/shops?populate[image]=true&populate[user]=true&populate[bank]=true&filters[user][$eq]=${id}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error fetching shop:', errorData);
            throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();
        console.log('data', data);
        const shop: Shop = {
            id: data?.data[0]?.id,
            name: data?.data[0]?.attributes?.name,
            location: data?.data[0]?.attributes?.location,
            latitude: data?.data[0]?.attributes?.latitude,
            longitude: data?.data[0]?.attributes?.longitude,
            createdAt: data?.data[0]?.attributes?.createdAt,
            updatedAt: data?.data[0]?.attributes?.updatedAt,
            publishedAt: data?.data[0]?.attributes?.publishedAt,
            image: data?.data[0]?.attributes?.image,
            bookBankNumber: data?.data[0]?.attributes?.bookBankNumber,
            bookBankImage: data?.data[0]?.attributes?.image,
            user: {
                id: data?.data[0]?.attributes?.user?.data?.id,
                username: data?.data[0]?.attributes?.user?.data?.attributes?.username,
                lineId: data?.data[0]?.attributes?.user?.data?.attributes?.lineId,
                email: data?.data[0]?.attributes?.user?.data?.attributes?.email,
                fullName: data?.data[0]?.attributes?.user?.data?.attributes?.fullName,
                gender: data?.data[0]?.attributes?.user?.data?.attributes?.gender,
                address: data?.data[0]?.attributes?.user?.data?.attributes?.address,
                cardID: data?.data[0]?.attributes?.user?.data?.attributes?.cardID,
                // photoImage: data?.data[0]?.attributes?.user?.data?.attributes?.photoImage.url,
                telNumber: data?.data[0]?.attributes?.user?.data?.attributes?.telNumber,
                point: data?.data[0]?.attributes?.user?.data?.attributes?.point,
            },
            bankName: data?.data[0]?.attributes?.bank?.data?.attributes?.name,

        };

        console.log('shop', shop);
        return shop;
    } catch (error) {
        console.error('Error fetching shop by ID:', error.message);
        throw error;
    }
};

export const getShopById = async (id: string, token: string): Promise<Shop> => {
    if (!token) {
        throw new Error('No token provided. User must be authenticated.');
    }
    if (!id) {
        throw new Error('No shop ID provided.');
    }

    try {
        // const url = `${API_URL}/api/shops/${id}?populate=image`;
        const url = `${API_URL}/api/shops/${id}?populate[image]=true&populate[user]=true&populate[bank]=true`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error fetching shop:', errorData);
            throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();
        // console.log('data', data);
        const shop: Shop = {
            id: data?.data[0]?.id,
            name: data?.data[0]?.attributes?.name,
            location: data?.data[0]?.attributes?.location,
            latitude: data?.data[0]?.attributes?.latitude,
            longitude: data?.data[0]?.attributes?.longitude,
            createdAt: data?.data[0]?.attributes?.createdAt,
            updatedAt: data?.data[0]?.attributes?.updatedAt,
            publishedAt: data?.data[0]?.attributes?.publishedAt,
            image: data?.data[0]?.attributes?.image,
            bookBankNumber: data?.data[0]?.attributes?.bookBankNumber,
            bookBankImage: data?.data[0]?.attributes?.image,
            user: {
                id: data?.data[0]?.attributes?.user?.data?.id,
                username: data?.data[0]?.attributes?.user?.data?.attributes?.username,
                email: data?.data[0]?.attributes?.user?.data?.attributes?.email,
                fullName: data?.data[0]?.attributes?.user?.data?.attributes?.fullName,
            },
            bankName: data?.data[0]?.attributes?.bank?.data?.attributes?.name,

        };

        console.log('shop', shop);
        console.log('JSON.stringify(shop): ', JSON.stringify(shop)); // Log users to check if the mapping worked correctly

        return shop;
    } catch (error) {
        console.error('Error fetching shop by ID:', error.message);
        throw error;
    }
};

export const createShop = async (shopData: Record<string, any>) => {
    try {
        const url = `${API_URL}/api/shops`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                // Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data: shopData }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error creating shop:', errorData);
            throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error creating shop:', error.message);
        throw error;
    }
};

export const updateShop = async (token: string, shopId: number, shopData: Record<string, any>) => {
    try {
        const url = `${API_URL}/api/shops/${shopId}`;

        const response = await fetch(url, {
            method: 'PUT',  // Use 'PATCH' if you only want to update certain fields
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data: shopData }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error updating shop:', errorData);
            throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error updating shop:', error.message);
        throw error;
    }
};
