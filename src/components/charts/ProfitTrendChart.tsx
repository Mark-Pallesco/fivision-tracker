import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
} from 'recharts';
import type { MonthlyData } from '@/types/finance';
import { formatCurrency } from '@/utils/currency';

interface ProfitTrendChartProps {
    data: MonthlyData[];
}

const CustomTooltip = ({ active, payload, label }: {
    active?: boolean;
    payload?: Array<{ value: number }>;
    label?: string;
}) => {
    if (active && payload && payload.length) {
        const value = payload[0].value;
        const isPositive = value >= 0;
        return (
            <div className="bg-white border border-[#E5E7EB] rounded-lg shadow-[0_4px_12px_0_rgb(0_0_0/0.08)] p-3">
                <p className="text-[12px] font-medium text-[#6B7280] mb-1">{label}</p>
                <p className={`text-[13px] font-semibold ${isPositive ? 'text-[#16A34A]' : 'text-[#DC2626]'}`}>
                    {formatCurrency(value)}
                </p>
            </div>
        );
    }
    return null;
};

export function ProfitTrendChart({ data }: ProfitTrendChartProps) {
    return (
        <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
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
                <ReferenceLine y={0} stroke="#E5E7EB" strokeDasharray="4 3" />
                <Line
                    type="monotone"
                    dataKey="profit"
                    stroke="#16A34A"
                    strokeWidth={2}
                    dot={{ r: 4, fill: '#16A34A', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 5 }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
}
