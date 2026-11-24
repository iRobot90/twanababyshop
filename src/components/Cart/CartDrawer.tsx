'use client';

import { useCartStore } from '@/lib/store';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils';

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
    const { items, removeFromCart, total, addToCart } = useCartStore();
    const cartTotal = total();

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[70] flex flex-col"
                    >
                        <div className="p-6 border-b flex items-center justify-between bg-primary/5">
                            <h2 className="text-2xl font-bold font-outfit text-foreground flex items-center gap-2">
                                <ShoppingBag className="w-6 h-6 text-primary" /> Your Cart
                            </h2>
                            <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
                                    <ShoppingBag className="w-16 h-16 mb-4 text-muted-foreground" />
                                    <p className="text-xl font-medium">Your cart is empty</p>
                                    <button onClick={onClose} className="mt-4 text-primary font-bold hover:underline">
                                        Start Shopping
                                    </button>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <div key={`${item.id}-${item.color}`} className="flex gap-4">
                                        <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-gray-100 shrink-0 border">
                                            {item.image && (<Image src={item.image} alt={item.name} fill className="object-cover" />)}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-lg leading-tight mb-1">{item.name}</h3>
                                            <p className="text-sm text-muted-foreground mb-2">Color: {item.color || 'Standard'}</p>
                                            <div className="flex items-center justify-between">
                                                <p className="font-bold text-primary">{formatCurrency(item.price)}</p>
                                                <div className="flex items-center gap-2 bg-gray-100 rounded-full px-2 py-1">
                                                    <button
                                                        onClick={() => item.quantity > 1 ? addToCart({ ...item, quantity: -1 }) : removeFromCart(item.id)}
                                                        className="p-1 hover:text-red-500"
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </button>
                                                    <span className="text-sm font-semibold w-4 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => addToCart({ ...item, quantity: 0 })} // Logic handles increment
                                                        className="p-1 hover:text-green-500"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {items.length > 0 && (
                            <div className="p-6 border-t bg-gray-50">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-lg font-medium text-muted-foreground">Subtotal</span>
                                    <span className="text-3xl font-bold text-foreground">{formatCurrency(cartTotal)}</span>
                                </div>
                                <Link
                                    href="/checkout"
                                    onClick={onClose}
                                    className="w-full block text-center bg-foreground text-background py-4 rounded-xl font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl"
                                >
                                    Proceed to Checkout
                                </Link>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
