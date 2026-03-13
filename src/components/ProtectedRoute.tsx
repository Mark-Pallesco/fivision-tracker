import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export function ProtectedRoute() {
    const { session, loading, initialize } = useAuth();

    useEffect(() => {
        initialize();
    }, [initialize]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center">
                <div className="w-8 h-8 border-2 border-[#111827] border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-[14px] text-[#6B7280]">Loading FiVision...</p>
            </div>
        );
    }

    if (!session) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}
