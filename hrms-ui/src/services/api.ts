import axios, { type AxiosInstance, type AxiosResponse } from 'axios';

const getBaseUrl = () => {
    const url = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    }
    // If protocol is missing (common on Cloudflare env vars), assume https in production, http in local
    const protocol = window.location.protocol === 'https:' ? 'https://' : 'http://';
    return `${protocol}${url}`;
};

const API_BASE_URL = getBaseUrl();

export const api: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Response interceptor for error handling
api.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error) => {
        if (error.response?.status === 404) {
            throw new Error('Resource not found');
        }
        if (error.response?.status === 400) {
            throw new Error(error.response.data.detail || 'Bad request');
        }
        if (error.response?.status >= 500) {
            throw new Error('Server error. Please try again later.');
        }
        throw new Error(error.message || 'Network error');
    }
);