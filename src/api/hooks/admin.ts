import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../services/admin';
import type {
  User,
  UserListResponse,
  UserRequest,
  DashboardStats,
  SystemSettings,
} from '../types/admin';
import { createQueryKey } from '../config';

const ADMIN_KEYS = {
  all: () => createQueryKey('admin'),
  users: () => createQueryKey('admin', 'users'),
  user: (id: string) => createQueryKey('admin', 'user', { id }),
  dashboard: () => createQueryKey('admin', 'dashboard'),
  settings: () => createQueryKey('admin', 'settings'),
};

// User management hooks
export const useUsers = () => {
  return useQuery<UserListResponse>({
    queryKey: ADMIN_KEYS.users(),
    queryFn: () => adminApi.getUsers(),
  });
};

export const useUser = (id: string) => {
  return useQuery<User>({
    queryKey: ADMIN_KEYS.user(id),
    queryFn: () => adminApi.getUserById(id),
    enabled: !!id,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UserRequest) => adminApi.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ADMIN_KEYS.users(),
      });
      queryClient.invalidateQueries({
        queryKey: ADMIN_KEYS.dashboard(),
      });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<UserRequest> }) =>
      adminApi.updateUser(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: ADMIN_KEYS.user(id),
      });
      queryClient.invalidateQueries({
        queryKey: ADMIN_KEYS.users(),
      });
      queryClient.invalidateQueries({
        queryKey: ADMIN_KEYS.dashboard(),
      });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminApi.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ADMIN_KEYS.users(),
      });
      queryClient.invalidateQueries({
        queryKey: ADMIN_KEYS.dashboard(),
      });
    },
  });
};

// Dashboard hooks
export const useDashboardStats = () => {
  return useQuery<DashboardStats>({
    queryKey: ADMIN_KEYS.dashboard(),
    queryFn: () => adminApi.getDashboardStats(),
    refetchInterval: 60000, // Refetch every minute
  });
};

// Settings hooks
export const useSettings = () => {
  return useQuery<SystemSettings>({
    queryKey: ADMIN_KEYS.settings(),
    queryFn: () => adminApi.getSettings(),
  });
};

export const useUpdateSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<SystemSettings>) => adminApi.updateSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ADMIN_KEYS.settings(),
      });
    },
  });
};
