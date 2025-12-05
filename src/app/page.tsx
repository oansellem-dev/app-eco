'use client';

import dynamicImport from 'next/dynamic';

const HomeContent = dynamicImport(() => import('@/components/HomeContent'), {
  ssr: false,
  loading: () => <div className="min-h-screen flex items-center justify-center bg-sand"><div className="animate-spin text-primary">Chargement...</div></div>
});

export const dynamic = 'force-dynamic';

export default function Home() {
  return <HomeContent />;
}
