'use client';

import { useAuth } from '@/contexts/AuthContext';
import { BADGES } from '@/lib/badgeSystem';
import { EcoCard } from '@/components/ui/EcoCard';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Lock, Trophy } from 'lucide-react';
import clsx from 'clsx';

export default function RewardsPage() {
    const { user } = useAuth();

    if (!user) return null;

    const nextLevelXp = user.level * 100;
    const currentLevelXp = (user.level - 1) * 100;
    const xpInLevel = user.xp - currentLevelXp;
    const xpNeeded = 100; // Simplified: 100 XP per level fixed

    return (
        <div className="mobile-container flex flex-col p-6 pb-24">
            <h1 className="text-2xl font-bold text-ink mb-6">Récompenses</h1>

            <EcoCard className="mb-8 bg-gradient-to-br from-primary-dark to-primary text-white">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <p className="text-white/80 font-medium">Niveau actuel</p>
                        <h2 className="text-4xl font-black">{user.level}</h2>
                    </div>
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <Trophy className="w-8 h-8 text-white" />
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-sm text-white/90">
                        <span>XP: {xpInLevel} / {xpNeeded}</span>
                        <span>{Math.floor((xpInLevel / xpNeeded) * 100)}%</span>
                    </div>
                    <div className="h-3 bg-black/20 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-white rounded-full"
                            style={{ width: `${(xpInLevel / xpNeeded) * 100}%` }}
                        />
                    </div>
                    <p className="text-xs text-white/70 mt-2">
                        Plus que {xpNeeded - xpInLevel} XP pour le niveau {user.level + 1} !
                    </p>
                </div>
            </EcoCard>

            <h3 className="font-bold text-ink mb-4">Badges ({user.badges.length}/{BADGES.length})</h3>

            <div className="grid grid-cols-2 gap-4">
                {BADGES.map(badge => {
                    const isUnlocked = user.badges.includes(badge.id);

                    return (
                        <div
                            key={badge.id}
                            className={clsx(
                                "p-4 rounded-2xl border-2 flex flex-col items-center text-center transition-all",
                                isUnlocked
                                    ? "bg-white border-primary/20 shadow-sm"
                                    : "bg-gray-50 border-gray-100 opacity-70 grayscale"
                            )}
                        >
                            <div className="text-4xl mb-3 relative">
                                {badge.icon}
                                {!isUnlocked && (
                                    <div className="absolute -bottom-1 -right-1 bg-gray-200 p-1 rounded-full">
                                        <Lock className="w-3 h-3 text-gray-500" />
                                    </div>
                                )}
                            </div>
                            <h4 className={clsx("font-bold text-sm mb-1", isUnlocked ? "text-ink" : "text-gray-500")}>
                                {badge.name}
                            </h4>
                            <p className="text-xs text-gray-500">{badge.condition}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
