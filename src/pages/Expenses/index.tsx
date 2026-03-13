import { useEffect, useState, useMemo } from 'react';
import { format } from 'date-fns';
import { useFinanceStore } from '@/hooks/useFinance';
import { PageHeader, Section, Button, Select } from '@/components/ui/index';
import { formatCurrency } from '@/utils/currency';
import { Plus, Trash2, Pencil } from 'lucide-react';
import { ExpenseFormModal } from './ExpenseFormModal';
import type { ExpenseEntry } from '@/types/finance';

const CATEGORIES = [
    { value: '', label: 'All Categories' },
    { value: 'Software', label: 'Software' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Advertising', label: 'Advertising' },
    { value: 'Payroll', label: 'Payroll' },
    { value: 'Hosting', label: 'Hosting' },
    { value: 'Tools', label: 'Tools' },
    { value: 'Operations', label: 'Operations' },
];

const CATEGORY_TAG: Record<string, string> = {
    Software: 'bg-[#EFF6FF] text-[#2563EB]',
    Marketing: 'bg-[#FDF4FF] text-[#9333EA]',
    Advertising: 'bg-[#FFF7ED] text-[#EA580C]',
    Payroll: 'bg-[#F0FDF4] text-[#16A34A]',
    Hosting: 'bg-[#ECFDF5] text-[#059669]',
    Tools: 'bg-[#F5F3FF] text-[#7C3AED]',
    Operations: 'bg-[#F9FAFB] text-[#374151]',
};

export default function Expenses() {
    const { expenses, loadAll, deleteExpense, loading } = useFinanceStore();
    const [categoryFilter, setCategoryFilter] = useState('');
    // null = modal closed, undefined = Add new, EntryExpense = Edit existing
    const [modalEntry, setModalEntry] = useState<ExpenseEntry | null | undefined>(null);
    const [sortKey, setSortKey] = useState<keyof ExpenseEntry>('date');
    const [sortAsc, setSortAsc] = useState(false);

    useEffect(() => {
        loadAll();
    }, [loadAll]);

    const filtered = useMemo(() => {
        return expenses
            .filter((e) => !categoryFilter || e.category === categoryFilter)
            .sort((a, b) => {
                const av = a[sortKey] ?? '';
                const bv = b[sortKey] ?? '';
                const cmp =
                    typeof av === 'number' && typeof bv === 'number'
                        ? av - bv
                        : String(av).localeCompare(String(bv));
                return sortAsc ? cmp : -cmp;
            });
    }, [expenses, categoryFilter, sortKey, sortAsc]);

    const total = filtered.reduce((s, e) => s + e.amount, 0);

    const handleSort = (key: keyof ExpenseEntry) => {
        if (sortKey === key) setSortAsc((p) => !p);
        else { setSortKey(key); setSortAsc(false); }
    };

    const SortIcon = ({ col }: { col: keyof ExpenseEntry }) => (
        <span className="ml-1 text-[10px] text-[#9CA3AF]">
            {sortKey === col ? (sortAsc ? '↑' : '↓') : '↕'}
        </span>
    );

    return (
        <div className="p-8">
            {/* Modal — shared for Add & Edit */}
            {modalEntry !== null && (
                <ExpenseFormModal
                    entry={modalEntry ?? undefined}
                    onClose={() => setModalEntry(null)}
                />
            )}

            <PageHeader
                title="Expenses"
                description="Track all business expenditures"
                action={
                    <Button onClick={() => setModalEntry(undefined)}>
                        <Plus size={14} /> Add Expense
                    </Button>
                }
            />

            {/* Summary Strip */}
            <div className="flex items-center gap-8 bg-white border border-[#E5E7EB] rounded-lg px-5 py-4 mb-6 shadow-[0_1px_3px_0_rgb(0_0_0/0.06)]">
                <div>
                    <p className="text-[12px] text-[#6B7280] mb-0.5">Total Expenses</p>
                    <p className="text-[20px] font-semibold text-[#DC2626]">{formatCurrency(total)}</p>
                </div>
                <div className="h-8 w-px bg-[#E5E7EB]" />
                <div>
                    <p className="text-[12px] text-[#6B7280] mb-0.5">Entries</p>
                    <p className="text-[20px] font-semibold text-[#111827]">{filtered.length}</p>
                </div>
            </div>

            {/* Filter */}
            <div className="flex items-center gap-3 mb-5">
                <Select
                    options={CATEGORIES}
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-48 text-[13px]"
                />
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
                                        { key: 'date', label: 'Date' },
                                        { key: 'category', label: 'Category' },
                                        { key: 'description', label: 'Description' },
                                        { key: 'amount', label: 'Amount' },
                                    ].map(({ key, label }) => (
                                        <th
                                            key={key}
                                            onClick={() => handleSort(key as keyof ExpenseEntry)}
                                            className="pb-3 text-left text-[12px] font-medium text-[#6B7280] uppercase tracking-wide cursor-pointer select-none hover:text-[#374151] transition-colors"
                                        >
                                            {label}
                                            <SortIcon col={key as keyof ExpenseEntry} />
                                        </th>
                                    ))}
                                    {/* Actions column */}
                                    <th className="pb-3 w-16" />
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
                                        <td className="py-3">
                                            <span
                                                className={`inline-flex px-2 py-0.5 rounded text-[11px] font-medium ${CATEGORY_TAG[row.category] ?? 'bg-[#F3F4F6] text-[#6B7280]'
                                                    }`}
                                            >
                                                {row.category}
                                            </span>
                                        </td>
                                        <td className="py-3 text-[14px] text-[#111827]">{row.description}</td>
                                        <td className="py-3 text-[14px] font-semibold text-[#DC2626] tabular-nums">
                                            {formatCurrency(row.amount)}
                                        </td>
                                        <td className="py-3">
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {/* Edit */}
                                                <button
                                                    onClick={() => setModalEntry(row)}
                                                    className="p-1.5 text-[#9CA3AF] hover:text-[#2563EB] hover:bg-[#EFF6FF] rounded transition-colors"
                                                    title="Edit"
                                                >
                                                    <Pencil size={13} />
                                                </button>
                                                {/* Delete */}
                                                <button
                                                    onClick={() => deleteExpense(row.id)}
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
                                        <td colSpan={5} className="text-center py-12 text-[13px] text-[#9CA3AF]">
                                            No expenses yet. Click <strong>Add Expense</strong> to get started.
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
