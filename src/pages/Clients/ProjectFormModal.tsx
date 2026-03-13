import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFinanceStore } from '@/hooks/useFinance';
import { Button, Input, Select } from '@/components/ui/index';
import { X, FolderKanban, Pencil } from 'lucide-react';
import type { Project, Client } from '@/types/finance';

const schema = z.object({
    name: z.string().min(1, 'Project name required'),
    startDate: z.string().or(z.string().length(0).optional()),
    endDate: z.string().or(z.string().length(0).optional()),
    revenue: z.coerce.number().min(0),
    costs: z.coerce.number().min(0),
    status: z.enum(['Active', 'Completed', 'On Hold', 'Cancelled']),
});

type FormValues = z.infer<typeof schema>;

interface Props {
    client: Client;
    entry?: Project;
    onClose: () => void;
}

export function ProjectFormModal({ client, entry, onClose }: Props) {
    const { addProject, updateProject } = useFinanceStore();
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
                startDate: entry.startDate ?? '',
                endDate: entry.endDate ?? '',
                revenue: entry.revenue,
                costs: entry.costs,
                status: entry.status,
            }
            : {
                revenue: 0,
                costs: 0,
                status: 'Active',
                startDate: new Date().toISOString().split('T')[0],
                endDate: ''
            },
    });

    const onSubmit = async (data: FormValues) => {
        setSubmitting(true);
        const payload = {
            ...data,
            startDate: data.startDate || '',
            endDate: data.endDate || null,
            client: client.name,
            clientId: client.id
        };

        if (isEditing && entry) {
            await updateProject(entry.id, payload);
        } else {
            await addProject(payload);
        }
        setSubmitting(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" onClick={onClose} />
            <div className="relative bg-white rounded-xl border border-[#E5E7EB] shadow-[0_8px_32px_0_rgb(0_0_0/0.14)] w-full max-w-md mx-4">
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB]">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-md bg-[#F3F4F6] flex items-center justify-center">
                            {isEditing ? <Pencil size={14} className="text-[#374151]" /> : <FolderKanban size={14} className="text-[#374151]" />}
                        </div>
                        <h2 className="text-[15px] font-semibold text-[#111827]">
                            {isEditing ? 'Edit Project' : 'Add New Project'}
                        </h2>
                    </div>
                    <button onClick={onClose} className="p-1 text-[#9CA3AF] hover:text-[#374151] hover:bg-[#F3F4F6] rounded transition-colors">
                        <X size={16} />
                    </button>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-5 space-y-4">
                    <Input label="Project Name" placeholder="e.g. Website Redesign" {...register('name')} error={errors.name?.message} />
                    <div className="grid grid-cols-2 gap-3">
                        <Input label="Start Date" type="date" {...register('startDate')} error={errors.startDate?.message} />
                        <Input label="End Date" type="date" {...register('endDate')} error={errors.endDate?.message} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <Input label="Revenue (₱)" type="number" {...register('revenue')} error={errors.revenue?.message} />
                        <Input label="Costs (₱)" type="number" {...register('costs')} error={errors.costs?.message} />
                    </div>
                    <Select label="Status" {...register('status')} options={[
                        { value: 'Active', label: 'Active' },
                        { value: 'Completed', label: 'Completed' },
                        { value: 'On Hold', label: 'On Hold' },
                        { value: 'Cancelled', label: 'Cancelled' },
                    ]} />
                    <div className="flex items-center justify-end gap-3 pt-2">
                        <Button variant="secondary" type="button" onClick={onClose}>Cancel</Button>
                        <Button type="submit" disabled={submitting}>
                            {submitting ? 'Saving…' : isEditing ? 'Save Changes' : 'Add Project'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
