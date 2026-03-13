import { PageHeader, Section } from '@/components/ui/index';
import { Settings as SettingsIcon } from 'lucide-react';

export default function Settings() {
    return (
        <div className="p-8">
            <PageHeader title="Settings" description="Application preferences and configuration" />
            <Section title="Business Profile">
                <div className="grid grid-cols-2 gap-5 max-w-xl">
                    <div>
                        <label className="text-[13px] font-medium text-[#374151] mb-1.5 block">Business Name</label>
                        <input defaultValue="Fivision WebWorks" className="w-full px-3 py-2 text-[14px] border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#111827]/10 focus:border-[#111827]" />
                    </div>
                    <div>
                        <label className="text-[13px] font-medium text-[#374151] mb-1.5 block">Currency</label>
                        <input defaultValue="PHP (₱)" disabled className="w-full px-3 py-2 text-[14px] border border-[#E5E7EB] rounded-md bg-[#F9FAFB] text-[#6B7280]" />
                    </div>
                    <div>
                        <label className="text-[13px] font-medium text-[#374151] mb-1.5 block">Owner Name</label>
                        <input defaultValue="Angel V." className="w-full px-3 py-2 text-[14px] border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#111827]/10 focus:border-[#111827]" />
                    </div>
                    <div>
                        <label className="text-[13px] font-medium text-[#374151] mb-1.5 block">Fiscal Year Start</label>
                        <input defaultValue="January 2026" className="w-full px-3 py-2 text-[14px] border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#111827]/10 focus:border-[#111827]" />
                    </div>
                </div>
                <div className="mt-5 pt-5 border-t border-[#E5E7EB]">
                    <p className="text-[13px] text-[#9CA3AF] flex items-center gap-1.5"><SettingsIcon size={13} /> Data is stored locally. Connect to Supabase or Firebase to enable cloud sync.</p>
                </div>
            </Section>
        </div>
    );
}
