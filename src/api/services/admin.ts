import { API_BASE_URL, defaultHeaders, handleApiError } from '../config';
import type {
  User,
  UserListResponse,
  UserRequest,
  DashboardStats,
  SystemSettings,
} from '../types/admin';

export const adminApi = {
  // User management
  getUsers: async (): Promise<UserListResponse> => {
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      headers: defaultHeaders,
    });

    if (!response.ok) {
      return handleApiError(response);
    }

    return response.json();
  },

  getUserById: async (id: string): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
      headers: defaultHeaders,
    });

    if (!response.ok) {
      return handleApiError(response);
    }

    return response.json();
  },

  createUser: async (data: UserRequest): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      return handleApiError(response);
    }

    return response.json();
  },

  updateUser: async (id: string, data: Partial<UserRequest>): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
      method: 'PATCH',
      headers: defaultHeaders,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      return handleApiError(response);
    }

    return response.json();
  },

  deleteUser: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
      method: 'DELETE',
      headers: defaultHeaders,
    });

    if (!response.ok) {
      return handleApiError(response);
    }
  },

  // Dashboard
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await fetch(`${API_BASE_URL}/admin/dashboard/stats`, {
      headers: defaultHeaders,
    });

    if (!response.ok) {
      return handleApiError(response);
    }

    return response.json();
  },

  // System settings
  getSettings: async (): Promise<SystemSettings> => {
    const response = await fetch(`${API_BASE_URL}/admin/settings`, {
      headers: defaultHeaders,
    });

    if (!response.ok) {
      return handleApiError(response);
    }

    return response.json();
  },

  updateSettings: async (data: Partial<SystemSettings>): Promise<SystemSettings> => {
    const response = await fetch(`${API_BASE_URL}/admin/settings`, {
      method: 'PATCH',
      headers: defaultHeaders,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      return handleApiError(response);
    }

    return response.json();
  },
};
