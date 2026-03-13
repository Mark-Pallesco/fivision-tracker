import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFinanceStore } from '@/hooks/useFinance';
import { Button, Input, Select } from '@/components/ui/index';
import { X } from 'lucide-react';
import type { ExpenseEntry } from '@/types/finance';

const schema = z.object({
    date: z.string().min(1, 'Date required'),
    category: z.enum(['Software', 'Marketing', 'Advertising', 'Payroll', 'Hosting', 'Tools', 'Operations']),
    description: z.string().min(1, 'Description required'),
    amount: z.coerce.number().min(0, 'Amount required'),
});

type FormValues = z.infer<typeof schema>;

const CATEGORIES = [
    { value: 'Software', label: 'Software' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Advertising', label: 'Advertising' },
    { value: 'Payroll', label: 'Payroll' },
    { value: 'Hosting', label: 'Hosting' },
    { value: 'Tools', label: 'Tools' },
    { value: 'Operations', label: 'Operations' },
];

interface Props {
    /** Pass an existing entry to edit it; omit to create a new one */
    entry?: ExpenseEntry;
    onClose: () => void;
}

export function ExpenseFormModal({ entry, onClose }: Props) {
    const { addExpense, updateExpense } = useFinanceStore();
    const [submitting, setSubmitting] = useState(false);

    const isEditing = !!entry;

    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(schema) as any,
        defaultValues: entry
            ? {
                date: entry.date,
                category: entry.category,
                description: entry.description,
                amount: entry.amount,
            }
            : {
                date: new Date().toISOString().split('T')[0],
                category: 'Software' as const,
            },
    });

    const onSubmit = async (data: FormValues) => {
        setSubmitting(true);
        if (isEditing && entry) {
            await updateExpense(entry.id, data);
        } else {
            await addExpense(data);
        }
        setSubmitting(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/25 backdrop-blur-[2px]" onClick={onClose} />
            <div className="relative bg-white rounded-xl border border-[#E5E7EB] shadow-[0_8px_32px_0_rgb(0_0_0/0.12)] w-full max-w-md mx-4">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB]">
                    <h2 className="text-[15px] font-semibold text-[#111827]">
                        {isEditing ? 'Edit Expense' : 'Add Expense'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 text-[#9CA3AF] hover:text-[#374151] hover:bg-[#F3F4F6] rounded transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-5 space-y-4">
                    <Input
                        label="Date"
                        type="date"
                        {...register('date')}
                        error={errors.date?.message}
                    />
                    <Select
                        label="Category"
                        {...register('category')}
                        options={CATEGORIES}
                    />
                    <Input
                        label="Description"
                        placeholder="e.g. Figma subscription"
                        {...register('description')}
                        error={errors.description?.message}
                    />
                    <Input
                        label="Amount (₱)"
                        type="number"
                        placeholder="0"
                        {...register('amount')}
                        error={errors.amount?.message}
                    />
                    <div className="flex items-center justify-end gap-3 pt-2">
                        <Button variant="secondary" type="button" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={submitting}>
                            {submitting ? 'Saving…' : isEditing ? 'Save Changes' : 'Add Expense'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
