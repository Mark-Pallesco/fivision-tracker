import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useFinanceStore } from '@/hooks/useFinance';
import { Section } from '@/components/ui/index';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/utils/currency';
import { calculateMargin, getMarginTier } from '@/utils/calculations';
import { ArrowLeft, Building2, Plus, Pencil, Trash2 } from 'lucide-react';
import { ProjectFormModal } from './ProjectFormModal';
import { AddIncomeModal } from '@/pages/Income/AddIncomeModal';
import { Button } from '@/components/ui/index';
import type { Project, IncomeEntry } from '@/types/finance';

export default function ClientDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { clients, projects, income, loadAll, deleteProject, deleteIncome, loading } = useFinanceStore();
    const [projectModal, setProjectModal] = useState<{ isOpen: boolean; entry?: Project }>({ isOpen: false });
    const [incomeModal, setIncomeModal] = useState<{ isOpen: boolean; entry?: IncomeEntry }>({ isOpen: false });

    useEffect(() => {
        loadAll();
    }, [loadAll]);

    const client = clients.find((c) => c.id === Number(id));

    if (!loading && !client) {
        return (
            <div className="p-8">
                <button
                    onClick={() => navigate('/clients')}
                    className="flex items-center gap-2 text-[13px] text-[#6B7280] hover:text-[#111827] mb-6 transition-colors"
                >
                    <ArrowLeft size={14} /> Back to Clients
                </button>
                <p className="text-[14px] text-[#6B7280]">Client not found.</p>
            </div>
        );
    }

    if (loading || !client) {
        return (
            <div className="p-8 flex items-center justify-center h-full">
                <p className="text-[14px] text-[#6B7280]">Loading…</p>
            </div>
        );
    }

    // Projects for this client
    const clientProjects = projects.filter((p) => p.clientId === client.id);

    // Income entries for this client
    const clientIncome = income.filter((i) => i.client === client.name);

    const totalRevenue = clientIncome.reduce((s, i) => s + i.amount, 0);
    const totalCosts = clientProjects.reduce((s, p) => s + p.costs, 0);
    const netProfit = totalRevenue - totalCosts;

    const marginTierColor: Record<string, string> = {
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
            {projectModal.isOpen && (
                <ProjectFormModal
                    client={client}
                    entry={projectModal.entry}
                    onClose={() => setProjectModal({ isOpen: false })}
                />
            )}

            {incomeModal.isOpen && (
                <AddIncomeModal
                    entry={incomeModal.entry}
                    onClose={() => setIncomeModal({ isOpen: false })}
                />
            )}

            {/* Back link */}
            <button
                onClick={() => navigate('/clients')}
                className="flex items-center gap-2 text-[13px] text-[#6B7280] hover:text-[#111827] mb-6 transition-colors"
            >
                <ArrowLeft size={14} /> Back to Clients
            </button>

            {/* Client header card */}
            <div className="bg-white border border-[#E5E7EB] rounded-lg px-6 py-5 mb-6 shadow-[0_1px_3px_0_rgb(0_0_0/0.06)] flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-[#F3F4F6] flex items-center justify-center flex-shrink-0">
                    <Building2 size={22} className="text-[#374151]" />
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                        <h1 className="text-[22px] font-semibold text-[#111827] tracking-tight">{client.name}</h1>
                        <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-medium border ${client.status === 'Active' ? 'bg-[#F0FDF4] text-[#16A34A] border-[#BBF7D0]' : 'bg-[#F3F4F6] text-[#6B7280] border-[#E5E7EB]'}`}>
                            {client.status}
                        </span>
                    </div>
                    <p className="text-[13px] text-[#6B7280]">{client.industry} · {client.email} · {client.phone}</p>
                </div>

                {/* Summary stats */}
                <div className="flex items-center gap-8 flex-shrink-0">
                    <div className="text-right">
                        <p className="text-[12px] text-[#6B7280] mb-0.5">Total Revenue</p>
                        <p className="text-[18px] font-semibold text-[#111827] tabular-nums">{formatCurrency(totalRevenue)}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[12px] text-[#6B7280] mb-0.5">Net Profit</p>
                        <p className={`text-[18px] font-semibold tabular-nums ${netProfit >= 0 ? 'text-[#16A34A]' : 'text-[#DC2626]'}`}>{formatCurrency(netProfit)}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[12px] text-[#6B7280] mb-0.5">Projects</p>
                        <p className="text-[18px] font-semibold text-[#111827]">{clientProjects.length}</p>
                    </div>
                </div>
            </div>

            {/* Projects */}
            <Section
                title="Projects"
                description={`All projects for ${client.name}`}
                className="mb-6"
                action={
                    <Button onClick={() => setProjectModal({ isOpen: true })}>
                        <Plus size={14} /> Add Project
                    </Button>
                }
            >
                {clientProjects.length === 0 ? (
                    <p className="text-[13px] text-[#9CA3AF] py-6 text-center">No projects yet.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[#E5E7EB]">
                                    {['Project', 'Invoice Total', 'Paid', 'Balance', 'Costs', 'Profit', 'Margin', 'Status', 'End Date'].map((h) => (
                                        <th key={h} className={`pb-3 text-[12px] font-medium text-[#6B7280] uppercase tracking-wide ${['Invoice Total', 'Paid', 'Balance', 'Costs', 'Profit', 'Margin'].includes(h) ? 'text-right' : 'text-left'}`}>
                                            {h}
                                        </th>
                                    ))}
                                    <th className="pb-3 w-20" />
                                </tr>
                            </thead>
                            <tbody>
                                {clientProjects.map((p) => {
                                    const projectIncome = clientIncome.filter(i => i.project === p.name);
                                    const amountPaid = projectIncome.reduce((sum, i) => sum + i.amount, 0);
                                    const balance = p.revenue - amountPaid;

                                    const profit = p.revenue - p.costs;
                                    const margin = calculateMargin(p.revenue, p.costs);
                                    const tier = getMarginTier(margin);
                                    return (
                                        <tr key={p.id} className="border-b border-[#F3F4F6] hover:bg-[#FAFAFA] transition-colors duration-75 group">
                                            <td className="py-3 text-[14px] font-medium text-[#111827]">{p.name}</td>
                                            <td className="py-3 text-[14px] text-right tabular-nums text-[#111827]">{formatCurrency(p.revenue)}</td>
                                            <td className="py-3 text-[13px] text-right tabular-nums text-[#16A34A] font-medium">{formatCurrency(amountPaid)}</td>
                                            <td className={`py-3 text-[13px] text-right tabular-nums font-medium ${balance > 0 ? 'text-[#DC2626]' : 'text-[#6B7280]'}`}>{formatCurrency(balance)}</td>
                                            <td className="py-3 text-[13px] text-right tabular-nums text-[#6B7280]">{formatCurrency(p.costs)}</td>
                                            <td className={`py-3 text-[14px] font-semibold text-right tabular-nums ${profit >= 0 ? 'text-[#16A34A]' : 'text-[#DC2626]'}`}>{formatCurrency(profit)}</td>
                                            <td className={`py-3 text-[13px] font-semibold text-right ${marginTierColor[tier]}`}>{margin.toFixed(0)}%</td>
                                            <td className="py-3">
                                                <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-medium border ${statusBadge[p.status] ?? ''}`}>{p.status}</span>
                                            </td>
                                            <td className="py-3 text-[13px] text-[#6B7280]">
                                                {p.endDate ? format(new Date(p.endDate), 'MMM d, yyyy') : <span className="text-[#D97706]">Ongoing</span>}
                                            </td>
                                            <td className="py-3 w-20">
                                                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => setProjectModal({ isOpen: true, entry: p })}
                                                        className="p-1.5 text-[#9CA3AF] hover:text-[#2563EB] hover:bg-[#EFF6FF] rounded transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Pencil size={13} />
                                                    </button>
                                                    <button
                                                        onClick={() => deleteProject(p.id)}
                                                        className="p-1.5 text-[#9CA3AF] hover:text-[#DC2626] hover:bg-[#FEF2F2] rounded transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={13} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </Section>

            {/* Income transactions */}
            <Section title="Payment History" description="All income entries from this client">
                {clientIncome.length === 0 ? (
                    <p className="text-[13px] text-[#9CA3AF] py-6 text-center">No payments recorded.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[#E5E7EB]">
                                    <th className="pb-3 text-left text-[12px] font-medium text-[#6B7280] uppercase tracking-wide">Date</th>
                                    <th className="pb-3 text-left text-[12px] font-medium text-[#6B7280] uppercase tracking-wide">Project</th>
                                    <th className="pb-3 text-left text-[12px] font-medium text-[#6B7280] uppercase tracking-wide">Method</th>
                                    <th className="pb-3 text-right text-[12px] font-medium text-[#6B7280] uppercase tracking-wide">Amount</th>
                                    <th className="pb-3 text-left text-[12px] font-medium text-[#6B7280] uppercase tracking-wide pl-5">Status</th>
                                    <th className="pb-3 w-16" />
                                </tr>
                            </thead>
                            <tbody>
                                {clientIncome.map((i) => (
                                    <tr key={i.id} className="border-b border-[#F3F4F6] hover:bg-[#FAFAFA] transition-colors duration-75 group">
                                        <td className="py-3 text-[13px] text-[#6B7280]">{format(new Date(i.date), 'MMM d, yyyy')}</td>
                                        <td className="py-3">
                                            <p className="text-[14px] font-medium text-[#111827]">{i.project}</p>
                                            {i.description && (
                                                <p className="text-[12px] text-[#6B7280] mt-0.5">{i.description}</p>
                                            )}
                                        </td>
                                        <td className="py-3 text-[13px] text-[#6B7280]">{i.paymentMethod}</td>
                                        <td className="py-3 text-[14px] font-semibold text-[#111827] text-right tabular-nums">{formatCurrency(i.amount)}</td>
                                        <td className="py-3 pl-5"><Badge status={i.status} /></td>
                                        <td className="py-3 w-16">
                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => setIncomeModal({ isOpen: true, entry: i })}
                                                    className="p-1.5 text-[#9CA3AF] hover:text-[#2563EB] hover:bg-[#EFF6FF] rounded transition-colors"
                                                    title="Edit"
                                                >
                                                    <Pencil size={13} />
                                                </button>
                                                <button
                                                    onClick={() => deleteIncome(i.id)}
                                                    className="p-1.5 text-[#9CA3AF] hover:text-[#DC2626] hover:bg-[#FEF2F2] rounded transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={13} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className="border-t-2 border-[#E5E7EB]">
                                    <td colSpan={3} className="pt-3 text-[13px] font-semibold text-[#374151]">Total</td>
                                    <td className="pt-3 text-[14px] font-bold text-right tabular-nums text-[#111827]">{formatCurrency(totalRevenue)}</td>
                                    <td colSpan={2} />
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                )}
            </Section>
        </div>
    );
}
