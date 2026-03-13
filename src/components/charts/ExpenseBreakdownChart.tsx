import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';
import { formatCurrency } from '@/utils/currency';

interface ExpenseBreakdownChartProps {
    data: Array<{ category: string; amount: number }>;
}

const COLORS = [
    '#2563EB',
    '#7C3AED',
    '#DB2777',
    '#EA580C',
    '#D97706',
    '#16A34A',
    '#0891B2',
];

const CustomTooltip = ({ active, payload }: {
    active?: boolean;
    payload?: Array<{ payload: { category: string; amount: number } }>;
}) => {
    if (active && payload && payload.length) {
        const { category, amount } = payload[0].payload;
        return (
            <div className="bg-white border border-[#E5E7EB] rounded-lg shadow-[0_4px_12px_0_rgb(0_0_0/0.08)] p-3">
                <p className="text-[12px] font-medium text-[#6B7280] mb-1">{category}</p>
                <p className="text-[13px] font-semibold text-[#111827]">{formatCurrency(amount)}</p>
            </div>
        );
    }
    return null;
};

export function ExpenseBreakdownChart({ data }: ExpenseBreakdownChartProps) {
    return (
        <ResponsiveContainer width="100%" height={220}>
            <PieChart>
                <Pie
                    data={data}
                    cx="40%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={2}
                    dataKey="amount"
                    nameKey="category"
                >
                    {data.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                    ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                    layout="vertical"
                    align="right"
                    verticalAlign="middle"
                    iconType="circle"
                    iconSize={8}
                    formatter={(value) => (
                        <span className="text-[12px] text-[#6B7280]">{value}</span>
                    )}
                />
            </PieChart>
        </ResponsiveContainer>
    );
}
