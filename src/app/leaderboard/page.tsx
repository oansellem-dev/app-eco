'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getLeaderboardData, getCampusLeaderboard, LeaderboardUser, CampusRanking } from '@/lib/leaderboardLogic';
import { Avatar } from '@/components/ui/Avatar';
import { EcoCard } from '@/components/ui/EcoCard';
import { Trophy, Medal, Users } from 'lucide-react';
import clsx from 'clsx';

export default function LeaderboardPage() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'individual' | 'campus'>('individual');
    const [users, setUsers] = useState<LeaderboardUser[]>([]);
    const [campusRankings, setCampusRankings] = useState<CampusRanking[]>([]);

    useEffect(() => {
        const loadData = async () => {
            const u = await getLeaderboardData();
            setUsers(u);
            const c = await getCampusLeaderboard();
            setCampusRankings(c);
        };
        loadData();
    }, []);

    if (!user) return null;

    return (
        <div className="mobile-container flex flex-col p-6 pb-24">
            <h1 className="text-2xl font-bold text-ink mb-6">Classement</h1>

            <div className="flex p-1 bg-gray-100 rounded-xl mb-6">
                <button
                    onClick={() => setActiveTab('individual')}
                    className={clsx(
                        "flex-1 py-2 text-sm font-bold rounded-lg transition-all",
                        activeTab === 'individual' ? "bg-white shadow-sm text-primary-dark" : "text-gray-500"
                    )}
                >
                    Individuel
                </button>
                <button
                    onClick={() => setActiveTab('campus')}
                    className={clsx(
                        "flex-1 py-2 text-sm font-bold rounded-lg transition-all",
                        activeTab === 'campus' ? "bg-white shadow-sm text-primary-dark" : "text-gray-500"
                    )}
                >
                    Campus
                </button>
            </div>

            <div className="space-y-4">
                {activeTab === 'individual' ? (
                    users.map((u) => (
                        <div
                            key={u.id}
                            className={clsx(
                                "flex items-center p-4 rounded-2xl border transition-all",
                                u.id === user.id
                                    ? "bg-primary-light/10 border-primary shadow-sm"
                                    : "bg-white border-gray-100"
                            )}
                        >
                            <div className="w-8 font-bold text-gray-400 text-lg flex justify-center">
                                {u.rank === 1 && <Medal className="w-6 h-6 text-yellow-400" />}
                                {u.rank === 2 && <Medal className="w-6 h-6 text-gray-400" />}
                                {u.rank === 3 && <Medal className="w-6 h-6 text-orange-400" />}
                                {u.rank > 3 && u.rank}
                            </div>

                            <div className="mx-4">
                                <Avatar src={u.avatar} alt={u.firstname} size="sm" level={u.level} />
                            </div>

                            <div className="flex-1">
                                <p className={clsx("font-bold", u.id === user.id ? "text-primary-dark" : "text-ink")}>
                                    {u.firstname} {u.lastname.charAt(0)}.
                                </p>
                                <p className="text-xs text-gray-500">{u.campus}</p>
                            </div>

                            <div className="font-bold text-primary-dark">
                                {u.xp} XP
                            </div>
                        </div>
                    ))
                ) : (
                    campusRankings.map((c) => (
                        <EcoCard key={c.campus} className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-primary-light/20 rounded-full flex items-center justify-center mr-4">
                                    <span className="font-bold text-primary-dark">#{c.rank}</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-ink">{c.campus}</h3>
                                    <p className="text-xs text-earth">{c.totalPoints} points totaux</p>
                                </div>
                            </div>
                            <Trophy className={clsx(
                                "w-6 h-6",
                                c.rank === 1 ? "text-yellow-400" : "text-gray-300"
                            )} />
                        </EcoCard>
                    ))
                )}
            </div>
        </div>
    );
}
