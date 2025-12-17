import axios from 'axios';

const API_URL = 'http://localhost:8000/api'; // Django Backend

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const fetchProducts = async (params?: { category?: string; search?: string; ordering?: string }) => {
    let url = '/products/';
    const queryParams = new URLSearchParams();

    if (params?.category) queryParams.append('category', params.category);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.ordering) queryParams.append('ordering', params.ordering);

    const queryString = queryParams.toString();
    if (queryString) url += `?${queryString}`;

    const response = await api.get(url);
    return response.data;
};

export const fetchProduct = async (slug: string) => {
    const response = await api.get(`/products/${slug}/`);
    return response.data;
};

export const fetchCategories = async () => {
    const response = await api.get('/categories/');
    return response.data;
};

export const createOrder = async (orderData: any) => {
    const response = await api.post('/orders/', orderData);
    return response.data;
};
