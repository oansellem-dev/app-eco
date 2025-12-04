import { motion } from 'framer-motion';
import { Leaf } from 'lucide-react';

interface ProgressBarProps {
    current: number;
    max: number;
    label?: string;
    showText?: boolean;
}

export function ProgressBar({ current, max, label, showText = true }: ProgressBarProps) {
    const percentage = Math.min(100, Math.max(0, (current / max) * 100));

    return (
        <div className="w-full">
            {showText && (
                <div className="flex justify-between text-sm font-medium mb-1">
                    <span className="text-earth">{label || 'Progression'}</span>
                    <span className="text-primary-dark">{current} / {max} XP</span>
                </div>
            )}

            <div className="h-4 bg-sand rounded-full overflow-hidden relative shadow-inner">
                <motion.div
                    className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full relative"
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2">
                        <Leaf className="w-3 h-3 text-white fill-white rotate-90" />
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
