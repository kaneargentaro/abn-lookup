'use client';

import type { ABNEntity } from '@/types/api.types';
import { EmptyState } from '@/components/search/search-states';
import { SearchResultCard } from '@/components/search';

interface SearchResultsProps {
    results: ABNEntity[];
    query: string;
}

export function SearchResults({ results, query }: SearchResultsProps) {
    if (results.length === 0) {
        return <EmptyState />;
    }

    return (
        <div className="space-y-4">
            <div className="text-sm text-muted-foreground mb-4">
                Found {results.length}{' '}
                {results.length === 1 ? 'result' : 'results'} for &#34;{query}
                &#34;
            </div>

            {results.map((entity) => (
                <SearchResultCard key={entity.abn} entity={entity} />
            ))}
        </div>
    );
}
