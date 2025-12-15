import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { repositoryApi } from '../services/repository';
import { CreateRepositoryRequest } from '../types/repository';
import { createQueryKey } from '../config';

const REPOSITORY_KEYS = {
    all: () => createQueryKey('repositories'),
};

export const useRepositories = () => {
    return useQuery({
        queryKey: REPOSITORY_KEYS.all(),
        queryFn: () => repositoryApi.getAll(),
    });
};

export const useCreateRepository = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateRepositoryRequest) => repositoryApi.create(data),
        onSuccess: () => {
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
