import { useEffect } from 'react';

import { useFinanceStore } from '@/hooks/useFinance';
import { PageHeader, Section, Button } from '@/components/ui/index';
import { formatCurrency } from '@/utils/currency';
import { calculateTotal } from '@/utils/calculations';
import { Download, FileText } from 'lucide-react';

function downloadCSV(filename: string, rows: string[][], headers: string[]) {
    const csvContent = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
}

export default function Reports() {
    const { income, expenses, loadAll, monthlyData } = useFinanceStore();

    useEffect(() => { loadAll(); }, [loadAll]);

    const totalRevenue = calculateTotal(income);
    const totalExpenses = calculateTotal(expenses);
    const netProfit = totalRevenue - totalExpenses;
    const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

    const handleExportIncomeCSV = () => {
        downloadCSV(
            'fivision-income-report.csv',
            income.map((i) => [i.date, i.client, i.project, String(i.amount), i.paymentMethod, i.status]),
            ['Date', 'Client', 'Project', 'Amount (₱)', 'Payment Method', 'Status']
        );
    };

    const handleExportExpensesCSV = () => {
        downloadCSV(
            'fivision-expenses-report.csv',
            expenses.map((e) => [e.date, e.category, e.description, String(e.amount)]),
            ['Date', 'Category', 'Description', 'Amount (₱)']
        );
    };

    const handleExportPLCSV = () => {
        downloadCSV(
            'fivision-pl-report.csv',
            [
                ...monthlyData.map((m) => [m.month, String(m.revenue), String(m.expenses), String(m.profit)]),
                ['TOTAL', String(totalRevenue), String(totalExpenses), String(netProfit)],
            ],
            ['Month', 'Revenue (₱)', 'Expenses (₱)', 'Net Profit (₱)']
        );
    };

    return (
        <div className="p-4 md:p-8">
            <PageHeader title="Reports" description="Financial reporting and exports" />

            {/* P&L Summary */}
            <Section title="Profit & Loss Summary" description="All-time financial overview" className="mb-6">
                <div className="grid grid-cols-4 gap-5">
                    {[
                        { label: 'Total Revenue', value: totalRevenue, color: 'text-[#2563EB]' },
                        { label: 'Total Expenses', value: totalExpenses, color: 'text-[#DC2626]' },
                        { label: 'Net Profit', value: netProfit, color: netProfit >= 0 ? 'text-[#16A34A]' : 'text-[#DC2626]' },
                        { label: 'Profit Margin', value: null, color: 'text-[#111827]', label2: `${profitMargin.toFixed(1)}%` },
                    ].map(({ label, value, color, label2 }) => (
                        <div key={label} className="border border-[#E5E7EB] rounded-lg p-4">
                            <p className="text-[12px] text-[#6B7280] mb-1.5">{label}</p>
                            <p className={`text-[22px] font-semibold tabular-nums ${color}`}>
                                {value !== null ? formatCurrency(value) : label2}
                            </p>
                        </div>
                    ))}
                </div>
            </Section>

            {/* Monthly P&L Table */}
            <Section title="Monthly Performance" description="Revenue, expenses, and profit by month" className="mb-6">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-[#E5E7EB]">
                            {['Month', 'Revenue', 'Expenses', 'Net Profit', 'Margin'].map((h) => (
                                <th key={h} className={`pb-3 text-[12px] font-medium text-[#6B7280] uppercase tracking-wide ${h === 'Month' ? 'text-left' : 'text-right'}`}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {monthlyData.map((m) => {
                            const margin = m.revenue > 0 ? ((m.profit / m.revenue) * 100).toFixed(1) : '0.0';
                            return (
                                <tr key={m.month} className="border-b border-[#F3F4F6] hover:bg-[#FAFAFA]">
                                    <td className="py-3 text-[14px] font-medium text-[#111827]">{m.month} 2026</td>
                                    <td className="py-3 text-[14px] text-right tabular-nums text-[#111827]">{formatCurrency(m.revenue)}</td>
                                    <td className="py-3 text-[14px] text-right tabular-nums text-[#DC2626]">{formatCurrency(m.expenses)}</td>
                                    <td className={`py-3 text-[14px] font-semibold text-right tabular-nums ${m.profit >= 0 ? 'text-[#16A34A]' : 'text-[#DC2626]'}`}>{formatCurrency(m.profit)}</td>
                                    <td className="py-3 text-[13px] text-right text-[#6B7280]">{margin}%</td>
                                </tr>
                            );
                        })}
                    </tbody>
                    <tfoot>
                        <tr className="border-t-2 border-[#E5E7EB]">
                            <td className="pt-3 text-[13px] font-semibold text-[#374151]">Total</td>
                            <td className="pt-3 text-[14px] font-semibold text-right tabular-nums text-[#111827]">{formatCurrency(totalRevenue)}</td>
                            <td className="pt-3 text-[14px] font-semibold text-right tabular-nums text-[#DC2626]">{formatCurrency(totalExpenses)}</td>
                            <td className={`pt-3 text-[14px] font-bold text-right tabular-nums ${netProfit >= 0 ? 'text-[#16A34A]' : 'text-[#DC2626]'}`}>{formatCurrency(netProfit)}</td>
                            <td className="pt-3 text-[13px] font-semibold text-right text-[#6B7280]">{profitMargin.toFixed(1)}%</td>
                        </tr>
                    </tfoot>
                </table>
            </Section>

            {/* Export Section */}
            <Section title="Export Reports" description="Download data as CSV">
                <div className="grid grid-cols-3 gap-4">
                    <div className="border border-[#E5E7EB] rounded-lg p-4 flex flex-col gap-3">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-md bg-[#EFF6FF] flex items-center justify-center">
                                <FileText size={14} className="text-[#2563EB]" />
                            </div>
                            <div>
                                <p className="text-[14px] font-medium text-[#111827]">Income Report</p>
                                <p className="text-[12px] text-[#9CA3AF]">All revenue entries</p>
                            </div>
                        </div>
                        <Button variant="secondary" size="sm" onClick={handleExportIncomeCSV} className="w-full justify-center">
                            <Download size={13} /> Export CSV
                        </Button>
                    </div>

                    <div className="border border-[#E5E7EB] rounded-lg p-4 flex flex-col gap-3">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-md bg-[#FEF2F2] flex items-center justify-center">
                                <FileText size={14} className="text-[#DC2626]" />
                            </div>
                            <div>
                                <p className="text-[14px] font-medium text-[#111827]">Expense Report</p>
                                <p className="text-[12px] text-[#9CA3AF]">All expense entries</p>
                            </div>
                        </div>
                        <Button variant="secondary" size="sm" onClick={handleExportExpensesCSV} className="w-full justify-center">
                            <Download size={13} /> Export CSV
                        </Button>
                    </div>

                    <div className="border border-[#E5E7EB] rounded-lg p-4 flex flex-col gap-3">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-md bg-[#F0FDF4] flex items-center justify-center">
                                <FileText size={14} className="text-[#16A34A]" />
                            </div>
                            <div>
                                <p className="text-[14px] font-medium text-[#111827]">P&L Summary</p>
                                <p className="text-[12px] text-[#9CA3AF]">Monthly profit & loss</p>
                            </div>
                        </div>
                        <Button variant="secondary" size="sm" onClick={handleExportPLCSV} className="w-full justify-center">
                            <Download size={13} /> Export CSV
                        </Button>
                    </div>
                </div>
            </Section>
        </div>
    );
}
