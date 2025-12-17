'use client';

import { useState } from 'react';
import { useCartStore } from '@/lib/store';
import { createOrder } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Check, CreditCard, Smartphone, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils';

export default function CheckoutPage() {
    const { items, total, clearCart } = useCartStore();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'card'>('mpesa');

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        address: '',
        postal_code: '',
        city: '',
        mpesa_phone: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Prepare Order Data
            const orderPayload = {
                first_name: formData.first_name,
                last_name: formData.last_name,
                email: formData.email,
                address: formData.address,
                postal_code: formData.postal_code,
                city: formData.city,
                cart_items: items.map(item => ({
                    product_id: item.id,
                    price: item.price,
                    quantity: item.quantity
                }))
            };

            // 2. Simulate Payment Delay (M-Pesa / Stripe)
            await new Promise(resolve => setTimeout(resolve, 2000));

            // 3. Create Order in Backend
            await createOrder(orderPayload);

            setSuccess(true);
            clearCart();

            // Redirect after success
            router.push('/checkout/success');

        } catch (error) {
            console.error('Checkout failed', error);
            alert('Checkout failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-green-50">
                <div className="text-center p-12 bg-white rounded-3xl shadow-xl max-w-md w-full animate-bounce-slow">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check className="w-12 h-12 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-foregound mb-4">Order Confirmed!</h1>
                    <p className="text-muted-foreground mb-8">Thank you for shopping with Twana. Your cozy goodies are on their way!</p>
                    <button onClick={() => router.push('/')} className="bg-primary text-white px-8 py-3 rounded-full font-bold">
                        Back to Home
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">

                {/* Order Summary */}
                <div className="bg-white p-8 rounded-3xl shadow-sm h-fit">
                    <h2 className="text-2xl font-bold mb-6 font-outfit">Order Summary</h2>
                    <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto">
                        {items.map(item => (
                            <div key={item.id} className="flex gap-4 py-4 border-b last:border-0">
                                <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                                    {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" />}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold">{item.name}</h4>
                                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                    <p className="text-primary font-bold">{formatCurrency(item.price * item.quantity)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="border-t pt-6 space-y-2">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span className="font-bold">{formatCurrency(total())}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Shipping</span>
                            <span className="font-bold text-green-600">Free</span>
                        </div>
                        <div className="flex justify-between text-xl font-black mt-4 pt-4 border-t">
                            <span>Total</span>
                            <span>{formatCurrency(total())}</span>
                        </div>
                    </div>
                </div>

                {/* Checkout Form */}
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="bg-white p-8 rounded-3xl shadow-sm">
                        <h2 className="text-2xl font-bold mb-6 font-outfit">Shipping Details</h2>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="col-span-1">
                                <label className="block text-sm font-medium mb-2">First Name</label>
                                <input required type="text" className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-primary focus:outline-none"
                                    onChange={e => setFormData({ ...formData, first_name: e.target.value })}
                                />
                            </div>
                            <div className="col-span-1">
                                <label className="block text-sm font-medium mb-2">Last Name</label>
                                <input required type="text" className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-primary focus:outline-none"
                                    onChange={e => setFormData({ ...formData, last_name: e.target.value })}
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium mb-2">Email Address</label>
                                <input required type="email" className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-primary focus:outline-none"
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium mb-2">Street Address</label>
                                <input required type="text" className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-primary focus:outline-none"
                                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">City</label>
                                <input required type="text" className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-primary focus:outline-none"
                                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Postal Code</label>
                                <input required type="text" className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-primary focus:outline-none"
                                    onChange={e => setFormData({ ...formData, postal_code: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-3xl shadow-sm">
                        <h2 className="text-2xl font-bold mb-6 font-outfit">Payment Method</h2>
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <button
                                type="button"
                                onClick={() => setPaymentMethod('mpesa')}
                                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === 'mpesa' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 hover:border-gray-300'}`}
                            >
                                <Smartphone className="w-8 h-8" />
                                <span className="font-bold">M-Pesa</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setPaymentMethod('card')}
                                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === 'card' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300'}`}
                            >
                                <CreditCard className="w-8 h-8" />
                                <span className="font-bold">Card</span>
                            </button>
                        </div>

                        {paymentMethod === 'mpesa' && (
                            <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                                <label className="block text-sm font-medium mb-2 text-green-800">M-Pesa Phone Number</label>
                                <input
                                    required
                                    type="tel"
                                    placeholder="0712 345 678"
                                    className="w-full p-3 rounded-lg border-2 border-green-200 focus:outline-none focus:border-green-500"
                                    onChange={e => setFormData({ ...formData, mpesa_phone: e.target.value })}
                                />
                                <p className="text-xs text-green-600 mt-2">You will receive a prompt to enter your PIN.</p>
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading || items.length === 0}
                        className="w-full bg-foreground text-background py-5 rounded-2xl font-black text-xl hover:scale-[1.01] active:scale-[0.99] transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" /> Processing...
                            </>
                        ) : (
                            `Pay ${formatCurrency(total())}`
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
