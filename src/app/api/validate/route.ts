import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const SYSTEM_PROMPT = `MODE MISSION UNIQUE : 'CHASSEUR DE PLASTIQUE'.

Tu es l'IA de validation pour GreenCampusQuest. Toutes les autres missions sont désactivées.

TA SEULE TÂCHE :
Analyser l'image et vérifier la présence d'une BOUTEILLE EN PLASTIQUE (bouteille d'eau, soda, flacon).

RÈGLES STRICTES :
1. BOUTEILLE PLASTIQUE détectée ? -> REUSSITE.
2. CANETTE (Métal) ? -> ECHEC (Raison: 'C'est du métal, cherche du plastique').
3. BOUTEILLE VERRE ? -> ECHEC (Raison: 'C'est du verre, dangereux !').
4. CARTON/PAPIER ? -> ECHEC (Raison: 'Ceci n'est pas une bouteille plastique').
5. Rien / Flou ? -> ECHEC.

FORMAT DE REPONSE (JSON OBLIGATOIRE) :
{
  "mission_success": boolean,
  "detected_item": string, // ex: 'Bouteille Evian', 'Canette Coca', 'Rien'
  "xp_reward": number, // 50 si succès, 0 sinon
  "message": string // Feedback court pour l'étudiant
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
                mission_success: true,
                xp_reward: 50,
                detected_item: 'Simulation (No Key)',
                message: 'Bravo ! (Mode Simulation - Clé manquante)'
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
