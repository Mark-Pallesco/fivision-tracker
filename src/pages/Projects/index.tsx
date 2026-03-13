import { useEffect } from 'react';
import { useFinanceStore } from '@/hooks/useFinance';
import { PageHeader, Section } from '@/components/ui/index';
import { formatCurrency } from '@/utils/currency';
import { calculateMargin, getMarginTier } from '@/utils/calculations';
import { cn } from '@/utils/cn';

export default function Projects() {
    const { projects, loadAll, loading } = useFinanceStore();

    useEffect(() => { loadAll(); }, [loadAll]);

    const sorted = [...projects].sort((a, b) => (b.revenue - b.costs) - (a.revenue - a.costs));
    const totalRevenue = sorted.reduce((s, p) => s + p.revenue, 0);
    const totalCosts = sorted.reduce((s, p) => s + p.costs, 0);
    const totalProfit = totalRevenue - totalCosts;

    const marginTierStyle: Record<string, string> = {
        high: 'text-[#16A34A]',
        medium: 'text-[#D97706]',
        low: 'text-[#DC2626]',
    };

    const statusBadge: Record<string, string> = {
        Active: 'bg-[#F0FDF4] text-[#16A34A] border-[#BBF7D0]',
        Completed: 'bg-[#F3F4F6] text-[#374151] border-[#E5E7EB]',
        'On Hold': 'bg-[#FFFBEB] text-[#D97706] border-[#FDE68A]',
        Cancelled: 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]',
    };

    return (
        <div className="p-8">
            <PageHeader title="Projects" description="Project profitability tracker" />

            {/* Summary Strip */}
            <div className="flex items-center gap-8 bg-white border border-[#E5E7EB] rounded-lg px-5 py-4 mb-6 shadow-[0_1px_3px_0_rgb(0_0_0/0.06)]">
                <div><p className="text-[12px] text-[#6B7280] mb-0.5">Total Revenue</p>
                    <p className="text-[20px] font-semibold text-[#111827]">{formatCurrency(totalRevenue)}</p></div>
                <div className="h-8 w-px bg-[#E5E7EB]" />
                <div><p className="text-[12px] text-[#6B7280] mb-0.5">Total Costs</p>
                    <p className="text-[20px] font-semibold text-[#DC2626]">{formatCurrency(totalCosts)}</p></div>
                <div className="h-8 w-px bg-[#E5E7EB]" />
                <div><p className="text-[12px] text-[#6B7280] mb-0.5">Net Profit</p>
                    <p className="text-[20px] font-semibold text-[#16A34A]">{formatCurrency(totalProfit)}</p></div>
            </div>

            <Section>
                {loading ? (
                    <p className="text-[13px] text-[#6B7280] py-8 text-center">Loading…</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[#E5E7EB]">
                                    <th className="pb-3 text-left text-[12px] font-medium text-[#6B7280] uppercase tracking-wide">Project</th>
                                    <th className="pb-3 text-left text-[12px] font-medium text-[#6B7280] uppercase tracking-wide">Client</th>
                                    <th className="pb-3 text-right text-[12px] font-medium text-[#6B7280] uppercase tracking-wide">Revenue</th>
                                    <th className="pb-3 text-right text-[12px] font-medium text-[#6B7280] uppercase tracking-wide">Costs</th>
                                    <th className="pb-3 text-right text-[12px] font-medium text-[#6B7280] uppercase tracking-wide">Profit</th>
                                    <th className="pb-3 text-center text-[12px] font-medium text-[#6B7280] uppercase tracking-wide">Margin</th>
                                    <th className="pb-3 text-left text-[12px] font-medium text-[#6B7280] uppercase tracking-wide pl-4">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sorted.map((project) => {
                                    const profit = project.revenue - project.costs;
                                    const margin = calculateMargin(project.revenue, project.costs);
                                    const tier = getMarginTier(margin);
                                    return (
                                        <tr key={project.id} className="border-b border-[#F3F4F6] hover:bg-[#FAFAFA] transition-colors duration-75">
                                            <td className="py-3 text-[14px] font-medium text-[#111827]">{project.name}</td>
                                            <td className="py-3 text-[13px] text-[#6B7280]">{project.client}</td>
                                            <td className="py-3 text-[14px] font-semibold text-[#111827] text-right tabular-nums">{formatCurrency(project.revenue)}</td>
                                            <td className="py-3 text-[13px] text-[#6B7280] text-right tabular-nums">{formatCurrency(project.costs)}</td>
                                            <td className={cn('py-3 text-[14px] font-semibold text-right tabular-nums', profit >= 0 ? 'text-[#16A34A]' : 'text-[#DC2626]')}>
                                                {formatCurrency(profit)}
                                            </td>
                                            <td className="py-3 text-center">
                                                <span className={cn('text-[13px] font-semibold', marginTierStyle[tier])}>
                                                    {margin.toFixed(0)}%
                                                </span>
                                            </td>
                                            <td className="py-3 pl-4">
                                                <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-medium border ${statusBadge[project.status] ?? ''}`}>
                                                    {project.status}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </Section>
        </div>
    );
}
