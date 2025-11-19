import type { CSSProperties } from 'react';
import type { InfoBadgeProps } from '@/types/search.types';

export function InfoBadge({ text }: InfoBadgeProps) {
    return (
        <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-accent" />
            <span>{text}</span>
        </div>
    );
}

interface InfoBadgesProps {
    badges: string[];
    className?: string;
    style?: CSSProperties;
}

export function InfoBadges({ badges, className = '', style }: InfoBadgesProps) {
    return (
        <div
            className={`flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground ${className}`}
            style={style}
        >
            {badges.map((badge) => (
                <InfoBadge key={badge} text={badge} />
            ))}
        </div>
    );
}
