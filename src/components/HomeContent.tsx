'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEcoActions, useLeaderboard, useMissions } from '@/hooks/useDatabase';
import { getMissionsStatus, startMission } from '@/lib/missionLogic';
import { Mission } from '@/lib/db';
import { Avatar } from '@/components/ui/Avatar';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { EcoCard } from '@/components/ui/EcoCard';
import { Button } from '@/components/ui/Button';
import { RewardsSection } from '@/components/RewardsSection';
import { Camera, QrCode, Trophy, Leaf } from 'lucide-react';
import Link from 'next/link';

export default function HomeContent() {
    const { user, isLoading: loading } = useAuth();
    const router = useRouter();
    const ecoActions = useEcoActions(user?.id);
    const missions = useMissions();
    const leaderboard = useLeaderboard();
    const [missionStatus, setMissionStatus] = useState<{
        completed_count: number;
        pending_count: number;
        mission_states: Record<string, string>;
    }>({ completed_count: 0, pending_count: 0, mission_states: {} });

    const [processingMissionId, setProcessingMissionId] = useState<string | null>(null);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/onboarding');
        }
    }, [user, loading, router]);

    useEffect(() => {
        if (user?.id) {
            loadMissionStatus();
        }
    }, [user?.id, ecoActions]);

    const loadMissionStatus = async () => {
        if (user?.id) {
            const status = await getMissionsStatus(user.id);
            setMissionStatus(status);
        }
    };

    const handleStartMission = async (mission: Mission) => {
        if (!user?.id || processingMissionId) return;

        setProcessingMissionId(mission.id);
        try {
            const result = await startMission(user.id, mission.id, 'placeholder_photo_url');

            if (result.status === 'validated') {
                alert(`Mission validée! + ${result.points} pts`);
            } else if (result.status === 'pending') {
                alert('Mission en attente de validation...');
            }

            await loadMissionStatus();
        } catch (error) {
            console.error('Error starting mission:', error);
        } finally {
            setProcessingMissionId(null);
        }
    };

    if (loading || !user) return <div className="min-h-screen flex items-center justify-center bg-sand"><div className="animate-spin text-primary">Loading...</div></div>;

    const nextLevelXp = user.level * 100;
    const currentLevelXp = (user.level - 1) * 100;
    const xpInLevel = user.xp - currentLevelXp;
    const xpNeeded = 100;

    const top3 = leaderboard?.slice(0, 3) || [];

    return (
        <div className="flex flex-col p-6 pb-24 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-earth text-sm font-medium">EcoQuest Campus</p>
                    <h1 className="text-2xl font-bold text-ink">Building a Better World</h1>
                </div>
                <Link href="/profile">
                    <Avatar src={user.avatar} alt={user.firstname} level={user.level} />
                </Link>
            </div>

            <div className="bg-primary/10 rounded-2xl p-4 border border-primary/20">
                <h2 className="font-bold text-primary-dark mb-2">Notre Mission</h2>
                <p className="text-sm text-ink mb-2">
                    EcoQuest Campus transforme la réduction des déchets en jeu écologique grâce à la gamification et à la compétition entre étudiants.
                </p>
                <p className="text-xs font-medium text-primary italic">
                    "Chaque geste écolo compte, chaque mission construit un campus plus propre."
                </p>
            </div>

            <div className="grid grid-cols-3 gap-2">
                <div className="bg-white p-2 rounded-xl text-center shadow-sm border border-gray-100 flex flex-col items-center">
                    <div className="bg-orange-100 p-2 rounded-full mb-1">
                        <Trophy className="w-4 h-4 text-orange-500" />
                    </div>
                    <span className="text-[10px] font-bold text-ink leading-tight">Défis Ludiques</span>
                </div>
                <div className="bg-white p-2 rounded-xl text-center shadow-sm border border-gray-100 flex flex-col items-center">
                    <div className="bg-blue-100 p-2 rounded-full mb-1">
                        <Leaf className="w-4 h-4 text-blue-500" />
                    </div>
                    <span className="text-[10px] font-bold text-ink leading-tight">Compétition</span>
                </div>
                <div className="bg-white p-2 rounded-xl text-center shadow-sm border border-gray-100 flex flex-col items-center">
                    <div className="bg-green-100 p-2 rounded-full mb-1">
                        <Leaf className="w-4 h-4 text-green-500" />
                    </div>
                    <span className="text-[10px] font-bold text-ink leading-tight">Récompenses</span>
                </div>
            </div>

            <EcoCard className="bg-white">
                <div className="flex justify-between items-end mb-2">
                    <div>
                        <span className="text-xs font-bold text-primary uppercase tracking-wider">Niveau {user.level}</span>
                        <p className="text-sm text-gray-500">Continue comme ça, {user.firstname} !</p>
                    </div>
                    <span className="text-sm font-bold text-ink">{xpInLevel}/{xpNeeded} XP</span>
                </div>
                <ProgressBar current={xpInLevel} max={xpNeeded} showText={false} />
            </EcoCard>

            <div className="grid grid-cols-2 gap-4">
                <Link href="/camera" className="block">
                    <EcoCard className="h-full bg-primary-dark text-white flex flex-col items-center justify-center py-6 hover:bg-primary transition-colors">
                        <div className="p-3 bg-white/20 rounded-full mb-3">
                            <Camera className="w-8 h-8" />
                        </div>
                        <span className="font-bold">Photo Action</span>
                        <span className="text-xs opacity-80 mt-1">+10 PTS</span>
                    </EcoCard>
                </Link>
                <Link href="/scanner" className="block">
                    <EcoCard className="h-full bg-white text-ink flex flex-col items-center justify-center py-6 border-2 border-primary/10 hover:border-primary/30 transition-colors">
                        <div className="p-3 bg-primary-light/20 rounded-full mb-3">
                            <QrCode className="w-8 h-8 text-primary-dark" />
                        </div>
                        <span className="font-bold">Scan CleanSpot</span>
                        <span className="text-xs text-gray-500 mt-1">+25 PTS</span>
                    </EcoCard>
                </Link>
            </div>

            <div>
                <div className="flex items-center justify-between mb-3">
                    <h2 className="font-bold text-ink">Missions du jour</h2>
                    <Link href="/missions" className="text-xs font-bold text-primary hover:underline">
                        Voir tout
                    </Link>
                </div>
                <div className="space-y-3">
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-ink">Missions Disponibles</h2>
                            <span className="text-sm text-primary">{missionStatus.completed_count} validées aujourd'hui</span>
                        </div>

                        <div className="space-y-3">
                            {missions?.map((mission) => {
                                const status = missionStatus.mission_states[mission.id];
                                const isPending = status === 'pending';
                                const isValidated = status === 'validated';
                                const isProcessing = processingMissionId === mission.id;

                                return (
                                    <EcoCard key={mission.id} className="flex items-center justify-between p-4">
                                        <div className="flex items-center space-x-4">
                                            <div className="p-3 rounded-full bg-primary/20 text-2xl">
                                                {mission.type === 'trash_action' ? '🗑️' :
                                                    mission.type === 'tri' ? '♻️' :
                                                        mission.type === 'environment_clean' ? '🧹' : '🌱'}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-ink">{mission.title}</h3>
                                                <p className="text-sm text-gray-500">{mission.points} pts • {mission.description}</p>
                                            </div>
                                        </div>

                                        {isValidated ? (
                                            <div className="px-4 py-2 rounded-full bg-success/20 text-success font-bold text-sm">
                                                Validé ✓
                                            </div>
                                        ) : isPending ? (
                                            <div className="px-4 py-2 rounded-full bg-warning/20 text-warning font-bold text-sm animate-pulse">
                                                En attente...
                                            </div>
                                        ) : (
                                            <Button
                                                size="sm"
                                                onClick={() => handleStartMission(mission)}
                                                disabled={isProcessing}
                                                className={isProcessing ? 'opacity-50' : ''}
                                            >
                                                {isProcessing ? '...' : 'Go'}
                                            </Button>
                                        )}
                                    </EcoCard>
                                );
                            })}

                            {!missions && <div className="text-center text-gray-400">Chargement des missions...</div>}
                        </div>
                    </section>
                </div>
            </div>

            <div>
                <div className="flex items-center justify-between mb-3">
                    <h2 className="font-bold text-ink">Top Campus</h2>
                    <Link href="/leaderboard" className="text-xs font-bold text-primary hover:underline">
                        Classement complet
                    </Link>
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                    {top3.map((u, i) => (
                        <div key={u.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                            <div className="flex items-center">
                                <span className={`w-6 font-bold ${i === 0 ? 'text-yellow-400' : i === 1 ? 'text-gray-400' : 'text-orange-400'}`}>
                                    #{i + 1}
                                </span>
                                <Avatar src={u.avatar} alt={u.firstname} size="sm" />
                                <span className="ml-3 text-sm font-medium">{u.firstname}</span>
                            </div>
                            <span className="text-xs font-bold text-primary-dark">{u.xp} XP</span>
                        </div>
                    ))}
                    {top3.length === 0 && <p className="text-center text-gray-400 text-sm">Le classement est vide.</p>}
                </div>
            </div>
            <RewardsSection />
        </div>
    );
}
