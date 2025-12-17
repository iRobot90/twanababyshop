'use client';

import { Mail, Phone, MapPin } from 'lucide-react';

export default function SupportPage() {
    return (
        <main className="min-h-screen pt-24 pb-12 px-6 bg-gray-50">
            <div className="container mx-auto max-w-5xl">
                <h1 className="text-5xl font-bold mb-12 font-outfit text-center">How can we help?</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Contact Info */}
                    <div id="contact" className="bg-white p-8 rounded-3xl shadow-sm h-fit scroll-mt-32">
                        <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-semibold">Email Us</p>
                                    <p className="text-muted-foreground">hello@twanababyshop.com</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-semibold">Call Us</p>
                                    <p className="text-muted-foreground">+254 700 000 000</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-semibold">Visit Us</p>
                                    <p className="text-muted-foreground">Nairobi, Kenya</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* FAQ & Policies */}
                    <div className="space-y-6">
                        <div id="faq" className="scroll-mt-32">
                            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>

                            <div className="bg-white p-6 rounded-2xl shadow-sm mb-4">
                                <h3 className="font-bold text-lg mb-2">How long is delivery?</h3>
                                <p className="text-muted-foreground">We deliver within 24-48 hours in Nairobi and 3-5 days countrywide.</p>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm mb-4">
                                <h3 className="font-bold text-lg mb-2">Do you have a physical store?</h3>
                                <p className="text-muted-foreground">We are primarily online but offer pickups from our Westlands depot.</p>
                            </div>
                        </div>

                        <div id="shipping" className="scroll-mt-32">
                            <h2 className="text-2xl font-bold mb-6">Policies</h2>
                            <div className="bg-white p-6 rounded-2xl shadow-sm">
                                <h3 className="font-bold text-lg mb-2">Return Policy</h3>
                                <p className="text-muted-foreground">We accept returns within 7 days for unused items in original packaging.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
