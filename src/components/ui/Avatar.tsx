import clsx from 'clsx';
import { motion } from 'framer-motion';

interface AvatarProps {
    src?: string;
    alt?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    level?: number;
    animateLevelUp?: boolean;
}

export function Avatar({ src, alt, size = 'md', level, animateLevelUp }: AvatarProps) {
    const sizeClasses = {
        sm: "w-8 h-8",
        md: "w-12 h-12",
        lg: "w-20 h-20",
        xl: "w-32 h-32"
    };

    const badgeSizes = {
        sm: "w-4 h-4 text-[10px]",
        md: "w-5 h-5 text-xs",
        lg: "w-8 h-8 text-sm",
        xl: "w-10 h-10 text-base"
    };

    return (
        <div className="relative inline-block">
            <motion.div
                animate={animateLevelUp ? {
                    boxShadow: ["0 0 0 0px rgba(76, 175, 80, 0)", "0 0 0 10px rgba(76, 175, 80, 0.5)", "0 0 0 20px rgba(76, 175, 80, 0)"],
                } : {}}
                transition={{ duration: 1.5, repeat: animateLevelUp ? Infinity : 0 }}
                className={clsx(
                    "rounded-full border-2 border-primary overflow-hidden bg-sand",
                    sizeClasses[size]
                )}
            >
                {src ? (
                    <img src={src} alt={alt || "Avatar"} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-primary-dark font-bold">
                        {alt?.charAt(0).toUpperCase() || "?"}
                    </div>
                )}
            </motion.div>

            {level !== undefined && (
                <div className={clsx(
                    "absolute -bottom-1 -right-1 bg-primary-dark text-white rounded-full flex items-center justify-center font-bold border-2 border-white",
                    badgeSizes[size]
                )}>
                    {level}
                </div>
            )}
        </div>
    );
}
