export interface Repository {
    id: string;
    name: string;
    description?: string;
    url: string;
    visibility: 'public' | 'private' | 'internal';
    language?: string;
    createdAt: string;
    updatedAt: string;
}

export interface RepositoryResponse extends Repository {}

export interface CreateRepositoryRequest {
    name: string;
    description?: string;
    visibility: 'public' | 'private' | 'internal';
    readme?: boolean;
}
