import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { repositoryApi } from '../services/repository';
import type {
    RepositoryRequest,
    RepositoryResponse,
    RepositoryListResponse,
} from '../types';
import { createQueryKey } from '../config';

const REPOSITORY_KEYS = {
    all: () => createQueryKey('repositories'),
    list: (params?: Record<string, unknown>) => createQueryKey('repositories', params),
    detail: (id: string) => createQueryKey('repository', { id }),
};

export const useRepositories = () => {
    return useQuery<RepositoryListResponse>({
        queryKey: REPOSITORY_KEYS.all(),
        queryFn: () => repositoryApi.getAll(),
    });
};

export const useRepository = (id: string) => {
    return useQuery<RepositoryResponse>({
        queryKey: REPOSITORY_KEYS.detail(id),
        queryFn: () => repositoryApi.getById(id),
    });
};

export const useCreateRepository = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: RepositoryRequest) => repositoryApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: REPOSITORY_KEYS.all(),
            });
        },
    });
};

export const useUpdateRepository = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string;
            data: RepositoryRequest;
        }) => repositoryApi.update(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({
                queryKey: REPOSITORY_KEYS.detail(id),
            });
            queryClient.invalidateQueries({
                queryKey: REPOSITORY_KEYS.all(),
            });
        },
    });
};

export const useDeleteRepository = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => repositoryApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: REPOSITORY_KEYS.all(),
            });
        },
    });
};
