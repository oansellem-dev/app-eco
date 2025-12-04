'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Leaf, Mail } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await login(email);
        setLoading(false);
    };

    return (
        <div className="mobile-container flex flex-col p-8 bg-sand min-h-screen">
            <div className="flex-1 flex flex-col justify-center">
                <div className="flex justify-center mb-8">
                    <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center shadow-leaf rotate-3">
                        <Leaf className="w-10 h-10 text-white" />
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-center text-ink mb-8">Bon retour parmi nous !</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            placeholder="etudiant@campus.edu"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary-dark text-white font-bold py-3 rounded-xl shadow-lg hover:bg-primary transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Connexion...' : 'Se connecter'}
                    </button>
                </form>

                <div className="mt-8">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-sand text-gray-500">Ou continuer avec</span>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                        <button className="flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50">
                            Google
                        </button>
                        <button className="flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50">
                            Apple
                        </button>
                    </div>
                </div>
            </div>

            <p className="text-center text-sm text-gray-600 mt-8">
                Pas encore de compte ?{' '}
                <Link href="/signup" className="font-bold text-primary-dark hover:text-primary">
                    Créer un compte
                </Link>
            </p>
        </div>
    );
}
