'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { EcoCard } from '@/components/ui/EcoCard';
import { ArrowLeft, Bell, Cloud, LogOut, User } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function SettingsPage() {
    const { user, logout } = useAuth();
    const [notifications, setNotifications] = useState(true);
    const [sync, setSync] = useState(false);

    if (!user) return null;

    return (
        <div className="mobile-container flex flex-col p-6 bg-sand min-h-screen">
            <div className="flex items-center mb-6">
                <Link href="/profile" className="p-2 -ml-2 text-gray-600 hover:text-ink">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <h1 className="text-xl font-bold ml-2">Paramètres</h1>
            </div>

            <div className="space-y-6">
                <section>
                    <h2 className="text-sm font-bold text-gray-500 uppercase mb-2 ml-1">Compte</h2>
                    <EcoCard className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <User className="w-5 h-5 text-gray-400 mr-3" />
                                <div>
                                    <p className="font-medium text-ink">Profil</p>
                                    <p className="text-xs text-gray-500">{user.firstname} {user.lastname}</p>
                                </div>
                            </div>
                            <Button variant="ghost" className="text-sm">Modifier</Button>
                        </div>
                    </EcoCard>
                </section>

                <section>
                    <h2 className="text-sm font-bold text-gray-500 uppercase mb-2 ml-1">Préférences</h2>
                    <EcoCard className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <Bell className="w-5 h-5 text-gray-400 mr-3" />
                                <p className="font-medium text-ink">Notifications</p>
                            </div>
                            <div
                                className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${notifications ? 'bg-primary' : 'bg-gray-300'}`}
                                onClick={() => setNotifications(!notifications)}
                            >
                                <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${notifications ? 'translate-x-6' : ''}`} />
                            </div>
                        </div>

                        <div className="h-px bg-gray-100" />

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <Cloud className="w-5 h-5 text-gray-400 mr-3" />
                                <div>
                                    <p className="font-medium text-ink">Sync Supabase</p>
                                    <p className="text-xs text-gray-500">Sauvegarde cloud</p>
                                </div>
                            </div>
                            <div
                                className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${sync ? 'bg-primary' : 'bg-gray-300'}`}
                                onClick={() => setSync(!sync)}
                            >
                                <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${sync ? 'translate-x-6' : ''}`} />
                            </div>
                        </div>
                    </EcoCard>
                </section>

                <section>
                    <Button
                        variant="outline"
                        fullWidth
                        onClick={logout}
                        className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Se déconnecter
                    </Button>
                </section>

                <div className="text-center text-xs text-gray-400 mt-8">
                    GreenCampus Quest v1.0.0<br />
                    Fait avec 💚 pour la planète
                </div>
            </div>
        </div>
    );
}
