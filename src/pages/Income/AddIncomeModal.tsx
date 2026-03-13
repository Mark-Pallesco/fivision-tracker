import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFinanceStore } from '@/hooks/useFinance';
import { Button, Input, Select } from '@/components/ui/index';
import { X, UserPlus, ChevronDown } from 'lucide-react';
import { AddClientModal } from '@/pages/Clients/AddClientModal';
import type { IncomeEntry } from '@/types/finance';

const schema = z.object({
    date: z.string().min(1, 'Date required'),
    client: z.string().min(1, 'Client required'),
    project: z.string().min(1, 'Project required'),
    description: z.string().optional(),
    amount: z.coerce.number().min(1, 'Amount must be positive'),
    paymentMethod: z.enum(['Bank Transfer', 'GCash', 'Cash', 'PayMaya', 'Check']),
    status: z.enum(['Paid', 'Pending', 'Overdue', 'Partial']),
});

type FormValues = z.infer<typeof schema>;

interface Props {
    entry?: IncomeEntry;
    onClose: () => void;
}

export function AddIncomeModal({ entry, onClose }: Props) {
    const { addIncome, updateIncome, clients, loadAll } = useFinanceStore();
    const [submitting, setSubmitting] = useState(false);
    const [showAddClient, setShowAddClient] = useState(false);

    const isEditing = !!entry;

    // Ensure clients are loaded
    useEffect(() => {
        if (clients.length === 0) loadAll();
    }, [clients.length, loadAll]);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(schema) as any,
        defaultValues: entry
            ? {
                date: entry.date,
                client: entry.client,
                project: entry.project,
                description: entry.description ?? '',
                amount: entry.amount,
                status: entry.status,
                paymentMethod: entry.paymentMethod,
            }
            : {
                date: new Date().toISOString().split('T')[0],
                client: '',
                description: '',
                status: 'Paid' as const,
                paymentMethod: 'Bank Transfer' as const,
            },
    });

    const selectedClient = watch('client');

    const onSubmit = async (data: FormValues) => {
        setSubmitting(true);
        const payload = {
            ...data,
            description: data.description || null
        };

        if (isEditing && entry) {
            await updateIncome(entry.id, payload);
        } else {
            await addIncome(payload);
        }
        setSubmitting(false);
        onClose();
    };

    // When a new client is created, auto-select it
    const handleClientCreated = (name: string) => {
        setValue('client', name);
    };

    const clientOptions = [
        { value: '', label: 'Select a client…' },
        ...clients.map((c) => ({ value: c.name, label: c.name })),
    ];

    return (
        <>
            {showAddClient && (
                <AddClientModal
                    onClose={() => setShowAddClient(false)}
                    onCreated={handleClientCreated}
                />
            )}

            <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="absolute inset-0 bg-black/25 backdrop-blur-[2px]" onClick={onClose} />
                <div className="relative bg-white rounded-xl border border-[#E5E7EB] shadow-[0_8px_32px_0_rgb(0_0_0/0.12)] w-full max-w-md mx-4">
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB]">
                        <h2 className="text-[15px] font-semibold text-[#111827]">
                            {isEditing ? 'Edit Income Entry' : 'Add Income Entry'}
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

                        {/* Client field — dropdown + add new */}
                        <div className="flex flex-col gap-1">
                            <label className="text-[13px] font-medium text-[#374151]">Client</label>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <select
                                        value={selectedClient}
                                        onChange={(e) => setValue('client', e.target.value)}
                                        className="w-full px-3 py-2 pr-8 text-[14px] text-[#111827] bg-white border border-[#E5E7EB] rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-[#111827]/10 focus:border-[#111827] transition-colors"
                                    >
                                        {clientOptions.map((o) => (
                                            <option key={o.value} value={o.value}>
                                                {o.label}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown
                                        size={14}
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowAddClient(true)}
                                    title="Add new client"
                                    className="flex items-center gap-1.5 px-3 py-2 text-[13px] font-medium text-[#374151] border border-[#E5E7EB] rounded-md bg-white hover:bg-[#F9FAFB] transition-colors flex-shrink-0"
                                >
                                    <UserPlus size={13} />
                                    New
                                </button>
                            </div>
                            {errors.client && (
                                <p className="text-[12px] text-[#DC2626]">{errors.client.message}</p>
                            )}
                        </div>

                        <Input
                            label="Project"
                            placeholder="e.g. Corporate Website"
                            {...register('project')}
                            error={errors.project?.message}
                        />

                        <Input
                            label="Description (Optional)"
                            placeholder="e.g. 50% Downpayment"
                            {...register('description')}
                            error={errors.description?.message}
                        />

                        <Input
                            label="Amount (₱)"
                            type="number"
                            placeholder="85000"
                            {...register('amount')}
                            error={errors.amount?.message}
                        />

                        <div className="grid grid-cols-2 gap-3">
                            <Select
                                label="Payment Method"
                                {...register('paymentMethod')}
                                options={[
                                    { value: 'Bank Transfer', label: 'Bank Transfer' },
                                    { value: 'GCash', label: 'GCash' },
                                    { value: 'Cash', label: 'Cash' },
                                    { value: 'PayMaya', label: 'PayMaya' },
                                    { value: 'Check', label: 'Check' },
                                ]}
                            />
                            <Select
                                label="Status"
                                {...register('status')}
                                options={[
                                    { value: 'Paid', label: 'Paid' },
                                    { value: 'Pending', label: 'Pending' },
                                    { value: 'Overdue', label: 'Overdue' },
                                    { value: 'Partial', label: 'Partial' },
                                ]}
                            />
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-2">
                            <Button variant="secondary" type="button" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={submitting}>
                                {submitting ? 'Saving…' : isEditing ? 'Save Changes' : 'Save Entry'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
