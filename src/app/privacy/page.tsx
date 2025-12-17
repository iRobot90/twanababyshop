'use client';

export default function PrivacyPage() {
    return (
        <main className="min-h-screen pt-24 pb-12 px-6 bg-white">
            <div className="container mx-auto max-w-4xl">
                <h1 className="text-4xl font-bold mb-8 font-outfit">Privacy Policy</h1>
                <div className="space-y-6 text-muted-foreground leading-relaxed">
                    <p>Last updated: December 2025</p>
                    <p>
                        At Twana Baby Shop, your privacy is our priority. We are committed to protecting your personal information and being transparent about what we collect.
                    </p>

                    <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">1. Information We Collect</h2>
                    <p>
                        We collect information you provide directly to us when you create an account, make a purchase, or contact us. This includes your name, email address, phone number, and shipping address.
                    </p>

                    <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">2. How We Use Your Information</h2>
                    <p>
                        We use your information to:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Process your orders and payments.</li>
                        <li>Communicate with you about your order status.</li>
                        <li>Send you promotional emails (only if you opt-in).</li>
                        <li>Improve our website and customer service.</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">3. Data Security</h2>
                    <p>
                        We implement appropriate security measures to protect your personal information against unauthorized access or disclosure.
                    </p>
                </div>
            </div>
        </main>
    );
}
