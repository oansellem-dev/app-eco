'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEcoActions } from '@/hooks/useDatabase';
import { Avatar } from '@/components/ui/Avatar';
import { EcoCard } from '@/components/ui/EcoCard';
import { Button } from '@/components/ui/Button';
import { Settings, Leaf, Calendar, Trophy } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function ProfilePage() {
    const { user } = useAuth();
    const actions = useEcoActions(user?.id);

    if (!user) return null;

    const totalPoints = user.xp;
    const actionsCount = actions?.length || 0;
    // Mock streak for now
    const streak = 3;

    return (
        <div className="mobile-container flex flex-col p-6 pb-24">
            <div className="flex justify-between items-start mb-6">
                <h1 className="text-2xl font-bold text-ink">Mon Profil</h1>
                <Link href="/settings">
                    <button className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50">
                        <Settings className="w-6 h-6 text-gray-600" />
                    </button>
                </Link>
            </div>

            <div className="flex flex-col items-center mb-8">
                <div className="mb-4">
                    <Avatar src={user.avatar} alt={user.firstname} size="xl" level={user.level} />
                </div>
                <h2 className="text-xl font-bold text-ink">{user.firstname} {user.lastname}</h2>
                <p className="text-earth">{user.campus}</p>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-8">
                <div className="bg-white p-3 rounded-2xl shadow-sm text-center">
                    <div className="flex justify-center mb-1">
                        <Leaf className="w-5 h-5 text-primary" />
                    </div>
                    <p className="text-xl font-bold text-ink">{totalPoints}</p>
                    <p className="text-xs text-gray-500">Points</p>
                </div>
                <div className="bg-white p-3 rounded-2xl shadow-sm text-center">
                    <div className="flex justify-center mb-1">
                        <Trophy className="w-5 h-5 text-warning" />
                    </div>
                    <p className="text-xl font-bold text-ink">{actionsCount}</p>
                    <p className="text-xs text-gray-500">Actions</p>
                </div>
                <div className="bg-white p-3 rounded-2xl shadow-sm text-center">
                    <div className="flex justify-center mb-1">
                        <FlameIcon />
                    </div>
                    <p className="text-xl font-bold text-ink">{streak}</p>
                    <p className="text-xs text-gray-500">Jours</p>
                </div>
            </div>

            <h3 className="font-bold text-ink mb-4">Activité récente</h3>

            <div className="space-y-4">
                {actions?.map((action, index) => (
                    <EcoCard key={action.id || index} className="flex items-center p-3">
                        <div className="p-2 bg-primary-light/20 rounded-xl mr-3">
                            {action.action_type === 'trash_action' && <Leaf className="w-5 h-5 text-primary-dark" />}
                            {action.action_type === 'tri_mission' && <RecycleIcon />}
                            {action.action_type === 'cleanspot_scan' && <QrCodeIcon />}
                        </div>
                        <div className="flex-1">
                            <p className="font-bold text-sm text-ink">
                                {action.action_type === 'trash_action' && 'Photo Eco-Action'}
                                {action.action_type === 'tri_mission' && 'Mission Tri'}
                                {action.action_type === 'cleanspot_scan' && 'Scan CleanSpot'}
                            </p>
                            <p className="text-xs text-gray-500">
                                {format(action.timestamp, "d MMM 'à' HH:mm", { locale: fr })}
                            </p>
                        </div>
                        <div className="font-bold text-success text-sm">
                            +{action.points} PTS
                        </div>
                    </EcoCard>
                ))}

                {actions?.length === 0 && (
                    <p className="text-center text-gray-500 py-8">Aucune activité pour le moment.</p>
                )}
            </div>
        </div>
    );
}

function FlameIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-2.246-3.646-2.5-4.5A3.5 3.5 0 0 1 11 1c2 0 4 1.5 6 4.5 0 0 1.5-1 2.5-2 1.5 1.5 2.5 4.5 2.5 6.5a7 7 0 1 1-14 0c0 1.5.5 2.5 1 3.5" /></svg>
    );
}

function RecycleIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-dark"><path d="M7 19a2 2 0 0 1-2-2" /><path d="M11 19a2 2 0 0 1-2-2" /><path d="M17 21H7a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2Z" /><path d="M12 3 8 7h8Z" /><path d="M12 3v12" /></svg>
    );
}

function QrCodeIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-dark"><rect width="5" height="5" x="3" y="3" rx="1" /><rect width="5" height="5" x="16" y="3" rx="1" /><rect width="5" height="5" x="3" y="16" rx="1" /><path d="M21 16h-3a2 2 0 0 0-2 2v3" /><path d="M21 21v.01" /><path d="M12 7v3a2 2 0 0 1-2 2H7" /><path d="M3 12h.01" /><path d="M12 3h.01" /><path d="M12 16v.01" /><path d="M16 12h1" /><path d="M21 12v.01" /><path d="M12 21v-1" /></svg>
    );
}
