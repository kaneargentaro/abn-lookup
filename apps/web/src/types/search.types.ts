export interface SearchBarProps {
    onSearch: (query: string) => void;
    placeholder?: string;
    defaultValue?: string;
    isLoading?: boolean;
}

export interface InfoBadgeProps {
    text: string;
}
