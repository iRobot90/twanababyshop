'use client';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Menu, Search, X } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Header() {
    const { openCart, items } = useCartStore();
    const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/shop?search=${encodeURIComponent(searchQuery)}`);
            setSearchQuery('');
            setIsMenuOpen(false);
        }
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 px-6 py-3 transition-all duration-300 backdrop-blur-md bg-white/60 border-b border-white/40 shadow-sm">
            <div className="flex items-center justify-between max-w-7xl mx-auto">
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-2 hover:scale-105 transition-transform duration-300">
                        <span className="text-3xl md:text-4xl font-black font-outfit tracking-tighter text-foreground">
                            Twana<span className="text-primary">.</span>
                        </span>
                    </Link>

                    {/* Desktop Search */}
                    <form onSubmit={handleSearch} className="hidden md:flex items-center bg-white/50 border border-white/50 rounded-full px-4 py-2 w-64 focus-within:w-80 focus-within:bg-white focus-within:shadow-md transition-all duration-300">
                        <Search className="w-4 h-4 text-muted-foreground mr-2" />
                        <input
                            type="text"
                            placeholder="Search essentials..."
                            className="bg-transparent border-none outline-none text-sm w-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </form>
                </div>

                <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-foreground/80">
                    <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                    <Link href="/shop" className="hover:text-primary transition-colors">Shop</Link>
                    <Link href="/categories" className="hover:text-primary transition-colors">Categories</Link>
                </nav>

                <div className="flex items-center gap-4">
                    <button
                        onClick={openCart}
                        className="p-3 rounded-full hover:bg-primary/10 transition-colors relative group"
                    >
                        <ShoppingBag className="w-6 h-6 text-foreground group-hover:text-primary transition-colors" />
                        {itemCount > 0 && (
                            <span className="absolute top-1 right-1 w-4 h-4 bg-accent rounded-full animate-bounce ring-2 ring-white flex items-center justify-center text-[10px] font-bold text-white">
                                {itemCount}
                            </span>
                        )}
                    </button>
                    <button
                        className="md:hidden p-2 rounded-full hover:bg-black/5 transition-colors"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-xl p-6 flex flex-col gap-4 animate-in slide-in-from-top-2">
                    <form onSubmit={handleSearch} className="flex items-center bg-gray-50 border border-gray-100 rounded-full px-4 py-3">
                        <Search className="w-4 h-4 text-muted-foreground mr-2" />
                        <input
                            type="text"
                            placeholder="Search essentials..."
                            className="bg-transparent border-none outline-none text-sm w-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </form>
                    <Link href="/" className="text-lg font-medium p-2 hover:bg-gray-50 rounded-lg" onClick={() => setIsMenuOpen(false)}>Home</Link>
                    <Link href="/shop" className="text-lg font-medium p-2 hover:bg-gray-50 rounded-lg" onClick={() => setIsMenuOpen(false)}>Shop</Link>
                    <Link href="/categories" className="text-lg font-medium p-2 hover:bg-gray-50 rounded-lg" onClick={() => setIsMenuOpen(false)}>Categories</Link>
                </div>
            )}
        </header>
    );
}
