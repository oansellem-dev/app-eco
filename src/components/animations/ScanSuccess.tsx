'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export function ScanSuccess({ points }: { points: number }) {
    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
            {/* Flash effect */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.8, 0] }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 bg-success"
            />

            {/* Success Content */}
            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.5, opacity: 0 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="relative z-10 flex flex-col items-center"
            >
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg mb-4">
                    <Check className="w-12 h-12 text-success" strokeWidth={4} />
                </div>
                <div className="text-white font-bold text-4xl drop-shadow-lg">
                    +{points} PTS
                </div>
            </motion.div>
        </div>
    );
}
