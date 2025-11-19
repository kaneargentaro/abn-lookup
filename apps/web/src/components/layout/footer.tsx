import Link from 'next/link';
import { FOOTER_LINKS } from '@/config/links';

export function Footer({}) {
    return (
        <footer className="px-6 py-6 border-t border-border bg-background">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-foreground">
                <p>
                    © 2025 ABN Lookup. Data provided by Australian Business
                    Register.
                </p>
                {FOOTER_LINKS.length > 0 && (
                    <div className="flex items-center gap-6">
                        {FOOTER_LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </footer>
    );
}
