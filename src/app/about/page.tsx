'use client';

import Image from 'next/image';

export default function AboutPage() {
    return (
        <main className="min-h-screen pt-24 pb-12 px-6 bg-white overflow-hidden">
            <div className="container mx-auto max-w-4xl">
                <h1 className="text-5xl font-black mb-8 font-outfit text-center">Our Story.</h1>

                <div className="relative aspect-video rounded-3xl overflow-hidden mb-12 shadow-xl">
                    <Image
                        src="https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=2670&auto=format&fit=crop"
                        alt="Twana Founders"
                        fill
                        className="object-cover"
                    />
                </div>

                <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                    <p>
                        <span className="font-bold text-foreground">Twana</span> began with a simple wish: to bring the same comfort and wonder we feel in our dreams to the real world for our little ones.
                    </p>
                    <p>
                        Founded in 2024, we believe that baby essentials shouldn't just be functional—they should be magical. From our anti-gravity strollers to our cloud-soft fabrics, every product is engineered with love and a touch of whimsy.
                    </p>
                    <p>
                        We source strictly organic, sustainable materials because we know the future belongs to the children we're raising today.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 pt-16 border-t">
                    <div className="text-center">
                        <h3 className="text-3xl font-bold text-primary mb-2">100%</h3>
                        <p>Organic Cotton</p>
                    </div>
                    <div className="text-center">
                        <h3 className="text-3xl font-bold text-primary mb-2">24/7</h3>
                        <p>Parent Support</p>
                    </div>
                    <div className="text-center">
                        <h3 className="text-3xl font-bold text-primary mb-2">Kenya</h3>
                        <p>Proudly Local</p>
                    </div>
                </div>
            </div>
        </main>
    );
}
