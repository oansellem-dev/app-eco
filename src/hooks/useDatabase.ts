import { useLiveQuery } from 'dexie-react-hooks';
import { db, seedMissions, seedUsers } from '@/lib/db';
import { useEffect, useState } from 'react';

export function useUser(userId: string | undefined) {
    return useLiveQuery(
        async () => {
            if (!userId) return null;
            return await db.users.get(userId);
        },
        [userId]
    );
}

export function useEcoActions(userId: string | undefined) {
    return useLiveQuery(
        async () => {
            if (!userId) return [];
            return await db.actions
                .where('user_id')
                .equals(userId)
                .reverse()
                .sortBy('timestamp');
        },
        [userId]
    );
}

export function useMissions() {
    return useLiveQuery(() => db.missions.toArray());
}

export function useLeaderboard(campus?: string) {
    return useLiveQuery(
        async () => {
            let collection = db.users.orderBy('xp').reverse();
            if (campus) {
                const all = await collection.toArray();
                return all.filter(u => u.campus === campus);
            }
            return await collection.toArray();
        },
        [campus]
    );
}

export function useInitializeDB() {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const init = async () => {
            await seedMissions();
            await seedUsers();
            setIsReady(true);
        };
        init();
    }, []);

    return isReady;
}
