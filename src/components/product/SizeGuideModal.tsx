'use client';

import { motion } from 'framer-motion';
import { X } from 'lucide-react';

export default function SizeGuideModal({ onClose }: { onClose: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl w-full max-w-lg p-8 relative shadow-2xl"
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 hover:bg-black/5 rounded-full transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <h3 className="text-2xl font-bold mb-6">Size Guide</h3>

                <div className="space-y-6">
                    <p className="text-muted-foreground">Our Cloud Nine Stroller is designed to grow with your child.</p>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs uppercase bg-gray-50 text-gray-700">
                                <tr>
                                    <th className="px-4 py-3 rounded-l-lg">Mode</th>
                                    <th className="px-4 py-3">Age Range</th>
                                    <th className="px-4 py-3 rounded-r-lg">Max Weight</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                <tr>
                                    <td className="px-4 py-3 font-medium">Bassinet</td>
                                    <td className="px-4 py-3">0 - 6 Months</td>
                                    <td className="px-4 py-3">9 kg (20 lbs)</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 font-medium">Seat Unit</td>
                                    <td className="px-4 py-3">6 Months - 4 Years</td>
                                    <td className="px-4 py-3">22 kg (48.5 lbs)</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="bg-indigo-50 p-4 rounded-xl text-indigo-900 text-sm">
                        <strong>Tip:</strong> The suspension automatically adjusts to your child's weight for the smoothest ride.
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
