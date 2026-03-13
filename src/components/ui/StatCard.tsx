import { cn } from '@/utils/cn';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency } from '@/utils/currency';
import { formatGrowth } from '@/utils/calculations';
import type { ReactNode } from 'react';

interface StatCardProps {
    title: string;
    value: number;
    growth?: number;
    growthLabel?: string;
    icon?: ReactNode;
    className?: string;
}

export function StatCard({
    title,
    value,
    growth,
    growthLabel = 'this month',
    className,
}: StatCardProps) {
    const isPositive = growth !== undefined && growth >= 0;

    return (
        <div
            className={cn(
                'bg-white border border-[#E5E7EB] rounded-lg p-5 shadow-[0_1px_3px_0_rgb(0_0_0/0.06)]',
                className
            )}
        >
            <p className="text-[13px] font-medium text-[#6B7280] mb-3">{title}</p>
            <p className="text-[28px] font-semibold text-[#111827] tracking-tight leading-none mb-3">
                {formatCurrency(value)}
            </p>
            {growth !== undefined && (
                <div className="flex items-center gap-1.5">
                    {isPositive ? (
                        <TrendingUp size={13} className="text-[#16A34A]" />
                    ) : (
                        <TrendingDown size={13} className="text-[#DC2626]" />
                    )}
                    <span
                        className={cn(
                            'text-[12px] font-medium',
                            isPositive ? 'text-[#16A34A]' : 'text-[#DC2626]'
                        )}
                    >
                        {formatGrowth(growth)}
                    </span>
                    <span className="text-[12px] text-[#9CA3AF]">{growthLabel}</span>
                </div>
            )}
        </div>
    );
}
