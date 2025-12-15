import { API_BASE_URL, defaultHeaders, handleApiError } from '../config';
import type {
    RepositoryCreateRequest,
    RepositoryListResponse,
    RepositoryResponse,
    RepositoryUpdateRequest,
} from '../types';

export const repositoryApi = {
    create: async (data: RepositoryCreateRequest): Promise<RepositoryResponse> => {
        const response = await fetch(`${API_BASE_URL}/repositories`, {
            method: 'POST',
            headers: defaultHeaders,
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            return handleApiError(response);
        }

        return response.json();
    },

    getAll: async (): Promise<RepositoryListResponse> => {
        const response = await fetch(`${API_BASE_URL}/repositories`, {
            headers: defaultHeaders,
        });

        if (!response.ok) {
            return handleApiError(response);
        }

        return response.json();
    },

    getById: async (id: string): Promise<RepositoryResponse> => {
        const response = await fetch(`${API_BASE_URL}/repositories/${id}`, {
            headers: defaultHeaders,
        });

        if (!response.ok) {
            return handleApiError(response);
        }

        return response.json();
    },

    update: async (id: string, data: RepositoryUpdateRequest): Promise<RepositoryResponse> => {
        const response = await fetch(`${API_BASE_URL}/repositories/${id}`, {
            method: 'PATCH',
            headers: defaultHeaders,
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            return handleApiError(response);
        }

        return response.json();
    },

    delete: async (id: string): Promise<void> => {
        const response = await fetch(`${API_BASE_URL}/repositories/${id}`, {
            method: 'DELETE',
            headers: defaultHeaders,
        });

        if (!response.ok) {
            return handleApiError(response);
        }
    },
};
