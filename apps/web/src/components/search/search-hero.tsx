interface SearchHeroProps {
    title?: string;
    description?: string;
}

export function SearchHero({
    title = 'Australian Business Number Search',
    description = 'Search for any registered Australian business by ABN or business name',
}: SearchHeroProps) {
    return (
        <div className="text-center space-y-3 animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl font-bold text-primary">
                {title}
            </h1>
            <p className="text-lg text-muted-foreground">{description}</p>
        </div>
    );
}
