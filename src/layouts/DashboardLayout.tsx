import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    TrendingUp,
    Receipt,
    Users,
    FolderKanban,
    BarChart2,
    Settings,
    LogOut,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useAuth } from '@/hooks/useAuth';

const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/income', icon: TrendingUp, label: 'Income' },
    { to: '/expenses', icon: Receipt, label: 'Expenses' },
    { to: '/clients', icon: Users, label: 'Clients' },
    { to: '/projects', icon: FolderKanban, label: 'Projects' },
    { to: '/reports', icon: BarChart2, label: 'Reports' },
];

export default function DashboardLayout() {
    const location = useLocation();
    const { user, signOut } = useAuth();

    return (
        <div className="flex h-screen bg-[#F7F8FA] font-sans overflow-hidden">
            {/* Sidebar */}
            <aside className="w-60 flex-shrink-0 bg-white border-r border-[#E5E7EB] flex flex-col">
                {/* Logo */}
                <div className="h-16 flex items-center px-6 border-b border-[#E5E7EB]">
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-md bg-[#111827] flex items-center justify-center">
                            <span className="text-white text-xs font-bold">Fi</span>
                        </div>
                        <span className="text-[#111827] font-semibold text-[15px] tracking-tight">
                            FiVision
                        </span>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-4 space-y-0.5">
                    {navItems.map(({ to, icon: Icon, label }) => {
                        const isActive =
                            to === '/'
                                ? location.pathname === '/'
                                : location.pathname.startsWith(to);
                        return (
                            <NavLink
                                key={to}
                                to={to}
                                className={cn(
                                    'flex items-center gap-3 px-3 py-2 rounded-md text-[14px] font-medium transition-all duration-100 group relative',
                                    isActive
                                        ? 'bg-[#F3F4F6] text-[#111827]'
                                        : 'text-[#6B7280] hover:bg-[#F9FAFB] hover:text-[#111827]'
                                )}
                            >
                                {isActive && (
                                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#111827] rounded-r" />
                                )}
                                <Icon
                                    size={16}
                                    className={cn(
                                        'flex-shrink-0 transition-colors',
                                        isActive ? 'text-[#111827]' : 'text-[#9CA3AF] group-hover:text-[#6B7280]'
                                    )}
                                />
                                {label}
                            </NavLink>
                        );
                    })}
                </nav>

                {/* Settings at bottom */}
                <div className="px-3 py-4 border-t border-[#E5E7EB]">
                    <NavLink
                        to="/settings"
                        className={cn(
                            'flex items-center gap-3 px-3 py-2 rounded-md text-[14px] font-medium transition-all duration-100 group',
                            location.pathname === '/settings'
                                ? 'bg-[#F3F4F6] text-[#111827]'
                                : 'text-[#6B7280] hover:bg-[#F9FAFB] hover:text-[#111827]'
                        )}
                    >
                        <Settings size={16} className="text-[#9CA3AF] group-hover:text-[#6B7280]" />
                        Settings
                    </NavLink>
                </div>

                {/* User footer */}
                <div className="px-4 py-3 border-t border-[#E5E7EB] flex items-center justify-between">
                    <div className="flex items-center gap-2.5 truncate pr-2">
                        <div className="w-7 h-7 flex-shrink-0 rounded-full bg-[#E5E7EB] flex items-center justify-center text-[11px] font-semibold text-[#374151] uppercase">
                            {user?.email?.charAt(0) || 'U'}
                        </div>
                        <div className="truncate">
                            <p className="text-[13px] font-medium text-[#111827] truncate">{user?.email || 'User'}</p>
                            <p className="text-[11px] text-[#9CA3AF]">Owner</p>
                        </div>
                    </div>
                    <button
                        onClick={() => signOut()}
                        className="p-1.5 text-[#9CA3AF] hover:text-[#DC2626] hover:bg-[#FEF2F2] rounded transition-colors"
                        title="Sign out"
                    >
                        <LogOut size={15} />
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
}
