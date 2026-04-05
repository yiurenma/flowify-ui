import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { operationApi } from '../services/operation';
import type { WorkFlow } from '../types';
import { createQueryKey } from '../config';

const KEYS = {
  apps: () => createQueryKey('applications'),
  appsList: (p: Record<string, unknown>) => createQueryKey('applications', p),
  workflow: (applicationName: string) => createQueryKey('workflow', { applicationName }),
};

export const useEntitySettings = (params: {
  page?: number;
  size?: number;
  applicationName?: string;
  sort?: string;
}) => {
  return useQuery({
    queryKey: KEYS.appsList(params as Record<string, unknown>),
    queryFn: () => operationApi.listEntitySettings(params),
  });
};

export const useWorkflowQuery = (applicationName: string) => {
  return useQuery({
    queryKey: KEYS.workflow(applicationName),
    queryFn: () => operationApi.getWorkflow(applicationName),
    enabled: !!applicationName,
  });
};

export const useCreateApplication = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (applicationName: string) =>
      operationApi.createEmptyApplication(applicationName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.apps() });
    },
  });
};

export const useSaveWorkflow = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      applicationName,
      workFlow,
    }: {
      applicationName: string;
      workFlow: WorkFlow;
    }) => operationApi.saveWorkflow(applicationName, workFlow),
    onSuccess: (_, { applicationName }) => {
      queryClient.invalidateQueries({ queryKey: KEYS.workflow(applicationName) });
      queryClient.invalidateQueries({ queryKey: KEYS.apps() });
    },
  });
};

export const useDeleteApplication = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (applicationName: string) =>
      operationApi.deleteWorkflow(applicationName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.apps() });
    },
  });
};
