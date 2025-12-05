'use client';

import dynamic from 'next/dynamic';

const HomeContent = dynamic(() => import('@/components/HomeContent'), {
  ssr: false,
  loading: () => <div className="min-h-screen flex items-center justify-center bg-sand"><div className="animate-spin text-primary">Chargement...</div></div>
});

export default function Home() {
  return <HomeContent />;
}
