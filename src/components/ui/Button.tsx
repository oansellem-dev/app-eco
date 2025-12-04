import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import clsx from 'clsx';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends HTMLMotionProps<"button"> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    fullWidth?: boolean;
    children?: React.ReactNode;
}

export function Button({
    children,
    className,
    variant = 'primary',
    size = 'md',
    isLoading,
    fullWidth,
    disabled,
    ...props
}: ButtonProps) {
    const baseStyles = "inline-flex items-center justify-center rounded-xl font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
        primary: "bg-primary-dark text-white hover:bg-primary shadow-lg shadow-primary/30 focus:ring-primary",
        secondary: "bg-primary-light/20 text-primary-dark hover:bg-primary-light/30 focus:ring-primary-light",
        outline: "border-2 border-primary text-primary hover:bg-primary-light/10 focus:ring-primary",
        ghost: "text-primary-dark hover:bg-primary-light/10 focus:ring-primary-light"
    };

    const sizes = {
        sm: "py-1.5 px-3 text-xs",
        md: "py-3 px-6 text-sm sm:text-base",
        lg: "py-4 px-8 text-base sm:text-lg"
    };

    return (
        <motion.button
            whileTap={{ scale: 0.98 }}
            className={clsx(
                baseStyles,
                variants[variant],
                sizes[size],
                fullWidth && "w-full",
                className
            )}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {children}
        </motion.button>
    );
}
