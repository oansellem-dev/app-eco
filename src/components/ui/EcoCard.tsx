import { motion } from 'framer-motion';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface EcoCardProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'default' | 'success' | 'warning';
    animate?: boolean;
    onClick?: () => void;
}

export function EcoCard({
    children,
    className,
    variant = 'default',
    animate = true,
    onClick
}: EcoCardProps) {
    const baseStyles = "rounded-2xl p-4 relative overflow-hidden transition-all duration-300";

    const variants = {
        default: "bg-white shadow-leaf border border-primary-light/20",
        success: "bg-sand border border-success/30 shadow-sm",
        warning: "bg-orange-50 border border-warning/30 shadow-sm"
    };

    const content = (
        <div
            className={twMerge(baseStyles, variants[variant], className)}
            onClick={onClick}
        >
            {/* Subtle leaf texture overlay */}
            <div className="absolute top-0 right-0 w-24 h-24 opacity-[0.03] pointer-events-none -mr-8 -mt-8 rotate-12">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                    <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
                </svg>
            </div>

            <div className="relative z-10">
                {children}
            </div>
        </div>
    );

    if (animate) {
        return (
            <motion.div
                whileHover={onClick ? { y: -4, boxShadow: "0 10px 25px -5px rgba(76, 175, 80, 0.3)" } : undefined}
                whileTap={onClick ? { scale: 0.98 } : undefined}
            >
                {content}
            </motion.div>
        );
    }

    return content;
}
