'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { startMission } from '@/lib/missionLogic';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Camera, RefreshCw, Check, Zap } from 'lucide-react';
import Link from 'next/link';
import { ScanSuccess } from '@/components/animations/ScanSuccess';

function CameraContent() {
    const { user } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const missionId = searchParams.get('missionId');

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [image, setImage] = useState<string | null>(null);
    const [cameraFacingMode, setCameraFacingMode] = useState<'user' | 'environment'>('environment');
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [points, setPoints] = useState(0);

    useEffect(() => {
        startCamera();
        return () => {
            stopCamera();
        };
    }, [cameraFacingMode]);

    const startCamera = async () => {
        try {
            const constraints = {
                video: { facingMode: cameraFacingMode }
            };
            const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
            setError(null);
        } catch (err) {
            console.error("Error accessing camera:", err);
            setError("Nous avons besoin de la caméra pour valider ta mission.");
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    const switchCamera = () => {
        setCameraFacingMode(prev => prev === 'user' ? 'environment' : 'user');
    };

    const takePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');

            if (context) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                const dataUrl = canvas.toDataURL('image/jpeg', 0.8); // Medium compression
                setImage(dataUrl);
                // Stop camera to save battery/resources while previewing
                // stopCamera(); // Optional: keep running if we want fast retake, but better to stop? 
                // Let's keep it running for "live" feel if they cancel, but maybe pause?
                // For now, let's just keep it running in background or pause video.
                video.pause();
            }
        }
    };

    const retakePhoto = () => {
        setImage(null);
        if (videoRef.current) {
            videoRef.current.play();
        }
    };

    const validatePhoto = async () => {
        if (!user || !missionId || !image) return;
        setLoading(true);

        try {
            // Simulate AI validation or just submit
            const res = await startMission(user.id, missionId, image); // Pass base64 image

            if (res.status === 'validated') {
                setPoints(res.points || 0);
                setShowSuccess(true);
                setTimeout(() => {
                    router.push('/missions');
                }, 2500);
            } else if (res.status === 'pending') {
                alert('Mission envoyée pour validation !');
                router.push('/missions');
            }
        } catch (err) {
            console.error(err);
            setError("Erreur lors de l'envoi de la mission.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-black h-screen flex flex-col relative overflow-hidden">
            {showSuccess && <ScanSuccess points={points} />}

            {/* Header */}
            <div className="absolute top-0 left-0 right-0 p-4 z-20 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent">
                <Link href="/missions" className="text-white p-2">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <span className="text-white font-bold">Preuve Photo</span>
                <div className="w-10" />
            </div>

            {/* Camera View / Image Preview */}
            <div className="flex-1 relative flex items-center justify-center bg-black">
                {error ? (
                    <div className="text-white text-center p-8">
                        <p className="text-red-400 mb-4">{error}</p>
                        <Button onClick={() => startCamera()} variant="outline" className="border-white text-white">
                            Réessayer
                        </Button>
                    </div>
                ) : (
                    <>
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className={`w-full h-full object-cover ${image ? 'hidden' : 'block'}`}
                        />
                        <canvas ref={canvasRef} className="hidden" />

                        {image && (
                            <img src={image} alt="Preview" className="w-full h-full object-cover" />
                        )}
                    </>
                )}
            </div>

            {/* Controls */}
            <div className="absolute bottom-0 left-0 right-0 p-8 pb-12 bg-gradient-to-t from-black/80 to-transparent z-20">
                {!image ? (
                    <div className="flex justify-between items-center">
                        <button onClick={switchCamera} className="p-3 bg-white/20 rounded-full text-white backdrop-blur-sm">
                            <RefreshCw className="w-6 h-6" />
                        </button>

                        <button
                            onClick={takePhoto}
                            className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center bg-white/20 backdrop-blur-sm active:scale-95 transition-transform"
                        >
                            <div className="w-16 h-16 bg-white rounded-full" />
                        </button>

                        <button className="p-3 bg-white/20 rounded-full text-white backdrop-blur-sm opacity-50 cursor-not-allowed">
                            <Zap className="w-6 h-6" />
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        <div className="flex gap-4">
                            <Button
                                onClick={retakePhoto}
                                variant="secondary"
                                className="flex-1 bg-white/20 text-white border-none hover:bg-white/30"
                            >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Recommencer
                            </Button>
                            <Button
                                onClick={validatePhoto}
                                isLoading={loading}
                                variant="primary"
                                className="flex-1"
                            >
                                <Check className="w-4 h-4 mr-2" />
                                Valider
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function CameraPage() {
    return (
        <Suspense fallback={<div className="bg-black h-screen flex items-center justify-center text-white">Chargement caméra...</div>}>
            <CameraContent />
        </Suspense>
    );
}
