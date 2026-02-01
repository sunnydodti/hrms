
import { api } from './api';
import { type DashboardStats } from '../types/dashboard';

export const dashboardService = {
    // Get dashboard stats
    async getStats(): Promise<DashboardStats> {
        const response = await api.get('/api/dashboard/stats');
        return response.data;
    }
};
