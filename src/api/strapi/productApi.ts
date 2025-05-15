// src/api/strapi/productApi.ts
import { Product } from './types';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:1400';  // Fallback to default if env variable not set

export const getAllProductsByShopId = async (shopId: number): Promise<Product[]> => {
    try {
        const url = `${API_URL}/api/products?populate[image]=true&populate[shop]=true&filters[shop][$eq]=${shopId}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                // Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error fetching products:', errorData);
            throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();

        // Map the response data to an array of Product objects
        const products: Product[] = data.data.map((item: any) => ({
            id: item.id,
            name: item.attributes.name,
            description: item.attributes.description,
            price: item.attributes.price,
            point: item.attributes.point,
            approved: item.attributes.approved,
            status: item.attributes.status,
            createdAt: item.attributes.createdAt,
            updatedAt: item.attributes.updatedAt,
            publishedAt: item.attributes.publishedAt,
            numStock: item.attributes.numStock,
            image: item.attributes.image,
            shop: {
                id: item.attributes.shop.data.id,
                name: item.attributes.shop.data.attributes.name,
                location: item.attributes.shop.data.attributes.location,
                latitude: item.attributes.shop.data.attributes.latitude,
                longitude: item.attributes.shop.data.attributes.longitude,
                createdAt: item.attributes.shop.data.attributes.createdAt,
                updatedAt: item.attributes.shop.data.attributes.updatedAt,
                publishedAt: item.attributes.shop.data.attributes.publishedAt,
            },
        }));

        return products;
    } catch (error) {
        console.error('Error fetching products:', error.message);
        throw error;
    }
};

export const createProduct = async (
    productData: Record<string, any>
  ) => {
    try {
      const url = `${API_URL}/api/products`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // 'Authorization': token ? `Bearer ${token}` : undefined,
        },
        body: JSON.stringify({ data: productData }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error adding product:", errorData);
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();
    //   sendMessageCreateProduct(userLineId);
      return data;
    } catch (error) {
      console.error("Error in addProduct function:", error);
      throw error;
    }
  };

  export const updateProduct = async (
    productId: number,
    productData: Record<string, any>
  ) => {
    try {
      const url = `${API_URL}/api/products/${productId}`;
  
      // 🔍 Step 1: Fetch existing product
      const existingResponse = await fetch(url, {
        headers: { "Content-Type": "application/json" },
      });
  
      if (!existingResponse.ok) {
        const errorData = await existingResponse.json();
        console.error("Error fetching existing Product:", errorData);
        throw new Error(`Fetch failed with status ${existingResponse.status}`);
      }
  
      const existingData = await existingResponse.json();
      const existing = existingData.data?.attributes || {};
  
      // 🔄 Step 2: Merge existing and incoming data
      const mergedData = {
        ...existing,
        ...productData,
      };
  
      // 🔁 Step 3: Normalize fields as needed
      const normalizedData = {
        name: mergedData.name,
        description: mergedData.description,
        price: parseFloat(mergedData.price),
        point: mergedData.point,
        approved: mergedData.approved,
        numStock: parseInt(mergedData.numStock, 10),
        type: mergedData.type,
        shop: { id: mergedData.shop?.id || productData.shopId },
        image: mergedData.image,
      };
  
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: normalizedData }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error updating Product:", errorData);
        throw new Error(`Update failed with status ${response.status}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error: any) {
      console.error("Error in updateProduct:", error.message);
      throw error;
    }
  };
  