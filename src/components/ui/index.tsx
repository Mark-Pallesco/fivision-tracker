import { cn } from '@/utils/cn';
import type { ReactNode } from 'react';

interface PageHeaderProps {
    title: string;
    description?: string;
    action?: ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
    return (
        <div className="flex items-start justify-between mb-6">
            <div>
                <h1 className="text-[24px] font-semibold text-[#111827] tracking-tight">{title}</h1>
                {description && (
                    <p className="text-[14px] text-[#6B7280] mt-1">{description}</p>
                )}
            </div>
            {action && <div>{action}</div>}
        </div>
    );
}

interface SectionProps {
    title?: string;
    description?: string;
    action?: ReactNode;
    children: ReactNode;
    className?: string;
}

export function Section({ title, description, action, children, className }: SectionProps) {
    return (
        <div className={cn('bg-white border border-[#E5E7EB] rounded-lg shadow-[0_1px_3px_0_rgb(0_0_0/0.06)]', className)}>
            {(title || action) && (
                <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E7EB]">
                    <div>
                        <h2 className="text-[15px] font-semibold text-[#111827]">{title}</h2>
                        {description && <p className="text-[13px] text-[#6B7280] mt-0.5">{description}</p>}
                    </div>
                    {action && <div>{action}</div>}
                </div>
            )}
            <div className="p-5">{children}</div>
        </div>
    );
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md';
    children: ReactNode;
}

export function Button({ variant = 'primary', size = 'md', children, className, ...props }: ButtonProps) {
    const variantStyles = {
        primary: 'bg-[#111827] text-white hover:bg-[#1F2937] border-transparent',
        secondary: 'bg-white text-[#374151] border-[#E5E7EB] hover:bg-[#F9FAFB]',
        ghost: 'bg-transparent text-[#6B7280] border-transparent hover:bg-[#F3F4F6] hover:text-[#111827]',
        danger: 'bg-white text-[#DC2626] border-[#FCA5A5] hover:bg-[#FEF2F2]',
    };
    const sizeStyles = {
        sm: 'px-3 py-1.5 text-[12px]',
        md: 'px-4 py-2 text-[13px]',
    };
    return (
        <button
            className={cn(
                'inline-flex items-center gap-2 font-medium rounded-md border transition-colors duration-100',
                variantStyles[variant],
                sizeStyles[size],
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export function Input({ label, error, className, ...props }: InputProps) {
    return (
        <div className="flex flex-col gap-1">
            {label && <label className="text-[13px] font-medium text-[#374151]">{label}</label>}
            <input
                className={cn(
                    'w-full px-3 py-2 text-[14px] text-[#111827] bg-white border border-[#E5E7EB] rounded-md',
                    'placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#111827]/10 focus:border-[#111827]',
                    'transition-colors duration-100',
                    error && 'border-[#DC2626] focus:ring-[#DC2626]/10 focus:border-[#DC2626]',
                    className
                )}
                {...props}
            />
            {error && <p className="text-[12px] text-[#DC2626]">{error}</p>}
        </div>
    );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: { value: string; label: string }[];
}

export function Select({ label, error, options, className, ...props }: SelectProps) {
    return (
        <div className="flex flex-col gap-1">
            {label && <label className="text-[13px] font-medium text-[#374151]">{label}</label>}
            <select
                className={cn(
                    'w-full px-3 py-2 text-[14px] text-[#111827] bg-white border border-[#E5E7EB] rounded-md',
                    'focus:outline-none focus:ring-2 focus:ring-[#111827]/10 focus:border-[#111827]',
                    'transition-colors duration-100',
                    error && 'border-[#DC2626]',
                    className
                )}
                {...props}
            >
                {options.map((o) => (
                    <option key={o.value} value={o.value}>
                        {o.label}
                    </option>
                ))}
            </select>
            {error && <p className="text-[12px] text-[#DC2626]">{error}</p>}
        </div>
    );
}

interface EmptyStateProps {
    title: string;
    description: string;
    action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-10 h-10 rounded-full bg-[#F3F4F6] flex items-center justify-center mb-3">
                <span className="text-[#9CA3AF] text-lg">—</span>
            </div>
            <p className="text-[14px] font-medium text-[#111827] mb-1">{title}</p>
            <p className="text-[13px] text-[#6B7280] mb-4">{description}</p>
            {action}
        </div>
    );
}
