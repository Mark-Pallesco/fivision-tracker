import type { IncomeEntry, ExpenseEntry, DashboardMetrics, MonthlyData } from '@/types/finance';

/**
 * Calculate total amount from an array of entries
 */
export function calculateTotal(entries: Array<{ amount: number }>): number {
    return entries.reduce((sum, entry) => sum + entry.amount, 0);
}

/**
 * Calculate profit margin as a percentage
 */
export function calculateMargin(revenue: number, costs: number): number {
    if (revenue === 0) return 0;
    return ((revenue - costs) / revenue) * 100;
}

/**
 * Format a percentage growth value with +/- prefix
 */
export function formatGrowth(value: number): string {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
}

/**
 * Calculate growth percentage between two periods
 */
export function calculateGrowth(current: number, previous: number): number {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
}

/**
 * Build monthly aggregated data from income and expense entries
 */
export function buildMonthlyData(
    income: IncomeEntry[],
    expenses: ExpenseEntry[]
): MonthlyData[] {
    const months = [
        { key: '2026-01', label: 'Jan' },
        { key: '2026-02', label: 'Feb' },
        { key: '2026-03', label: 'Mar' },
    ];

    return months.map(({ key, label }) => {
        const revenue = income
            .filter((i) => i.date.startsWith(key))
            .reduce((sum, i) => sum + i.amount, 0);
        const expenseTotal = expenses
            .filter((e) => e.date.startsWith(key))
            .reduce((sum, e) => sum + e.amount, 0);
        return {
            month: label,
            revenue,
            expenses: expenseTotal,
            profit: revenue - expenseTotal,
        };
    });
}

/**
 * Calculate dashboard metrics from income and expense datasets
 */
export function calculateDashboardMetrics(
    income: IncomeEntry[],
    expenses: ExpenseEntry[]
): DashboardMetrics {
    const currentMonthKey = '2026-03';
    const prevMonthKey = '2026-02';

    const currentIncome = income.filter((i) => i.date.startsWith(currentMonthKey));
    const prevIncome = income.filter((i) => i.date.startsWith(prevMonthKey));
    const currentExpenses = expenses.filter((e) => e.date.startsWith(currentMonthKey));
    const prevExpenses = expenses.filter((e) => e.date.startsWith(prevMonthKey));

    const totalRevenue = calculateTotal(currentIncome);
    const totalExpenses = calculateTotal(currentExpenses);
    const prevRevenue = calculateTotal(prevIncome);
    const prevExpenses_ = calculateTotal(prevExpenses);
    const netProfit = totalRevenue - totalExpenses;
    const prevProfit = prevRevenue - prevExpenses_;

    return {
        totalRevenue,
        totalExpenses,
        netProfit,
        cashFlow: netProfit * 0.9, // conservative cash flow estimate
        revenueGrowth: calculateGrowth(totalRevenue, prevRevenue),
        expenseGrowth: calculateGrowth(totalExpenses, prevExpenses_),
        profitGrowth: calculateGrowth(netProfit, prevProfit),
        cashFlowGrowth: calculateGrowth(netProfit * 0.9, prevProfit * 0.9),
    };
}

/**
 * Calculate expense breakdown by category for the donut chart
 */
export function calculateExpenseBreakdown(
    expenses: ExpenseEntry[]
): Array<{ category: string; amount: number }> {
    const map: Record<string, number> = {};
    expenses.forEach((e) => {
        map[e.category] = (map[e.category] || 0) + e.amount;
    });
    return Object.entries(map).map(([category, amount]) => ({ category, amount }));
}

/**
 * Get margin tier label based on profit margin percentage
 */
export function getMarginTier(margin: number): 'high' | 'medium' | 'low' {
    if (margin >= 70) return 'high';
    if (margin >= 40) return 'medium';
    return 'low';
}
