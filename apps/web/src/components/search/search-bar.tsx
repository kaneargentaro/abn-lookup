'use client';

import type { FormEvent } from 'react';
import { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { SearchBarProps } from '@/types/search.types';

export function SearchBar({
    onSearch,
    placeholder = 'Enter ABN or business name...',
    defaultValue = '',
    isLoading = false,
}: SearchBarProps) {
    const [query, setQuery] = useState(defaultValue);
    const [isFocused, setIsFocused] = useState(false);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query.trim());
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="animate-fade-in-up"
            style={{ animationDelay: '100ms' }}
        >
            <div
                className={`
          relative w-full transition-all duration-300 ease-out
          ${isFocused ? 'scale-[1.02]' : 'scale-100'}
        `}
            >
                <div
                    className={`
            relative flex items-center gap-2 bg-background rounded-full
            border-2 transition-all duration-300
            ${
                isFocused
                    ? 'border-accent shadow-[0_0_0_4px_hsl(var(--accent)/0.1)]'
                    : 'border-border shadow-sm hover:shadow-md hover:border-input'
            }
          `}
                >
                    <div className="pl-6 pr-2">
                        <Search
                            className={`
                w-5 h-5 transition-colors duration-300
                ${isFocused ? 'text-accent' : 'text-muted-foreground'}
                              `}
                        />
                    </div>
                    <Input
                        type="text"
                        placeholder={placeholder}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        className="flex-1 border-0 bg-transparent text-base h-14 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground text-foreground"
                    />
                    <div className="pr-2">
                        <Button
                            type="submit"
                            size="lg"
                            className="rounded-full px-8 bg-accent hover:bg-accent/90 text-accent-foreground shadow-sm transition-all duration-200 hover:shadow-md"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Searching...' : 'Search'}
                        </Button>
                    </div>
                </div>

                {/* Animated glow effect when focused */}
                {isFocused && (
                    <div className="absolute inset-0 rounded-full bg-accent/5 -z-10 animate-pulse" />
                )}
            </div>
        </form>
    );
}
