'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ConfettiLeaves } from './animations/ConfettiLeaves';

interface LevelUpAnimationProps {
    level: number;
    onComplete: () => void;
}

export function LevelUpAnimation({ level, onComplete }: LevelUpAnimationProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={onComplete}
        >
            <ConfettiLeaves />

            <div className="relative flex flex-col items-center">
                {/* Aura Effect */}
                <motion.div
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 bg-primary rounded-full blur-3xl"
                />

                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", duration: 1 }}
                    className="relative z-10 w-40 h-40 bg-gradient-to-br from-primary-light to-primary-dark rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(76,175,80,0.6)] border-4 border-white"
                >
                    <div className="text-center text-white">
                        <p className="text-sm font-bold uppercase tracking-widest opacity-80">Niveau</p>
                        <p className="text-6xl font-black">{level}</p>
                    </div>
                </motion.div>

                <motion.h2
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="relative z-10 text-4xl font-bold text-white mt-8 text-center"
                >
                    Niveau Supérieur !
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="relative z-10 text-white/80 mt-4"
                >
                    Touchez pour continuer
                </motion.p>
            </div>
        </motion.div>
    );
}
