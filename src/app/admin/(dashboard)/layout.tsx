import { redirect } from 'next/navigation';
import AdminNav from '@/components/Admin/AdminNav';
import ToastContainer from '@/components/Admin/ToastContainer';
import { requireAdmin } from '@/lib/admin/auth';

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
    const { error } = await requireAdmin();

    if (error) {
        redirect('/admin/login?redirect=/admin/products');
    }

    return (
        <div className="min-h-screen bg-[#FFF9F5]">
            <AdminNav />
            <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
            <ToastContainer />
        </div>
    );
}
