'use client';

export default function SizeGuidePage() {
    return (
        <main className="min-h-screen pt-24 pb-12 px-6 bg-white">
            <div className="container mx-auto max-w-4xl">
                <h1 className="text-4xl font-bold mb-8 font-outfit text-center">Size Guide</h1>
                <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                    Use our size chart to find the perfect fit for your little one. Age recommendations are approximate.
                </p>

                <div className="border rounded-3xl overflow-hidden shadow-sm">
                    <table className="w-full text-left bg-white">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="p-6 font-bold text-foreground">Age Group</th>
                                <th className="p-6 font-bold text-foreground">Size Label</th>
                                <th className="p-6 font-bold text-foreground">Height (cm)</th>
                                <th className="p-6 font-bold text-foreground">Weight (kg)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            <tr>
                                <td className="p-6">Newborn</td>
                                <td className="p-6 font-mono bg-gray-50/50">NB</td>
                                <td className="p-6">Up to 50</td>
                                <td className="p-6">2-4</td>
                            </tr>
                            <tr>
                                <td className="p-6">0-3 Months</td>
                                <td className="p-6 font-mono bg-gray-50/50">0-3m</td>
                                <td className="p-6">50-62</td>
                                <td className="p-6">4-6</td>
                            </tr>
                            <tr>
                                <td className="p-6">3-6 Months</td>
                                <td className="p-6 font-mono bg-gray-50/50">3-6m</td>
                                <td className="p-6">62-68</td>
                                <td className="p-6">6-8</td>
                            </tr>
                            <tr>
                                <td className="p-6">6-12 Months</td>
                                <td className="p-6 font-mono bg-gray-50/50">6-12m</td>
                                <td className="p-6">68-80</td>
                                <td className="p-6">8-10</td>
                            </tr>
                            <tr>
                                <td className="p-6">1-2 Years</td>
                                <td className="p-6 font-mono bg-gray-50/50">1-2y</td>
                                <td className="p-6">80-92</td>
                                <td className="p-6">10-13</td>
                            </tr>
                            <tr>
                                <td className="p-6">2-4 Years</td>
                                <td className="p-6 font-mono bg-gray-50/50">2-4y</td>
                                <td className="p-6">92-104</td>
                                <td className="p-6">13-17</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="mt-12 bg-primary/5 p-8 rounded-3xl">
                    <h3 className="font-bold text-xl mb-4">Tips for Measuring</h3>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                        <li>Measure your baby's height from the top of the head to the heel.</li>
                        <li>Weight is often a better indicator than age for finding the right size.</li>
                        <li>When in doubt, it's usually best to size up for growing room.</li>
                    </ul>
                </div>
            </div>
        </main>
    );
}
