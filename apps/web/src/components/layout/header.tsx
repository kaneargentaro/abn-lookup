import Link from 'next/link';
import { Search } from 'lucide-react';
import { NAV_LINKS } from '@/config/links';

export function Header() {
    return (
        <header className="px-6 py-4 border-b border-border bg-background">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                        <Search className="w-4 h-4 text-accent-foreground" />
                    </div>
                    <span className="font-semibold text-lg text-foreground">
                        ABN Lookup
                    </span>
                </div>
                {NAV_LINKS.length > 0 && (
                    <nav className="hidden md:flex items-center gap-6">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                )}
            </div>
        </header>
    );
}
