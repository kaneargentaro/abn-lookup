'use client';

import { useState } from 'react';
import {
    SearchBar,
    SearchHero,
    SearchResults,
    LoadingState,
    ErrorState,
} from '@/components/search';
import { InfoBadges } from '@/components/ui/info-badges';
import { useABNSearch } from '@/hooks/use-abn-search';

const INFO_BADGES = ['Real-time data', 'Official ABR registry', 'Free to use'];

export function SearchInterface() {
    const [submittedQuery, setSubmittedQuery] = useState('');

    const { data, isLoading, isError, error, refetch } =
        useABNSearch(submittedQuery);

    const handleSearch = (query: string) => {
        setSubmittedQuery(query);
    };

    const showResults = submittedQuery.length > 0;
    console.log(data);
    return (
        <div className="flex-1 flex flex-col items-center justify-center px-4">
            <div className="w-full max-w-2xl space-y-8">
                <SearchHero />
                <SearchBar onSearch={handleSearch} isLoading={isLoading} />
                <InfoBadges
                    badges={INFO_BADGES}
                    className="animate-fade-in"
                    style={{ animationDelay: '200ms' }}
                />
            </div>

            {showResults && (
                <div className="w-full max-w-3xl mt-12 mb-8">
                    {isLoading && <LoadingState />}

                    {isError && error && (
                        <ErrorState error={error} onRetry={() => refetch()} />
                    )}

                    {!isLoading && !isError && data && (
                        <SearchResults
                            results={data.results}
                            query={data.query}
                        />
                    )}
                </div>
            )}
        </div>
    );
}
