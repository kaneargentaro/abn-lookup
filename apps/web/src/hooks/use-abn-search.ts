'use client';

import { useQuery } from '@tanstack/react-query';
import { searchABN, APIException } from '@/lib/api-client';
import type { ABNSearchResponse } from '@/types/api.types';

export const abnKeys = {
    all: ['abn'] as const,
    searches: () => [...abnKeys.all, 'search'] as const,
    search: (query: string) => [...abnKeys.searches(), query] as const,
};

interface UseABNSearchOptions {
    enabled?: boolean;
}

export function useABNSearch(query: string, options?: UseABNSearchOptions) {
    return useQuery<ABNSearchResponse, APIException>({
        queryKey: abnKeys.search(query),
        queryFn: () => searchABN(query),
        enabled: options?.enabled !== false && query.trim().length > 0,
        retry: (failureCount, error) => {
            if (error.statusCode >= 400 && error.statusCode < 500) {
                return false;
            }
            return failureCount < 1;
        },
    });
}
