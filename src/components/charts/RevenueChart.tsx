import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';
import type { MonthlyData } from '@/types/finance';
import { formatCurrency } from '@/utils/currency';

interface RevenueChartProps {
    data: MonthlyData[];
}

const CustomTooltip = ({ active, payload, label }: {
    active?: boolean;
    payload?: Array<{ value: number; name: string; color: string }>;
    label?: string;
}) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white border border-[#E5E7EB] rounded-lg shadow-[0_4px_12px_0_rgb(0_0_0/0.08)] p-3">
                <p className="text-[12px] font-medium text-[#6B7280] mb-2">{label}</p>
                {payload.map((p) => (
                    <div key={p.name} className="flex items-center gap-2 mb-1 last:mb-0">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                        <span className="text-[12px] text-[#374151] capitalize">{p.name}</span>
                        <span className="text-[12px] font-semibold text-[#111827] ml-1">
                            {formatCurrency(p.value)}
                        </span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

export function RevenueExpensesChart({ data }: RevenueChartProps) {
    return (
        <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563EB" stopOpacity={0.08} />
                        <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#DC2626" stopOpacity={0.06} />
                        <stop offset="95%" stopColor="#DC2626" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12, fill: '#9CA3AF' }}
                    axisLine={false}
                    tickLine={false}
                />
                <YAxis
                    tickFormatter={(v) => `₱${(v / 1000).toFixed(0)}k`}
                    tick={{ fontSize: 11, fill: '#9CA3AF' }}
                    axisLine={false}
                    tickLine={false}
                    width={52}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                    formatter={(value) => (
                        <span className="text-[12px] text-[#6B7280] capitalize">{value}</span>
                    )}
                    iconType="circle"
                    iconSize={8}
                />
                <Area
                    type="monotone"
                    dataKey="revenue"
                    name="Revenue"
                    stroke="#2563EB"
                    strokeWidth={2}
                    fill="url(#revGrad)"
                    dot={{ r: 3, fill: '#2563EB', strokeWidth: 0 }}
                    activeDot={{ r: 4 }}
                />
                <Area
                    type="monotone"
                    dataKey="expenses"
                    name="Expenses"
                    stroke="#DC2626"
                    strokeWidth={2}
                    fill="url(#expGrad)"
                    dot={{ r: 3, fill: '#DC2626', strokeWidth: 0 }}
                    activeDot={{ r: 4 }}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}
