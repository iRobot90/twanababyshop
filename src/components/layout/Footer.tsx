'use client';

import Link from 'next/link';
import { Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-secondary/30 pt-20 pb-10 px-6 border-t border-white/50 relative overflow-hidden">
            {/* Soft background blob */}
            <div className="absolute bottom-0 left-0 w-full h-[500px] bg-gradient-to-t from-white/80 to-transparent pointer-events-none" />

            <div className="container mx-auto relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="text-2xl font-black text-foreground tracking-tighter mb-6 block">
                            Twana<span className="text-primary">.</span>
                        </Link>
                        <p className="text-muted-foreground mb-6 leading-relaxed">
                            Crafting moments of pure joy and comfort for your little ones.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-muted-foreground hover:text-primary hover:scale-110 transition-all shadow-sm">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-muted-foreground hover:text-primary hover:scale-110 transition-all shadow-sm">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-muted-foreground hover:text-primary hover:scale-110 transition-all shadow-sm">
                                <Twitter className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-lg mb-6">Shop</h4>
                        <ul className="space-y-4 text-muted-foreground">
                            <li><Link href="/shop" className="hover:text-primary transition-colors">All Products</Link></li>
                            <li><Link href="/shop" className="hover:text-primary transition-colors">New Arrivals</Link></li>
                            <li><Link href="/shop" className="hover:text-primary transition-colors">Best Sellers</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-lg mb-6">Categories</h4>
                        <ul className="space-y-4 text-muted-foreground">
                            <li><Link href="/shop" className="hover:text-primary transition-colors">Strollers</Link></li>
                            <li><Link href="/shop" className="hover:text-primary transition-colors">Nursery</Link></li>
                            <li><Link href="/shop" className="hover:text-primary transition-colors">Apparel</Link></li>
                            <li><Link href="/shop" className="hover:text-primary transition-colors">Toys</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-lg mb-6">Support</h4>
                        <ul className="space-y-4 text-muted-foreground">
                            <li><Link href="#" className="hover:text-primary transition-colors">Shipping & Returns</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Size Guide</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">FAQ</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Contact Us</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-gray-200/50 text-sm text-muted-foreground">
                    <p>© 2024 Twana Baby Shop. All rights reserved.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <Link href="#" className="hover:text-foreground">Privacy Policy</Link>
                        <Link href="#" className="hover:text-foreground">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
