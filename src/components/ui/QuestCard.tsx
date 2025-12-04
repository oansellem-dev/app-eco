'use client';

import { MapPin, Camera } from 'lucide-react';

interface QuestCardProps {
    campusName: string;
    points: number;
    distance: number;
    onTakePhoto: () => void;
}

export default function QuestCard({ campusName, points, distance, onTakePhoto }: QuestCardProps) {
    return (
        <div className="bg-white mx-4 my-2 p-4 rounded-xl border border-gray-100 shadow-sm">

            <div className="flex justify-between items-center">
                <div className="flex items-center">
                    <MapPin size={20} className="text-[#2e8b57]" />
                    <span className="font-bold text-lg ml-2 text-gray-800">
                        {campusName}
                    </span>
                </div>
                <div className="bg-green-100 px-3 py-1 rounded-full">
                    <span className="text-green-700 font-bold">+{points} pts</span>
                </div>
            </div>

            <p className="text-gray-500 mt-2 text-sm">
                Zone sale signalée à {distance}m. Nettoie pour gagner des points !
            </p>

            <button
                className="mt-4 w-full bg-green-600 py-3 rounded-lg flex justify-center items-center hover:bg-green-700 transition-colors"
                onClick={onTakePhoto}
            >
                <Camera size={20} color="white" />
                <span className="text-white font-semibold ml-2">Prendre photo</span>
            </button>
        </div>
    );
}
