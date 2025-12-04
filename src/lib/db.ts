import Dexie, { Table } from 'dexie';

export interface User {
    id: string;
    firstname: string;
    lastname: string;
    avatar: string;
    campus: string;
    level: number;
    xp: number;
    badges: string[];
}

export interface Action {
    id?: number;
    user_id: string;
    action_type: string;
    points: number;
    timestamp: Date;
}

export interface Mission {
    id: string;
    title: string;
    description: string;
    category: string;
    type: string;
    points: number;
    requires_photo: boolean;
    cooldown_hours: number;
    streak_enabled?: boolean;
}

export interface UserMission {
    id?: number; // Auto-incremented
    user_id: string;
    mission_id: string;
    status: 'pending' | 'validated' | 'rejected';
    proof_photo?: string;
    timestamp: Date;
}

export interface LeaderboardEntry {
    user_id: string;
    weekly_points: number;
    campus: string;
    updated_at: Date;
}

export class GreenCampusDB extends Dexie {
    users!: Table<User>;
    actions!: Table<Action>;
    missions!: Table<Mission>;
    user_missions!: Table<UserMission>;
    leaderboard_cache!: Table<LeaderboardEntry>;
    // Keep for backward compatibility if needed, or deprecate
    eco_actions!: Table<any>;

    constructor() {
        super('GreenCampusDB');
        this.version(1).stores({
            users: 'id, campus, level',
            eco_actions: 'id, user_id, type, timestamp',
            missions: 'id',
            leaderboard_cache: 'user_id, campus, weekly_points'
        });

        this.version(2).stores({
            users: 'id, campus, level, xp'
        });

        this.version(3).stores({
            users: 'id, firstname, lastname, campus, avatar, level, points, badges',
            missions: 'id, title, description, type, points, cooldown_hours, streak_enabled, requires_photo',
            user_missions: '++id, user_id, mission_id, status, proof_photo, timestamp',
            actions: '++id, user_id, action_type, points, timestamp'
        });

        this.version(4).stores({
            users: 'id, firstname, lastname, campus, avatar, level, xp, badges'
        });

        this.version(5).stores({
            missions: 'id, title, description, category, type, points, cooldown_hours, streak_enabled, requires_photo' // Added category
        });
    }
}

export const db = new GreenCampusDB();

// Seed initial missions
export const seedMissions = async () => {
    // Always clear and re-seed for this dev phase to match specs
    await db.missions.clear();

    await db.missions.bulkAdd([
        {
            id: 'm1',
            category: 'Tri',
            title: 'Recycle une bouteille plastique',
            description: 'Recycle-la dans la poubelle PLASTIC.',
            type: 'trash',
            points: 10,
            requires_photo: true,
            cooldown_hours: 2
        },
        {
            id: 'm2',
            category: 'Tri',
            title: 'Tri du papier',
            description: 'Recycle du papier dans la poubelle PAPER.',
            type: 'trash',
            points: 8,
            requires_photo: true,
            cooldown_hours: 1
        },
        {
            id: 'm3',
            category: 'Tri',
            title: 'Tri du verre',
            description: 'Recycle une bouteille en verre (GLASS).',
            type: 'trash',
            points: 18,
            requires_photo: true,
            cooldown_hours: 24
        },
        {
            id: 'm4',
            category: 'CleanSpot',
            title: 'Scan un CleanSpot',
            description: 'Scanne le QR CleanSpot dans le campus.',
            type: 'qr',
            points: 20,
            requires_photo: false,
            cooldown_hours: 0
        },
        {
            id: 'm5',
            category: 'CleanSpot',
            title: 'Nettoyage express',
            description: 'Ramasse 3 déchets autour d’un CleanSpot.',
            type: 'environment',
            points: 30,
            requires_photo: true,
            cooldown_hours: 2
        },
        {
            id: 'm6',
            category: 'Défi',
            title: 'Zéro bouteille plastique aujourd’hui',
            description: 'Prouve que tu utilises une gourde.',
            type: 'challenge',
            points: 15,
            requires_photo: true,
            streak_enabled: true,
            cooldown_hours: 24
        },
        {
            id: 'm7',
            category: 'Défi',
            title: 'Aide un camarade à trier',
            description: 'Apprends à quelqu’un à trier correctement.',
            type: 'social',
            points: 20,
            requires_photo: true,
            cooldown_hours: 24
        },
        {
            id: 'm8',
            category: 'Zéro Déchet',
            title: 'Utilise un sac réutilisable',
            description: 'Pas de sac plastique aujourd’hui.',
            type: 'eco_action',
            points: 10,
            requires_photo: true,
            cooldown_hours: 24
        },
        {
            id: 'm9',
            category: 'Zéro Déchet',
            title: 'Ramasse un déchet dans la cour',
            description: 'Un seul déchet pour faire la différence.',
            type: 'environment',
            points: 12,
            requires_photo: true,
            cooldown_hours: 2
        },
        {
            id: 'm10',
            category: 'Zéro Déchet',
            title: 'No Plastic Week — Jour 1',
            description: 'Zéro plastique individuel pendant la journée.',
            type: 'weekly_event',
            points: 20,
            requires_photo: true,
            cooldown_hours: 24
        },
        {
            id: 'm11',
            category: 'Défi',
            title: 'Action bonus : ramasse 3 types de déchets',
            description: 'Plastique + papier + verre.',
            type: 'environment',
            points: 30,
            requires_photo: true,
            cooldown_hours: 24
        },
        {
            id: 'm12',
            category: 'Éco-Actions',
            title: 'Donne une seconde vie à un objet',
            description: 'Prouve que tu répares ou réutilises un objet.',
            type: 'upcycling',
            points: 25,
            requires_photo: true,
            cooldown_hours: 24
        },
        {
            id: 'm13',
            category: 'Éco-Actions',
            title: 'Éteins les lumières inutiles',
            description: 'Prends une photo d’une salle rangée et éteinte.',
            type: 'eco_action',
            points: 10,
            requires_photo: true,
            cooldown_hours: 2
        },
        {
            id: 'm14',
            category: 'Éco-Actions',
            title: 'Utilise une tasse réutilisable',
            description: 'Montre ta tasse au lieu d’un gobelet jetable.',
            type: 'eco_action',
            points: 12,
            requires_photo: true,
            cooldown_hours: 2
        }
    ]);
};

