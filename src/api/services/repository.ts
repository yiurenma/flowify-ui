import { Repository, CreateRepositoryRequest } from '../types/repository';
import { API_BASE_URL, defaultHeaders, handleApiError } from '../config';

export const repositoryApi = {
    getAll: async (): Promise<{ repositories: Repository[], total: number }> => {
        const response = await fetch(`${API_BASE_URL}/repositories`, {
            headers: defaultHeaders
        });
        if (!response.ok) {
            await handleApiError(response);
        }
        return response.json();
    },

    create: async (data: CreateRepositoryRequest): Promise<Repository> => {
        const response = await fetch(`${API_BASE_URL}/repositories`, {
            method: 'POST',
            headers: defaultHeaders,
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            await handleApiError(response);
        }
        return response.json();
    },

    delete: async (id: string): Promise<void> => {
        const response = await fetch(`${API_BASE_URL}/repositories/${id}`, {
            method: 'DELETE',
            headers: defaultHeaders
        });
        if (!response.ok) {
            await handleApiError(response);
        }
    }
};
