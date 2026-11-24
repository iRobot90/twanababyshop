import { Mail } from 'lucide-react';

const contact = 'jesse.amianda@chrisdevcode.com';
const linkFocus = 'rounded underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gray-950';

export default function SupportPage() {
    return (
        <main className="min-h-screen bg-gray-50 px-6 pb-12 pt-24">
            <div className="container mx-auto max-w-5xl">
                <h1 className="mb-12 text-center font-outfit text-4xl font-bold sm:text-5xl">How can we help?</h1>
                <div className="grid gap-8 md:grid-cols-2">
                    <section id="contact" className="min-w-0 scroll-mt-32 rounded-3xl bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-2xl font-bold">Contact Twaana</h2>
                        <p className="mb-4 text-muted-foreground">Email us with questions about a product or this website. For an order question, include the order reference if you have one.</p>
                        <a href={`mailto:${contact}`} className={`inline-flex max-w-full items-start gap-2 font-semibold ${linkFocus}`}>
                            <Mail aria-hidden="true" className="h-5 w-5 shrink-0" />
                            <span className="break-all">{contact}</span>
                        </a>
                    </section>
                    <div className="space-y-6">
                        <section id="faq" className="scroll-mt-32 rounded-2xl bg-white p-6 shadow-sm">
                            <h2 className="mb-4 text-2xl font-bold">Frequently asked questions</h2>
                            <p className="text-muted-foreground">Not sure about a size or specification? <a href="#contact" className={linkFocus}>Email us</a> with the product name and your question.</p>
                        </section>
                        <section id="shipping" className="scroll-mt-32 rounded-2xl bg-white p-6 shadow-sm">
                            <h2 className="mb-4 text-2xl font-bold">Delivery and return questions</h2>
                            <p className="text-muted-foreground"><a href="#contact" className={linkFocus}>Contact us</a> to ask about delivery options, timing or return terms for an item.</p>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    );
}
