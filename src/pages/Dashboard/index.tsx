import { useEffect } from 'react';
import { format } from 'date-fns';
import { useFinanceStore } from '@/hooks/useFinance';
import { StatCard } from '@/components/ui/StatCard';
import { Badge } from '@/components/ui/Badge';
import { Section, PageHeader } from '@/components/ui/index';
import { RevenueExpensesChart } from '@/components/charts/RevenueChart';
import { ExpenseBreakdownChart } from '@/components/charts/ExpenseBreakdownChart';
import { ProfitTrendChart } from '@/components/charts/ProfitTrendChart';
import { formatCurrency } from '@/utils/currency';

export default function Dashboard() {
    const { loadAll, metrics, income, monthlyData, expenseBreakdown, loading } = useFinanceStore();

    useEffect(() => {
        loadAll();
    }, [loadAll]);

    const recentTransactions = income.slice(0, 8);

    if (loading || !metrics) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-[14px] text-[#6B7280]">Loading dashboard...</div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8">
            <PageHeader
                title="Dashboard"
                description="Financial overview for March 2026"
            />

            {/* Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 mb-8">
                <StatCard
                    title="Revenue"
                    value={metrics.totalRevenue}
                    growth={metrics.revenueGrowth}
                />
                <StatCard
                    title="Expenses"
                    value={metrics.totalExpenses}
                    growth={metrics.expenseGrowth}
                />
                <StatCard
                    title="Net Profit"
                    value={metrics.netProfit}
                    growth={metrics.profitGrowth}
                />
                <StatCard
                    title="Cash Flow"
                    value={metrics.cashFlow}
                    growth={metrics.cashFlowGrowth}
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-8">
                {/* Revenue vs Expenses */}
                <div className="col-span-1 lg:col-span-7">
                    <Section title="Revenue vs Expenses" description="Monthly performance comparison">
                        <RevenueExpensesChart data={monthlyData} />
                    </Section>
                </div>

                {/* Expense Breakdown */}
                <div className="col-span-1 lg:col-span-5">
                    <Section title="Expense Breakdown" description="By category, all time">
                        <ExpenseBreakdownChart data={expenseBreakdown} />
                    </Section>
                </div>
            </div>

            {/* Profit Trend */}
            <div className="mb-8">
                <Section title="Monthly Profit Trend" description="Net profit over time">
                    <ProfitTrendChart data={monthlyData} />
                </Section>
            </div>

            {/* Recent Transactions */}
            <Section title="Recent Transactions" description="Latest income entries">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[#E5E7EB]">
                                <th className="text-left pb-3 text-[12px] font-medium text-[#6B7280] uppercase tracking-wide">
                                    Date
                                </th>
                                <th className="text-left pb-3 text-[12px] font-medium text-[#6B7280] uppercase tracking-wide">
                                    Client
                                </th>
                                <th className="text-left pb-3 text-[12px] font-medium text-[#6B7280] uppercase tracking-wide">
                                    Project
                                </th>
                                <th className="text-right pb-3 text-[12px] font-medium text-[#6B7280] uppercase tracking-wide">
                                    Amount
                                </th>
                                <th className="text-left pb-3 text-[12px] font-medium text-[#6B7280] uppercase tracking-wide pl-6">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentTransactions.map((tx) => (
                                <tr
                                    key={tx.id}
                                    className="border-b border-[#F3F4F6] hover:bg-[#FAFAFA] transition-colors duration-75"
                                >
                                    <td className="py-3 text-[13px] text-[#6B7280]">
                                        {format(new Date(tx.date), 'MMM d, yyyy')}
                                    </td>
                                    <td className="py-3 text-[14px] font-medium text-[#111827]">
                                        {tx.client}
                                    </td>
                                    <td className="py-3 text-[13px] text-[#6B7280]">{tx.project}</td>
                                    <td className="py-3 text-[14px] font-semibold text-[#111827] text-right tabular-nums">
                                        {formatCurrency(tx.amount)}
                                    </td>
                                    <td className="py-3 pl-6">
                                        <Badge status={tx.status} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Section>
        </div>
    );
}
