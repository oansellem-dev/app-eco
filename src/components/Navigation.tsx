'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ListTodo, Camera, Trophy, User } from 'lucide-react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

export function Navigation() {
    const pathname = usePathname();

    const navItems = [
        { href: '/', icon: Home, label: 'Accueil' },
        { href: '/missions', icon: ListTodo, label: 'Missions' },
        { href: '/camera', icon: Camera, label: 'Photo', isMain: true },
        { href: '/leaderboard', icon: Trophy, label: 'Classement' },
        { href: '/profile', icon: User, label: 'Profil' },
    ];

    // Don't show nav on auth pages
    if (['/login', '/signup', '/onboarding'].includes(pathname)) {
        return null;
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
            <div className="w-full max-w-[480px] bg-white/90 backdrop-blur-lg border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pb-safe pointer-events-auto">
                <div className="flex items-end justify-around pb-2 pt-2 px-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;

                        if (item.isMain) {
                            return (
                                <Link key={item.href} href={item.href} className="relative -top-6 group">
                                    <motion.div
                                        whileTap={{ scale: 0.9 }}
                                        className="w-16 h-16 bg-primary-dark rounded-full flex items-center justify-center shadow-leaf text-white border-4 border-white group-hover:bg-primary transition-colors"
                                    >
                                        <Icon className="w-8 h-8" />
                                    </motion.div>
                                </Link>
                            );
                        }

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={clsx(
                                    "flex flex-col items-center p-2 rounded-xl transition-colors min-w-[64px]",
                                    isActive ? "text-primary-dark" : "text-gray-400 hover:text-gray-600"
                                )}
                            >
                                <Icon className={clsx("w-6 h-6 mb-1", isActive && "fill-current/20")} />
                                <span className="text-[10px] font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
