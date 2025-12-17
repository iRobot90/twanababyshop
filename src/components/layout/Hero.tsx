'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Cloud } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
    return (
        <section className="relative w-full h-screen flex flex-col justify-center items-center overflow-hidden bg-gradient-to-b from-blue-50 to-background">
            {/* Floating Background Clouds */}
            <motion.div
                animate={{ x: [0, 20, 0], y: [0, -10, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[15%] left-[10%] text-blue-100 opacity-80"
            >
                <Cloud size={180} fill="currentColor" />
            </motion.div>

            <motion.div
                animate={{ x: [0, -30, 0], y: [0, 15, 0] }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-[20%] right-[10%] text-pink-100 opacity-80"
            >
                <Cloud size={240} fill="currentColor" />
            </motion.div>

            <div className="container mx-auto px-6 z-10 flex flex-col items-center text-center">
                <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="inline-block py-2 px-4 rounded-full bg-white/60 backdrop-blur border border-white/50 text-sm font-bold tracking-wider uppercase mb-6 text-primary shadow-sm"
                >
                    ✨ New Arrivals: Winter Snuggles
                </motion.span>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="text-6xl md:text-8xl font-black tracking-tight text-foreground mb-6 font-outfit drop-shadow-sm"
                >
                    <span className="text-secondary">Float</span> on <span className="text-primary italic">Cloud Nine</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="max-w-2xl text-xl text-muted-foreground mb-10 leading-relaxed font-medium"
                >
                    The softest, dreamiest essentials for your little stars.
                    Designed for happy wiggles and peaceful naps.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-4"
                >
                    <Link href="/shop" className="group relative px-8 py-4 bg-primary text-white rounded-full font-bold text-lg overflow-hidden transition-all hover:scale-105 shadow-xl hover:shadow-primary/40 hover:-translate-y-1">
                        <span className="relative z-10 flex items-center gap-2">
                            Shop Collection <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </span>
                    </Link>
                    <Link href="/about" className="px-8 py-4 bg-white border-2 border-secondary/30 text-secondary-foreground rounded-full font-bold text-lg hover:bg-secondary/10 transition-all hover:scale-105">
                        Explore Our World
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
