import { db, Mission, User } from './db';

const STREAK_BONUS_MULTIPLIER = 2;

export async function getMissionsStatus(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get all user missions for today
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

    // 2. Simulate AI Validation (90% success)
    // In a real app, this might happen via a server action or background job
    return new Promise((resolve) => {
        setTimeout(async () => {
            const isSuccess = Math.random() < 0.9; // 90% success rate

            if (isSuccess) {
                await validateMission(userId, missionId, userMissionId as number);
                resolve({ status: 'validated', points: mission.points });
            } else {
                await db.user_missions.update(userMissionId, { status: 'rejected' });
                resolve({ status: 'pending' }); // Or rejected, but UI might want to show "processing" then result
            }
        }, 1500); // 1.5s delay for "AI processing" effect
    });
}

async function validateMission(userId: string, missionId: string, userMissionId: number) {
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
        points: mission.points,
        timestamp: new Date()
    });

    // Update User XP/Level
    const newXp = user.xp + mission.points;
    const newLevel = Math.floor(newXp / 100) + 1; // Simple level formula

    await db.users.update(userId, {
        xp: newXp,
        level: newLevel
    });
}

