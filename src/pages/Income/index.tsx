import { useEffect, useState, useMemo } from 'react';
import { format } from 'date-fns';
import { useFinanceStore } from '@/hooks/useFinance';
import { Badge } from '@/components/ui/Badge';
import { PageHeader, Section, Button, Select } from '@/components/ui/index';
import { formatCurrency } from '@/utils/currency';
import { Search, Plus, Trash2, Pencil } from 'lucide-react';
import { AddIncomeModal } from './AddIncomeModal';
import type { IncomeEntry } from '@/types/finance';

const STATUS_OPTIONS = [
    { value: '', label: 'All Statuses' },
    { value: 'Paid', label: 'Paid' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Overdue', label: 'Overdue' },
    { value: 'Partial', label: 'Partial' },
];

export default function Income() {
    const { income, loadAll, deleteIncome, loading } = useFinanceStore();
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [modalEntry, setModalEntry] = useState<IncomeEntry | null | undefined>(null);
    const [sortKey, setSortKey] = useState<keyof IncomeEntry>('date');
    const [sortAsc, setSortAsc] = useState(false);

    useEffect(() => {
        loadAll();
    }, [loadAll]);

    const filtered = useMemo(() => {
        return income
            .filter((i) => {
                const q = search.toLowerCase();
                return (
                    (!q ||
                        i.client.toLowerCase().includes(q) ||
                        i.project.toLowerCase().includes(q)) &&
                    (!statusFilter || i.status === statusFilter)
                );
            })
            .sort((a, b) => {
                const av = a[sortKey] ?? '';
                const bv = b[sortKey] ?? '';
                const cmp =
                    typeof av === 'number' && typeof bv === 'number'
                        ? av - bv
                        : String(av).localeCompare(String(bv));
                return sortAsc ? cmp : -cmp;
            });
    }, [income, search, statusFilter, sortKey, sortAsc]);

    const totalFiltered = filtered.reduce((s, i) => s + i.amount, 0);

    const handleSort = (key: keyof IncomeEntry) => {
        if (sortKey === key) setSortAsc((p) => !p);
        else { setSortKey(key); setSortAsc(false); }
    };

    const SortIcon = ({ col }: { col: keyof IncomeEntry }) => (
        <span className="ml-1 text-[10px] text-[#9CA3AF]">
            {sortKey === col ? (sortAsc ? '↑' : '↓') : '↕'}
        </span>
    );

    return (
        <div className="p-4 md:p-8">
            {modalEntry !== null && (
                <AddIncomeModal
                    entry={modalEntry ?? undefined}
                    onClose={() => setModalEntry(null)}
                />
            )}

            <PageHeader
                title="Income"
                description="Track all revenue entries"
                action={
                    <Button onClick={() => setModalEntry(undefined)}>
                        <Plus size={14} /> Add Income
                    </Button>
                }
            />

            {/* Summary Strip */}
            <div className="flex items-center gap-8 bg-white border border-[#E5E7EB] rounded-lg px-5 py-4 mb-6 shadow-[0_1px_3px_0_rgb(0_0_0/0.06)]">
                <div>
                    <p className="text-[12px] text-[#6B7280] mb-0.5">Total Revenue</p>
                    <p className="text-[20px] font-semibold text-[#111827]">{formatCurrency(totalFiltered)}</p>
                </div>
                <div className="h-8 w-px bg-[#E5E7EB]" />
                <div>
                    <p className="text-[12px] text-[#6B7280] mb-0.5">Transactions</p>
                    <p className="text-[20px] font-semibold text-[#111827]">{filtered.length}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3 mb-5">
                <div className="relative flex-1 max-w-xs">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                    <input
                        type="text"
                        placeholder="Search client or project…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 text-[13px] border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#111827]/10 focus:border-[#111827] bg-white"
                    />
                </div>
                <Select
                    options={STATUS_OPTIONS}
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-40 text-[13px]"
                />
            </div>

            {/* Table */}
            <Section>
                {loading ? (
                    <p className="text-[13px] text-[#6B7280] py-8 text-center">Loading…</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[#E5E7EB]">
                                    {[
                                        { key: 'date', label: 'Date' },
                                        { key: 'client', label: 'Client' },
                                        { key: 'project', label: 'Ref/Description' },
                                        { key: 'amount', label: 'Amount' },
                                        { key: 'status', label: 'Status' },
                                    ].map(({ key, label }) => (
                                        <th
                                            key={key}
                                            onClick={() => handleSort(key as keyof IncomeEntry)}
                                            className="pb-3 text-left text-[12px] font-medium text-[#6B7280] uppercase tracking-wide cursor-pointer select-none hover:text-[#374151] transition-colors"
                                        >
                                            {label}
                                            <SortIcon col={key as keyof IncomeEntry} />
                                        </th>
                                    ))}
                                    <th className="pb-3 w-10" />
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((row) => (
                                    <tr
                                        key={row.id}
                                        className="border-b border-[#F3F4F6] hover:bg-[#FAFAFA] transition-colors duration-75 group"
                                    >
                                        <td className="py-3 text-[13px] text-[#6B7280]">
                                            {format(new Date(row.date), 'MMM d, yyyy')}
                                        </td>
                                        <td className="py-3 text-[14px] font-medium text-[#111827]">{row.client}</td>
                                        <td className="py-3">
                                            <p className="text-[14px] font-medium text-[#111827]">{row.project}</p>
                                            {row.description && (
                                                <p className="text-[12px] text-[#6B7280] mt-0.5">{row.description}</p>
                                            )}
                                        </td>
                                        <td className="py-3 text-[14px] font-semibold text-[#111827] text-right tabular-nums pr-4">
                                            {formatCurrency(row.amount)}
                                        </td>
                                        <td className="py-3">
                                            <Badge status={row.status} />
                                        </td>
                                        <td className="py-3">
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => setModalEntry(row)}
                                                    className="p-1.5 text-[#9CA3AF] hover:text-[#2563EB] hover:bg-[#EFF6FF] rounded transition-colors"
                                                    title="Edit"
                                                >
                                                    <Pencil size={13} />
                                                </button>
                                                <button
                                                    onClick={() => deleteIncome(row.id)}
                                                    className="p-1.5 text-[#9CA3AF] hover:text-[#DC2626] hover:bg-[#FEF2F2] rounded transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={13} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filtered.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="text-center py-12 text-[13px] text-[#9CA3AF]">
                                            No income records found.
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
