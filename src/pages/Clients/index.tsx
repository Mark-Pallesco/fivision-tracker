import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useFinanceStore } from '@/hooks/useFinance';
import { PageHeader, Section, Button } from '@/components/ui/index';
import { formatCurrency } from '@/utils/currency';
import { ArrowUpDown, UserPlus, ChevronRight, Pencil, Trash2 } from 'lucide-react';
import { AddClientModal } from './AddClientModal';
import type { Client } from '@/types/finance';

type SortDir = 'asc' | 'desc';

export default function Clients() {
    const { clients, loadAll, deleteClient, loading } = useFinanceStore();
    const navigate = useNavigate();
    const [sortKey, setSortKey] = useState<keyof Client>('totalRevenue');
    const [sortDir, setSortDir] = useState<SortDir>('desc');
    const [modalEntry, setModalEntry] = useState<Client | null | undefined>(null);

    useEffect(() => {
        loadAll();
    }, [loadAll]);

    const sorted = [...clients].sort((a, b) => {
        const av = a[sortKey];
        const bv = b[sortKey];
        const cmp =
            typeof av === 'number' && typeof bv === 'number'
                ? av - bv
                : String(av).localeCompare(String(bv));
        return sortDir === 'desc' ? -cmp : cmp;
    });

    const handleSort = (key: keyof Client) => {
        if (sortKey === key) setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'));
        else {
            setSortKey(key);
            setSortDir('desc');
        }
    };

    const totalRevenue = clients.reduce((s, c) => s + c.totalRevenue, 0);

    return (
        <div className="p-8">
            {modalEntry !== null && (
                <AddClientModal
                    entry={modalEntry ?? undefined}
                    onClose={() => setModalEntry(null)}
                />
            )}

            <PageHeader
                title="Clients"
                description="Revenue analytics per client"
                action={
                    <Button onClick={() => setModalEntry(undefined)}>
                        <UserPlus size={14} /> Add Client
                    </Button>
                }
            />

            {/* Summary Strip */}
            <div className="flex items-center gap-8 bg-white border border-[#E5E7EB] rounded-lg px-5 py-4 mb-6 shadow-[0_1px_3px_0_rgb(0_0_0/0.06)]">
                <div>
                    <p className="text-[12px] text-[#6B7280] mb-0.5">Total Client Revenue</p>
                    <p className="text-[20px] font-semibold text-[#111827]">
                        {formatCurrency(totalRevenue)}
                    </p>
                </div>
                <div className="h-8 w-px bg-[#E5E7EB]" />
                <div>
                    <p className="text-[12px] text-[#6B7280] mb-0.5">Active Clients</p>
                    <p className="text-[20px] font-semibold text-[#111827]">
                        {clients.filter((c) => c.status === 'Active').length}
                    </p>
                </div>
                <div className="h-8 w-px bg-[#E5E7EB]" />
                <div>
                    <p className="text-[12px] text-[#6B7280] mb-0.5">Total Clients</p>
                    <p className="text-[20px] font-semibold text-[#111827]">{clients.length}</p>
                </div>
            </div>

            <Section>
                {loading ? (
                    <p className="text-[13px] text-[#6B7280] py-8 text-center">Loading…</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[#E5E7EB]">
                                    {[
                                        { key: 'name', label: 'Client' },
                                        { key: 'industry', label: 'Industry' },
                                        { key: 'totalRevenue', label: 'Total Revenue' },
                                        { key: 'projectCount', label: 'Projects' },
                                        { key: 'lastPaymentDate', label: 'Last Payment' },
                                        { key: 'status', label: 'Status' },
                                    ].map(({ key, label }) => (
                                        <th
                                            key={key}
                                            onClick={() => handleSort(key as keyof Client)}
                                            className="pb-3 text-left text-[12px] font-medium text-[#6B7280] uppercase tracking-wide cursor-pointer select-none hover:text-[#374151] transition-colors"
                                        >
                                            <span className="flex items-center gap-1">
                                                {label}
                                                <ArrowUpDown size={11} className="text-[#D1D5DB]" />
                                            </span>
                                        </th>
                                    ))}
                                    <th className="pb-3 w-8" />
                                </tr>
                            </thead>
                            <tbody>
                                {sorted.map((client) => (
                                    <tr
                                        key={client.id}
                                        onClick={() => navigate(`/clients/${client.id}`)}
                                        className="border-b border-[#F3F4F6] hover:bg-[#FAFAFA] transition-colors duration-75 cursor-pointer group"
                                    >
                                        <td className="py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-[#F3F4F6] flex items-center justify-center text-[11px] font-semibold text-[#374151] flex-shrink-0">
                                                    {client.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-[14px] font-medium text-[#111827] group-hover:text-[#2563EB] transition-colors">
                                                        {client.name}
                                                    </p>
                                                    <p className="text-[12px] text-[#9CA3AF]">{client.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 text-[13px] text-[#6B7280]">{client.industry}</td>
                                        <td className="py-3 text-[14px] font-semibold text-[#111827] tabular-nums">
                                            {formatCurrency(client.totalRevenue)}
                                        </td>
                                        <td className="py-3 text-[13px] text-[#6B7280]">{client.projectCount}</td>
                                        <td className="py-3 text-[13px] text-[#6B7280]">
                                            {format(new Date(client.lastPaymentDate), 'MMM d, yyyy')}
                                        </td>
                                        <td className="py-3">
                                            <span
                                                className={`inline-flex px-2 py-0.5 rounded text-[11px] font-medium border ${client.status === 'Active'
                                                    ? 'bg-[#F0FDF4] text-[#16A34A] border-[#BBF7D0]'
                                                    : 'bg-[#F3F4F6] text-[#6B7280] border-[#E5E7EB]'
                                                    }`}
                                            >
                                                {client.status}
                                            </span>
                                        </td>
                                        <td className="py-3 w-28">
                                            <div className="flex items-center justify-end gap-1 pr-2">
                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity mr-2">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); setModalEntry(client); }}
                                                        className="p-1.5 text-[#9CA3AF] hover:text-[#2563EB] hover:bg-[#EFF6FF] rounded transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Pencil size={13} />
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); deleteClient(client.id); }}
                                                        className="p-1.5 text-[#9CA3AF] hover:text-[#DC2626] hover:bg-[#FEF2F2] rounded transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={13} />
                                                    </button>
                                                </div>
                                                <ChevronRight
                                                    size={14}
                                                    className="text-[#D1D5DB] group-hover:text-[#6B7280] transition-colors"
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {sorted.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="py-12 text-center text-[13px] text-[#9CA3AF]"
                                        >
                                            No clients yet. Add your first client.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </Section>
        </div>
    );
}
