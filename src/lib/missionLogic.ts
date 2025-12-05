import { db, Mission, User } from './db';

const STREAK_BONUS_MULTIPLIER = 2;

export async function getMissionsStatus(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get all user missions for today
    if (typeof window === 'undefined') {
        return { completed_count: 0, pending_count: 0, mission_states: {} };
    }

    const userMissions = await db.user_missions
        .where('user_id')
        .equals(userId)
        .and(m => m.timestamp >= today)
        .toArray();

    return {
        completed_count: userMissions.filter(m => m.status === 'validated').length,
        pending_count: userMissions.filter(m => m.status === 'pending').length,
        // Map of mission_id -> status
        mission_states: userMissions.reduce((acc, m) => ({ ...acc, [m.mission_id]: m.status }), {} as Record<string, string>)
    };
}

export async function startMission(userId: string, missionId: string, photoUrl?: string): Promise<{ status: 'pending' | 'validated'; points?: number }> {
    const mission = await db.missions.get(missionId);
    if (!mission) throw new Error('Mission not found');

    // 1. Create UserMission entry (Pending)
    const userMissionId = await db.user_missions.add({
        user_id: userId,
        mission_id: missionId,
        status: 'pending',
        proof_photo: photoUrl,
        timestamp: new Date()
    });

    // 2. Call AI Validation API
    try {
        const response = await fetch('/api/validate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: photoUrl || 'placeholder' })
        });

        const data = await response.json();

        if (data.status === 'SUCCESS') {
            await validateMission(userId, missionId, userMissionId as number, data.xp_rewarded);
            return { status: 'validated', points: data.xp_rewarded };
        } else {
            await db.user_missions.update(userMissionId, { status: 'rejected' });
            return { status: 'pending' }; // Or rejected
        }
    } catch (error) {
        console.error('Validation API error:', error);
        // Fallback to pending if API fails
        return { status: 'pending' };
    }
}

async function validateMission(userId: string, missionId: string, userMissionId: number, customPoints?: number) {
    const mission = await db.missions.get(missionId);
    if (!mission) return;

    const user = await db.users.get(userId);
    if (!user) return;

    // Update status
    await db.user_missions.update(userMissionId, { status: 'validated' });

    // Add Points (Action)
    await db.actions.add({
        user_id: userId,
        action_type: mission.type,
        points: customPoints || mission.points,
        timestamp: new Date()
    });

    // Update User XP/Level
    const pointsToAdd = customPoints || mission.points;
    const newXp = user.xp + pointsToAdd;
    const newLevel = Math.floor(newXp / 100) + 1; // Simple level formula

    await db.users.update(userId, {
        xp: newXp,
        level: newLevel
    });
}

