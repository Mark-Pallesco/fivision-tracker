import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFinanceStore } from '@/hooks/useFinance';
import { Button, Input, Select } from '@/components/ui/index';
import { X, UserPlus, Pencil } from 'lucide-react';
import type { Client } from '@/types/finance';

const schema = z.object({
    name: z.string().min(1, 'Company name required'),
    email: z.string().email('Valid email required').or(z.string().length(0)),
    phone: z.string().min(1, 'Phone required'),
    industry: z.string().min(1, 'Industry required'),
    status: z.enum(['Active', 'Inactive']),
});

type FormValues = z.infer<typeof schema>;

const INDUSTRIES = [
    { value: 'Construction', label: 'Construction' },
    { value: 'Real Estate', label: 'Real Estate' },
    { value: 'Technology', label: 'Technology' },
    { value: 'Retail', label: 'Retail' },
    { value: 'Healthcare', label: 'Healthcare' },
    { value: 'Education', label: 'Education' },
    { value: 'Food & Beverage', label: 'Food & Beverage' },
    { value: 'Manufacturing', label: 'Manufacturing' },
    { value: 'Finance', label: 'Finance' },
    { value: 'Other', label: 'Other' },
];

interface Props {
    entry?: Client;
    onClose: () => void;
    /** Called with the newly created client's name so the parent can auto-select it */
    onCreated?: (name: string) => void;
}

export function AddClientModal({ entry, onClose, onCreated }: Props) {
    const { addClient, updateClient } = useFinanceStore();
    const [submitting, setSubmitting] = useState(false);

    const isEditing = !!entry;

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(schema) as any,
        defaultValues: entry
            ? {
                name: entry.name,
                email: entry.email ?? '',
                phone: entry.phone ?? '',
                industry: entry.industry ?? 'Construction',
                status: entry.status,
            }
            : { status: 'Active', industry: 'Construction' },
    });

    const onSubmit = async (data: FormValues) => {
        setSubmitting(true);
        if (isEditing && entry) {
            await updateClient(entry.id, data);
            setSubmitting(false);
            onClose();
        } else {
            const newClient = await addClient(data);
            setSubmitting(false);
            onCreated?.(newClient.name);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" onClick={onClose} />
            <div className="relative bg-white rounded-xl border border-[#E5E7EB] shadow-[0_8px_32px_0_rgb(0_0_0/0.14)] w-full max-w-md mx-4">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB]">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-md bg-[#F3F4F6] flex items-center justify-center">
                            {isEditing ? <Pencil size={14} className="text-[#374151]" /> : <UserPlus size={14} className="text-[#374151]" />}
                        </div>
                        <h2 className="text-[15px] font-semibold text-[#111827]">
                            {isEditing ? 'Edit Client' : 'Add New Client'}
                        </h2>
                    </div>
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
                        label="Company Name"
                        placeholder="e.g. MetroBuild Corp"
                        {...register('name')}
                        error={errors.name?.message}
                    />
                    <div className="grid grid-cols-2 gap-3">
                        <Input
                            label="Email"
                            type="email"
                            placeholder="contact@company.com"
                            {...register('email')}
                            error={errors.email?.message}
                        />
                        <Input
                            label="Phone"
                            placeholder="+63 917 123 4567"
                            {...register('phone')}
                            error={errors.phone?.message}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <Select
                            label="Industry"
                            {...register('industry')}
                            options={INDUSTRIES}
                        />
                        <Select
                            label="Status"
                            {...register('status')}
                            options={[
                                { value: 'Active', label: 'Active' },
                                { value: 'Inactive', label: 'Inactive' },
                            ]}
                        />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2">
                        <Button variant="secondary" type="button" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={submitting}>
                            {submitting ? 'Saving…' : isEditing ? 'Save Changes' : 'Add Client'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
