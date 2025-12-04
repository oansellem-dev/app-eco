import { db, User } from './db';

export interface LeaderboardUser extends User {
    rank: number;
}

export interface CampusRanking {
    campus: string;
    totalPoints: number;
    rank: number;
}

export async function getLeaderboardData(campusFilter?: string): Promise<LeaderboardUser[]> {
    let users = await db.users.toArray();

    if (campusFilter) {
        users = users.filter(u => u.campus === campusFilter);
    }

    // Sort by XP (descending)
    users.sort((a, b) => b.xp - a.xp);

    return users.map((user, index) => ({
        ...user,
        rank: index + 1
    }));
}

export async function getCampusLeaderboard(): Promise<CampusRanking[]> {
    const users = await db.users.toArray();
    const campusMap = new Map<string, number>();

    users.forEach(user => {
        const current = campusMap.get(user.campus) || 0;
        campusMap.set(user.campus, current + user.xp);
    });

    const rankings: CampusRanking[] = Array.from(campusMap.entries()).map(([campus, totalPoints]) => ({
        campus,
        totalPoints,
        rank: 0 // to be filled
    }));

    rankings.sort((a, b) => b.totalPoints - a.totalPoints);

    return rankings.map((r, i) => ({ ...r, rank: i + 1 }));
}
