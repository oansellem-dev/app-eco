import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const SYSTEM_PROMPT = `Tu es le MOTEUR DE JEU AUTONOME de l'application GreenCampusQuest. Ta tâche est de gérer entièrement la validation d'une action de nettoyage à partir d'une photo.

TA MISSION (Mode Auto-Pilote) :
1. Analyse l'image reçue.
2. Identifie si un déchet est présent et s'il est en cours de nettoyage (tenu en main, dans un sac, ou avant/après).
3. Calcule toi-même les points (XP) en fonction de la difficulté et de l'impact écologique.
4. Détecte la triche (photo d'écran, photo noire, pas de déchet).

BARÈME XP AUTOMATIQUE (À appliquer) :
- Mégot/Petit plastique : 10 XP
- Canette/Bouteille : 20 XP
- Gros déchet/Carton : 50 XP
- Sac poubelle rempli : 100 XP
- Zone complète nettoyée : 200 XP

FORMAT DE RÉPONSE OBLIGATOIRE (JSON) :
Renvoie uniquement cet objet JSON prêt à l'emploi pour le code :
{
  "status": string, // 'SUCCESS' ou 'REJECTED'
  "xp_rewarded": number, // Les points calculés (0 si rejeté)
  "item_detected": string, // Nom du déchet (ex: 'Canette RedBull')
  "eco_fact": string, // Une petite info écolo éducative liée au déchet détecté
  "user_message": string, // Message fun pour l'étudiant (ex: 'Boom ! 20XP dans la poche. La planète te remercie.')
  "debug_reason": string // Pourquoi tu as validé ou refusé (pour les logs)
}`;

export async function POST(req: Request) {
    try {
        const { image } = await req.json();

        if (!image) {
            return NextResponse.json({ error: 'No image provided' }, { status: 400 });
        }

        if (!process.env.GEMINI_API_KEY) {
            console.warn('GEMINI_API_KEY is missing');
            // Fallback for dev without key
            return NextResponse.json({
                status: 'SUCCESS',
                xp_rewarded: 20,
                item_detected: 'Simulation (No Key)',
                eco_fact: 'Ajoutez une clé API pour une vraie IA !',
                user_message: 'Bravo ! (Mode Simulation)',
                debug_reason: 'Missing API Key'
            });
        }

        const model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash',
            systemInstruction: SYSTEM_PROMPT,
            generationConfig: {
                responseMimeType: "application/json"
            }
        });

        // Remove header if present (data:image/jpeg;base64,)
        const base64Data = image.split(',')[1] || image;

        const result = await model.generateContent([
            {
                inlineData: {
                    data: base64Data,
                    mimeType: "image/jpeg",
                },
            },
            "Analyse cette photo de mission écologique."
        ]);

        const response = await result.response;
        const text = response.text();

        try {
            const jsonResponse = JSON.parse(text);
            return NextResponse.json(jsonResponse);
        } catch (e) {
            console.error('Failed to parse Gemini response:', text);
            return NextResponse.json({ error: 'Invalid AI response' }, { status: 500 });
        }

    } catch (error) {
        console.error('Error in validate API:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
