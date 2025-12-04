'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
const QrScanner = dynamic(() => import('react-qr-scanner'), { ssr: false });
import { useAuth } from '@/contexts/AuthContext';
import { startMission, getMissionsStatus } from '@/lib/missionLogic';
import { Button } from '@/components/ui/Button';
import { ScanSuccess } from '@/components/animations/ScanSuccess';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ScannerPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [result, setResult] = useState<string | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [canScan, setCanScan] = useState(true);

    useEffect(() => {
        if (user) {
            getMissionsStatus(user.id).then(status => {
                // Legacy limit check removed for Phase 2 compatibility
                // if (status.cleanspot_count >= 3) { ... }
            });
        }
    }, [user]);

    const handleScan = async (data: any) => {
        if (data && !result && !loading && canScan) {
            // Validate QR code format (e.g., must start with "cleanspot:")
            const text = data.text || data; // react-qr-scanner might return object or string

            if (typeof text === 'string' && text.startsWith('cleanspot:')) {
                setResult(text);
                setLoading(true);

                try {
                    if (!user) return;

                    // Simulate network/validation delay
                    await new Promise(resolve => setTimeout(resolve, 800));

                    const res = await startMission(user.id, 'm5', text); // m5 is CleanSpot mission
                    if (res.status === 'validated') {
                        setShowSuccess(true);
                        setTimeout(() => {
                            router.push('/missions');
                        }, 2500);
                    } else {
                        // Should not happen for CleanSpot if logic is correct, but handle pending/rejected
                        if (res.status === 'pending') {
                            alert('Validation en cours...');
                            router.push('/missions');
                        }
                    }
                } catch (err: any) {
                    setError(err.message || "Erreur lors de la validation");
                    setResult(null);
                } finally {
                    setLoading(false);
                }
            }
        }
    };

    const handleError = (err: any) => {
        console.error(err);
        // Don't show error to user immediately as it fires on init often
    };

    return (
        <div className="mobile-container flex flex-col bg-black h-screen relative">
            {showSuccess && <ScanSuccess points={25} />}

            <div className="absolute top-0 left-0 right-0 p-4 z-10 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent">
                <Link href="/missions" className="text-white p-2">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <span className="text-white font-bold">Scan CleanSpot</span>
                <div className="w-10" /> {/* Spacer */}
            </div>

            <div className="flex-1 relative flex items-center justify-center overflow-hidden">
                {canScan ? (
                    <QrScanner
                        delay={300}
                        onError={handleError}
                        onScan={handleScan}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        constraints={{
                            video: { facingMode: 'environment' }
                        }}
                    />
                ) : (
                    <div className="text-white text-center p-8">
                        <p className="text-xl font-bold mb-2">Limite atteinte !</p>
                        <p className="text-gray-300">Reviens demain pour scanner de nouveaux CleanSpots.</p>
                    </div>
                )}

                {/* Overlay Frame */}
                <div className="absolute inset-0 border-[50px] border-black/50 pointer-events-none">
                    <div className="w-full h-full border-2 border-white/50 relative">
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-xl" />
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-xl" />
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-xl" />
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-xl" />
                    </div>
                </div>

                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-20">
                        <div className="bg-white p-4 rounded-2xl flex flex-col items-center">
                            <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
                            <p className="font-bold text-ink">Validation...</p>
                        </div>
                    </div>
                )}
            </div>

            {error && (
                <div className="absolute bottom-24 left-4 right-4 bg-red-500 text-white p-4 rounded-xl text-center font-medium animate-in slide-in-from-bottom-5">
                    {error}
                </div>
            )}

            <div className="absolute bottom-8 left-0 right-0 text-center text-white/80 text-sm">
                Place le QR Code dans le cadre
            </div>
        </div>
    );
}
