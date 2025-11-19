'use client';

import { Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function LoadingState() {
    return (
        <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-accent animate-spin mb-4" />
            <p className="text-muted-foreground">Searching ABN registry...</p>
        </div>
    );
}

interface ErrorStateProps {
    error: Error;
    onRetry?: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
                Something went wrong
            </h3>
            <p className="text-muted-foreground text-center mb-4 max-w-md">
                {error.message ||
                    'An unexpected error occurred while searching.'}
            </p>
            {onRetry && (
                <Button onClick={onRetry} variant="default">
                    Try Again
                </Button>
            )}
        </div>
    );
}

export function EmptyState() {
    return (
        <div className="text-center py-12 text-muted-foreground">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
                No results found
            </h3>
            <p className="text-slate-600">
                No businesses found matching search term. Try a different search
                term.
            </p>
        </div>
    );
}
