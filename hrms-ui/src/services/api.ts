import axios, { type AxiosInstance, type AxiosResponse } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

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