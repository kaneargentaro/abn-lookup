import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { Inter } from 'next/font/google';

import { QueryProvider } from '@/components/providers/query-provider';
import './globals.css';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-sans',
    display: 'swap',
});

export const metadata: Metadata = {
    title: 'ABN Lookup - Australian Business Number Search',
    description:
        'Search and lookup Australian Business Numbers (ABN) quickly and easily',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    return (
        <html lang="en" className={inter.variable}>
            <body className={`antialiased`}>
                <QueryProvider>{children}</QueryProvider>
            </body>
        </html>
    );
}
