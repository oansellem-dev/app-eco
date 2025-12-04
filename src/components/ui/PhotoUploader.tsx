'use client';

import { useState, useRef } from 'react';
import { Camera, X, Check, Loader2 } from 'lucide-react';
import { Button } from './Button';
import { motion, AnimatePresence } from 'framer-motion';

interface PhotoUploaderProps {
    onPhotoTaken: (file: File) => void;
    onVerified?: () => void;
    isVerifying?: boolean;
}

export function PhotoUploader({ onPhotoTaken, onVerified, isVerifying }: PhotoUploaderProps) {
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreview(url);
            onPhotoTaken(file);
        }
    };

    const clearPhoto = () => {
        setPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="w-full">
            <input
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
            />

            <AnimatePresence mode="wait">
                {!preview ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-primary/30 rounded-3xl bg-sand/30 hover:bg-sand/50 transition-colors cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center shadow-leaf mb-4">
                            <Camera className="w-10 h-10 text-white" />
                        </div>
                        <p className="text-primary-dark font-bold text-lg">Prendre une photo</p>
                        <p className="text-earth text-sm mt-2 text-center">
                            Montre-nous ton action écolo !
                        </p>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative rounded-3xl overflow-hidden shadow-xl"
                    >
                        <img src={preview} alt="Preview" className="w-full h-auto object-cover max-h-[60vh]" />

                        <button
                            onClick={clearPhoto}
                            className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                            <Button
                                fullWidth
                                onClick={onVerified}
                                isLoading={isVerifying}
                                className="bg-success hover:bg-success/90 text-white shadow-lg shadow-success/30"
                            >
                                {isVerifying ? 'Vérification IA...' : (
                                    <span className="flex items-center">
                                        <Check className="w-5 h-5 mr-2" />
                                        Valider l'action
                                    </span>
                                )}
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
