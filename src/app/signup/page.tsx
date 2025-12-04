'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Camera, ChevronLeft } from 'lucide-react';

const CAMPUSES = [
    "Eugenia Paris",
    "Eugenia Lille",
    "Campus Nord",
    "Campus Ouest"
];

export default function Signup() {
    const { signup } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        campus: CAMPUSES[0]
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Create mock avatar URL or use a default
        const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.firstname}`;

        await signup({
            firstname: formData.firstname,
            lastname: formData.lastname,
            campus: formData.campus,
            avatar: avatarUrl
        });

        setLoading(false);
    };

    return (
        <div className="mobile-container flex flex-col p-6 bg-sand min-h-screen">
            <div className="flex items-center mb-6">
                <Link href="/login" className="p-2 -ml-2 text-gray-600 hover:text-ink">
                    <ChevronLeft className="w-6 h-6" />
                </Link>
                <h1 className="text-xl font-bold ml-2">Créer un compte</h1>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar pb-8">
                <div className="flex justify-center mb-8">
                    <button className="relative w-24 h-24 bg-white rounded-full border-4 border-white shadow-leaf flex items-center justify-center overflow-hidden group">
                        <img
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.firstname || 'new'}`}
                            alt="Avatar preview"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera className="w-8 h-8 text-white" />
                        </div>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                            <input
                                type="text"
                                value={formData.firstname}
                                onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                            <input
                                type="text"
                                value={formData.lastname}
                                onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Campus</label>
                        <div className="relative">
                            <select
                                value={formData.campus}
                                onChange={(e) => setFormData({ ...formData, campus: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none appearance-none bg-white"
                            >
                                {CAMPUSES.map(campus => (
                                    <option key={campus} value={campus}>{campus}</option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                ▼
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 ml-1">Impossible de changer de campus plus tard</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                            required
                        />
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary-dark text-white font-bold py-4 rounded-xl shadow-lg hover:bg-primary transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Création...' : 'Rejoindre l\'aventure'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
