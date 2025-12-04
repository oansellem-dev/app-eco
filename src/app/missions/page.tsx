'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useMissions } from '@/hooks/useDatabase';
import { startMission, getMissionsStatus } from '@/lib/missionLogic';
import { EcoCard } from '@/components/ui/EcoCard';
import { Button } from '@/components/ui/Button';
import { Check, Flame, QrCode, Camera, Recycle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ConfettiLeaves } from '@/components/animations/ConfettiLeaves';

export default function MissionsPage() {
    const { user } = useAuth();
    const missions = useMissions();
    const [status, setStatus] = useState<{
        completed_count: number;
        pending_count: number;
        mission_states: Record<string, string>;
    }>({ completed_count: 0, pending_count: 0, mission_states: {} });
    const [showConfetti, setShowConfetti] = useState(false);
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [activeFilter, setActiveFilter] = useState('Toutes');

    const filters = ["Toutes", "Tri", "CleanSpot", "Zéro Déchet", "Défis", "Éco-Actions"];

    useEffect(() => {
        if (user) {
            getMissionsStatus(user.id).then(setStatus);
        }
    }, [user, showConfetti]); // Refresh when confetti triggers (action completed)

    const router = useRouter();

    const handleComplete = async (missionId: string) => {
        if (!user) return;

        const mission = missions?.find(m => m.id === missionId);
        if (mission?.requires_photo) {
            router.push(`/camera?missionId=${missionId}`);
            return;
        }

        setLoadingId(missionId);

        try {
            // Non-photo mission validation
            const res = await startMission(user.id, missionId);

            if (res.status === 'validated') {
                setShowConfetti(true);
                setTimeout(() => setShowConfetti(false), 3000);
                alert(`Mission validée ! +${res.points} pts`);
            } else if (res.status === 'pending') {
                alert('Mission en attente de validation...');
            }

            // Refresh status
            const newStatus = await getMissionsStatus(user.id);
            setStatus(newStatus);
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingId(null);
        }
    };

    if (!missions || !status) return <div className="p-8 text-center">Chargement...</div>;

    // Filter missions
    const filteredMissions = activeFilter === 'Toutes'
        ? missions
        : missions.filter(m => m.category === activeFilter || m.type === activeFilter);

    // Split into Daily (e.g., cooldown 24h) and All
    const dailyMissions = missions.filter(m => m.cooldown_hours === 24).slice(0, 6);
    const displayMissions = filteredMissions;

    return (
        <div className="mobile-container flex flex-col p-6 pb-24 space-y-6">
            {showConfetti && <ConfettiLeaves />}

            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-ink">Missions</h1>
                <div className="flex items-center bg-orange-100 px-3 py-1 rounded-full text-warning font-bold text-sm">
                    <Flame className="w-4 h-4 mr-1" />
                    <span>3 jours</span>
                </div>
            </div>

            {/* Filters */}
            <div className="flex overflow-x-auto pb-2 space-x-2 no-scrollbar">
                {filters.map(filter => (
                    <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${activeFilter === filter
                            ? 'bg-primary text-white shadow-md'
                            : 'bg-white text-gray-600 border border-gray-200'
                            }`}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            {/* Daily Missions Section */}
            {activeFilter === 'Toutes' && (
                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-ink flex items-center">
                        <Check className="w-5 h-5 mr-2 text-primary" />
                        Missions du jour
                    </h2>
                    <div className="grid grid-cols-1 gap-4">
                        {dailyMissions.map(mission => (
                            <MissionCard
                                key={mission.id}
                                mission={mission}
                                status={status}
                                onComplete={handleComplete}
                                loadingId={loadingId}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* All Missions List */}
            <div className="space-y-4">
                <h2 className="text-lg font-bold text-ink">
                    {activeFilter === 'Toutes' ? 'Toutes les missions' : `Missions : ${activeFilter}`}
                </h2>
                <div className="space-y-4">
                    {displayMissions.map(mission => (
                        <MissionCard
                            key={mission.id}
                            mission={mission}
                            status={status}
                            onComplete={handleComplete}
                            loadingId={loadingId}
                        />
                    ))}
                    {displayMissions.length === 0 && (
                        <p className="text-center text-gray-500 py-8">Aucune mission trouvée pour ce filtre.</p>
                    )}
                </div>
            </div>

            {/* Link to Camera Action */}
            <EcoCard className="flex flex-col bg-gradient-to-br from-primary-dark to-primary text-white">
                <div className="flex items-center mb-2">
                    <div className="p-2 bg-white/20 rounded-xl mr-3">
                        <Camera className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold">Photo Eco-Action</h3>
                        <p className="text-xs text-white/80">+10 PTS • Toutes les 2h</p>
                    </div>
                </div>
                <p className="text-sm text-white/90 mb-4">Prends une photo de ton action pour gagner des points.</p>
                <Link href="/camera">
                    <Button variant="secondary" fullWidth className="bg-white text-primary-dark hover:bg-white/90">
                        Prendre une photo
                    </Button>
                </Link>
            </EcoCard>
        </div>
    );
}

function MissionCard({ mission, status, onComplete, loadingId }: any) {
    const missionState = status.mission_states[mission.id];
    const isCompleted = missionState === 'validated';
    const isPending = missionState === 'pending';

    return (
        <EcoCard
            variant={isCompleted ? 'success' : 'default'}
            className="flex flex-col"
        >
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center">
                    <div className={`p-2 rounded-xl mr-3 ${isCompleted ? 'bg-white/50' : 'bg-primary-light/20'}`}>
                        {mission.type === 'trash_action' || mission.type === 'trash' ? <Recycle className="w-6 h-6 text-primary-dark" /> :
                            mission.type === 'cleanspot_qr' || mission.type === 'qr' ? <QrCode className="w-6 h-6 text-primary-dark" /> :
                                <Check className="w-6 h-6 text-primary-dark" />}
                    </div>
                    <div>
                        <h3 className="font-bold text-ink">{mission.title}</h3>
                        <div className="flex items-center space-x-2">
                            <span className="text-xs text-earth font-medium">+{mission.points} PTS</span>
                            {mission.category && (
                                <span className="text-[10px] px-2 py-0.5 bg-gray-100 rounded-full text-gray-500 uppercase tracking-wider">
                                    {mission.category}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                {isCompleted && (
                    <div className="bg-white/50 p-1 rounded-full">
                        <Check className="w-5 h-5 text-success" />
                    </div>
                )}
            </div>

            <p className="text-sm text-gray-600 mb-4">{mission.description}</p>

            {!isCompleted && !isPending && (
                <Button
                    onClick={() => onComplete(mission.id)}
                    isLoading={loadingId === mission.id}
                    variant="primary"
                    className="w-full"
                >
                    {mission.requires_photo ? 'Prendre une photo' : 'Valider'}
                </Button>
            )}

            {isPending && (
                <div className="w-full py-2 text-center text-warning font-bold bg-warning/10 rounded-lg animate-pulse">
                    En attente de validation...
                </div>
            )}
        </EcoCard>
    );
}
