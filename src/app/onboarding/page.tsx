'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Leaf, Trophy, Users } from 'lucide-react';

export default function Onboarding() {
    return (
        <div className="mobile-container flex flex-col items-center justify-between p-8 bg-gradient-to-b from-sand to-white">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="flex flex-col items-center mt-12 text-center"
            >
                <div className="w-32 h-32 bg-primary-light/30 rounded-full flex items-center justify-center mb-6 shadow-leaf">
                    <Leaf className="w-16 h-16 text-primary-dark" />
                </div>
                <h1 className="text-3xl font-bold text-primary-dark mb-2">GreenCampus Quest</h1>
                <p className="text-earth text-lg">Transforme tes actions écolos en jeu !</p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="w-full space-y-6 my-8"
            >
                <FeatureRow
                    icon={<Leaf className="w-6 h-6 text-success" />}
                    title="Gagne des points"
                    desc="Valide tes actions par photo"
                />
                <FeatureRow
                    icon={<Trophy className="w-6 h-6 text-warning" />}
                    title="Monte en niveau"
                    desc="Débloque des badges exclusifs"
                />
                <FeatureRow
                    icon={<Users className="w-6 h-6 text-primary" />}
                    title="Défie ton campus"
                    desc="Grimpe dans le classement"
                />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="w-full"
            >
                <Link href="/login" className="block w-full">
                    <button className="w-full bg-primary-dark text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-primary transition-colors active:scale-95 transform duration-200">
                        C'est parti ! 🌿
                    </button>
                </Link>
            </motion.div>
        </div>
    );
}

function FeatureRow({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
    return (
        <div className="flex items-center space-x-4 bg-white/50 p-4 rounded-2xl shadow-sm">
            <div className="p-3 bg-white rounded-xl shadow-sm">
                {icon}
            </div>
            <div className="text-left">
                <h3 className="font-bold text-ink">{title}</h3>
                <p className="text-sm text-gray-600">{desc}</p>
            </div>
        </div>
    );
}
