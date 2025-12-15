/**
 * User role types for admin management
 */
export type UserRole = 'admin' | 'user' | 'viewer';

/**
 * User status
 */
export type UserStatus = 'active' | 'inactive' | 'suspended';

/**
 * User information structure
 */
export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  avatar?: string;
}

/**
 * User list response
 */
export interface UserListResponse {
  users: User[];
  total: number;
}

/**
 * User creation/update request
 */
export interface UserRequest {
  username: string;
  email: string;
  role: UserRole;
  status?: UserStatus;
  password?: string;
}

/**
 * Dashboard statistics
 */
export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalWorkflows: number;
  publishedWorkflows: number;
  systemHealth: 'healthy' | 'warning' | 'error';
  recentActivity: ActivityLog[];
}

/**
 * Activity log entry
 */
export interface ActivityLog {
  id: string;
  userId: string;
  username: string;
  action: string;
  resource: string;
  timestamp: string;
  details?: Record<string, unknown>;
}

/**
 * System settings
 */
export interface SystemSettings {
  siteName: string;
  siteDescription: string;
  maintenanceMode: boolean;
  maxUsers: number;
  allowRegistration: boolean;
  sessionTimeout: number;
}
