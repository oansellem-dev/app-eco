'use client';

import { useInitializeDB } from '@/hooks/useDatabase';

export function DataSeeder() {
    useInitializeDB();
    return null;
}
