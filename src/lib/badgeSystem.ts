import { db, User } from './db';

export interface BadgeDef {
    id: string;
    name: string;
    description: string;
    icon: string;
    condition: string;
}

export const BADGES: BadgeDef[] = [
    { id: 'ecostarter', name: 'EcoStarter', description: 'Réalise ta première action', icon: '🌱', condition: '1 action' },
    { id: 'tri_master', name: 'Tri Master', description: 'Maîtrise le tri sur le bout des doigts', icon: '♻️', condition: '10 missions tri' },
    { id: 'eco_hero', name: 'Eco-Hero', description: 'Un véritable héros du campus', icon: '🦸', condition: 'Niveau Eco-Hero atteint' },
    { id: 'no_plastic', name: 'No Plastic Week', description: 'Une semaine sans plastique !', icon: '🥤', condition: '7 jours sans plastique' }
];

export async function checkBadgeEligibility(userId: string): Promise<string[]> {
    const user = await db.users.get(userId);
    if (!user) return [];

    const actions = await db.eco_actions.where('user_id').equals(userId).toArray();
    const triCount = actions.filter(a => a.type === 'tri_mission').length;
    const cleanCount = actions.filter(a => a.type === 'cleanspot_scan').length;

    const newBadges: string[] = [];

    // EcoStarter
    if (actions.length >= 1 && !user.badges.includes('ecostarter')) {
        newBadges.push('ecostarter');
    }

    // TriHero
    if (triCount >= 10 && !user.badges.includes('trihero')) {
        newBadges.push('trihero');
    }

    // CleanMaster
    if (cleanCount >= 5 && !user.badges.includes('cleanmaster')) {
        newBadges.push('cleanmaster');
    }

    // CampusLegend check would need leaderboard context, usually checked separately or via a scheduled job
    // For now we skip it here or pass rank as arg

    if (newBadges.length > 0) {
        await db.users.update(userId, {
            badges: [...user.badges, ...newBadges]
        });
    }

    return newBadges;
}
