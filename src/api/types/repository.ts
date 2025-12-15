/**
 * Repository visibility.
 * Keep it minimal for the first iteration.
 */
export type RepositoryVisibility = 'public' | 'private';

/**
 * API response structure for repository data.
 */
export interface RepositoryResponse {
    id: string;
    name: string;
    description?: string;
    visibility: RepositoryVisibility;
    defaultBranch: string;
    archived: boolean;
    createdAt: string;
    updatedAt: string;
}

/**
 * API request structure for creating a repository.
 */
export interface RepositoryCreateRequest {
    name: string;
    description?: string;
    visibility: RepositoryVisibility;
}

/**
 * API request structure for updating a repository.
 */
export interface RepositoryUpdateRequest {
    name?: string;
    description?: string;
    visibility?: RepositoryVisibility;
    archived?: boolean;
    defaultBranch?: string;
}

/**
 * API response structure for listing repositories.
 */
export interface RepositoryListResponse {
    repositories: RepositoryResponse[];
    total: number;
}
