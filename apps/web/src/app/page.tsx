import { SearchInterface } from '@/components/search/search-interface';
import { Footer, Header } from '@/components/layout';

export default function Home() {
    return (
        <main className="min-h-screen flex flex-col">
            <Header />
            <SearchInterface />
            <Footer />
        </main>
    );
}
