import { ApiError } from './types';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const defaultHeaders = {
    'Content-Type': 'application/json',
    // Add any default headers here
};

export class ApiErrorImpl extends Error implements ApiError {
    constructor(
        message: string,
        public code: string,
        public status: number,
        public details?: Record<string, unknown>
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

export const handleApiError = async (response: Response): Promise<never> => {
    const error = await response.json();
    throw new ApiErrorImpl(
        error.message || 'An unexpected error occurred',
        error.code || 'UNKNOWN_ERROR',
        response.status,
        error.details
    );
};

export const createQueryKey = (...args: (string | Record<string, unknown>)[]) => {
    return args.filter(Boolean);
}; 