// Seed initial users
export const seedUsers = async () => {
    // We'll just overwrite/add these users.
    await db.users.bulkPut([
        { id: 'u1', firstname: 'Alice', lastname: 'Green', campus: 'Eugenia Paris', level: 3, xp: 245, avatar: '/avatars/alice.png', badges: ['ecostarter'] }, // Level Eco-Hero approx
        { id: 'u2', firstname: 'Lucas', lastname: 'Recyc', campus: 'Eugenia Paris', level: 1, xp: 90, avatar: '/avatars/lucas.png', badges: [] },
        { id: 'u3', firstname: 'Maya', lastname: 'Leaf', campus: 'Lyon Campus', level: 5, xp: 560, avatar: '/avatars/maya.png', badges: ['ecostarter', 'cleanmaster'] },
        { id: 'u4', firstname: 'Tom', lastname: 'ZeroWaste', campus: 'Campus Nord', level: 3, xp: 310, avatar: '/avatars/tom.png', badges: ['ecostarter'] },
        { id: 'u5', firstname: 'Nina', lastname: 'BottleFree', campus: 'Campus Ouest', level: 1, xp: 70, avatar: '/avatars/nina.png', badges: [] },
        { id: 'u6', firstname: 'Oceane', lastname: 'GlassQueen', campus: 'Campus Ouest', level: 3, xp: 220, avatar: '/avatars/oceane.png', badges: ['ecostarter'] },
        { id: 'u7', firstname: 'Leo', lastname: 'TriMaster', campus: 'Eugenia Paris', level: 5, xp: 600, avatar: '/avatars/leo.png', badges: ['tri_master'] },
        { id: 'u8', firstname: 'Emma', lastname: 'EcoStar', campus: 'Lyon Campus', level: 4, xp: 410, avatar: '/avatars/emma.png', badges: ['eco_hero'] },
        { id: 'u9', firstname: 'Marco', lastname: 'VirtuGreen', campus: 'Campus Nord', level: 3, xp: 320, avatar: '/avatars/marco.png', badges: [] },
        { id: 'u10', firstname: 'Sarah', lastname: 'EcoQueen', campus: 'Campus Nord', level: 1, xp: 75, avatar: '/avatars/sarah.png', badges: [] },
        { id: 'u11', firstname: 'Yanis', lastname: 'EcoGeek', campus: 'Campus Ouest', level: 5, xp: 500, avatar: '/avatars/yanis.png', badges: ['ecostarter'] },
        { id: 'u12', firstname: 'Clara', lastname: 'WasteLess', campus: 'Lyon Campus', level: 1, xp: 55, avatar: '/avatars/clara.png', badges: [] }
    ]);
};
