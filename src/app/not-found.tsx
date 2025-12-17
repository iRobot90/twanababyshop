'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 overflow-hidden relative">
            <div className="text-center z-10 px-6">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="text-9xl font-black text-primary/20 select-none mb-4">404</div>
                    <h1 className="text-4xl md:text-6xl font-bold font-outfit mb-6 text-foreground">
                        Lost inside the <span className="text-primary">Clouds?</span>
                    </h1>
                    <p className="text-xl text-muted-foreground mb-10 max-w-md mx-auto">
                        The page you're looking for seems to have floated away. Let's get you back to solid ground.
                    </p>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 bg-foreground text-white px-8 py-4 rounded-full font-bold hover:scale-105 transition-transform shadow-lg"
                    >
                        <ArrowLeft className="w-5 h-5" /> Back Home
                    </Link>
                </motion.div>
            </div>

            {/* Background Floating Elements */}
            <motion.div
                animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-100 rounded-full blur-3xl opacity-50 -z-10"
            />
            <motion.div
                animate={{ y: [0, 30, 0], x: [0, -10, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-pink-100 rounded-full blur-3xl opacity-50 -z-10"
            />
        </div>
    );
}
