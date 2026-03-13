import { cn } from '@/utils/cn';

type BadgeVariant = 'paid' | 'pending' | 'overdue' | 'partial' | 'active' | 'completed' | 'on-hold' | 'cancelled' | 'inactive';

interface BadgeProps {
    status: string;
    className?: string;
}

const variantMap: Record<string, BadgeVariant> = {
    Paid: 'paid',
    Pending: 'pending',
    Overdue: 'overdue',
    Partial: 'partial',
    Active: 'active',
    Completed: 'completed',
    'On Hold': 'on-hold',
    Cancelled: 'cancelled',
    Inactive: 'inactive',
};

const variantStyles: Record<BadgeVariant, string> = {
    paid: 'bg-[#F0FDF4] text-[#16A34A] border-[#BBF7D0]',
    pending: 'bg-[#FFFBEB] text-[#D97706] border-[#FDE68A]',
    overdue: 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]',
    partial: 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]',
    active: 'bg-[#F0FDF4] text-[#16A34A] border-[#BBF7D0]',
    completed: 'bg-[#F3F4F6] text-[#374151] border-[#E5E7EB]',
    'on-hold': 'bg-[#FFFBEB] text-[#D97706] border-[#FDE68A]',
    cancelled: 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]',
    inactive: 'bg-[#F3F4F6] text-[#6B7280] border-[#E5E7EB]',
};

export function Badge({ status, className }: BadgeProps) {
    const variant = variantMap[status] ?? 'inactive';
    return (
        <span
            className={cn(
                'inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border',
                variantStyles[variant],
                className
            )}
        >
            {status}
        </span>
    );
}
