import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { workflowApi } from '../services/workflow';
import type {
    WorkflowRequest,
    WorkflowResponse,
    WorkflowListResponse,
} from '../types';
import { createQueryKey } from '../config';

const WORKFLOW_KEYS = {
    all: () => createQueryKey('workflows'),
    list: (params?: Record<string, unknown>) => params ? createQueryKey('workflows', params) : createQueryKey('workflows'),
    detail: (id: string) => createQueryKey('workflow', { id }),
};

export const useWorkflows = () => {
    return useQuery<WorkflowListResponse>({
        queryKey: WORKFLOW_KEYS.all(),
        queryFn: () => workflowApi.getAll(),
    });
};

export const useWorkflow = (id: string) => {
    return useQuery<WorkflowResponse>({
        queryKey: WORKFLOW_KEYS.detail(id),
        queryFn: () => workflowApi.getById(id),
    });
};

export const useCreateWorkflow = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: WorkflowRequest) => workflowApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: WORKFLOW_KEYS.all(),
            });
        },
    });
};

export const useUpdateWorkflow = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string;
            data: WorkflowRequest;
        }) => workflowApi.update(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({
                queryKey: WORKFLOW_KEYS.detail(id),
            });
            queryClient.invalidateQueries({
                queryKey: WORKFLOW_KEYS.all(),
            });
        },
    });
};

export const useDeleteWorkflow = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => workflowApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: WORKFLOW_KEYS.all(),
            });
        },
    });
}; 