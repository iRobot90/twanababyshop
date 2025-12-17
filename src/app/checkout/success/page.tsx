'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, ShoppingBag, ArrowRight } from 'lucide-react';
import { useEffect } from 'react';
import confetti from 'canvas-confetti';

export default function OrderSuccessPage() {

    useEffect(() => {
        // Trigger confetti on load
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen pt-24 pb-12 px-6 bg-gray-50 flex items-center justify-center">
            <div className="max-w-md w-full text-center">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8"
                >
                    <Check className="w-12 h-12 text-green-600" />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h1 className="text-3xl font-bold font-outfit mb-4 text-foreground">Order Confirmed!</h1>
                    <p className="text-muted-foreground mb-8 text-lg">
                        Thank you for your purchase. We've sent a detailed confirmation email to your inbox.
                    </p>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 text-left">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-primary/10 p-3 rounded-lg">
                                <ShoppingBag className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <p className="font-bold">Order #TWA-8839</p>
                                <p className="text-sm text-muted-foreground">Preparing for shipment</p>
                            </div>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-primary w-1/4 rounded-full" />
                        </div>
                    </div>

                    <Link
                        href="/"
                        className="w-full bg-foreground text-white py-4 rounded-xl font-bold hover:bg-foreground/90 transition-colors flex items-center justify-center gap-2"
                    >
                        Continue Shopping <ArrowRight className="w-5 h-5" />
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}
