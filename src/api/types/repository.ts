/**
 * Repository visibility types
 */
export type RepositoryVisibility = 'public' | 'private';

/**
 * Repository status
 */
export type RepositoryStatus = 'active' | 'archived' | 'maintenance';

/**
 * API response structure for repository data
 */
export interface RepositoryResponse {
    id: string;
    name: string;
    description?: string;
    url: string;
    visibility: RepositoryVisibility;
    status: RepositoryStatus;
    language?: string;
    stars: number;
    forks: number;
    createdAt: string;
    updatedAt: string;
    owner: {
        name: string;
        avatar?: string;
    };
}

/**
 * API request structure for creating or updating a repository
 */
export interface RepositoryRequest {
    name: string;
    description?: string;
    visibility: RepositoryVisibility;
    language?: string;
}

/**
 * API response structure for listing repositories
 */
export interface RepositoryListResponse {
    repositories: RepositoryResponse[];
    total: number;
}
