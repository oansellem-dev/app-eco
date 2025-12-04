import { EcoCard } from '@/components/ui/EcoCard';
import { Coffee, Printer, Ticket, Tv } from 'lucide-react';

export function RewardsSection() {
    const rewards = [
        { icon: Coffee, label: 'Café gratuit', cost: '150 pts', color: 'text-amber-700', bg: 'bg-amber-100' },
        { icon: Printer, label: 'Impressions', cost: '100 pts', color: 'text-blue-600', bg: 'bg-blue-100' },
        { icon: Ticket, label: 'Accès VIP', cost: '500 pts', color: 'text-purple-600', bg: 'bg-purple-100' },
        { icon: Tv, label: 'Eco-Hero TV', cost: '1000 pts', color: 'text-green-600', bg: 'bg-green-100' },
    ];

    return (
        <div>
            <h2 className="font-bold text-ink mb-3">Récompenses</h2>
            <div className="grid grid-cols-2 gap-3">
                {rewards.map((r, i) => (
                    <EcoCard key={i} className="flex flex-col items-center justify-center p-3 bg-white hover:shadow-md transition-shadow cursor-pointer">
                        <div className={`p-2 rounded-full mb-2 ${r.bg}`}>
                            <r.icon className={`w-5 h-5 ${r.color}`} />
                        </div>
                        <span className="text-xs font-bold text-center mb-1">{r.label}</span>
                        <span className="text-[10px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{r.cost}</span>
                    </EcoCard>
                ))}
            </div>
        </div>
    );
}
