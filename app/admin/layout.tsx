
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard - Affiliate Empire',
  description: 'Administrative dashboard for managing your affiliate marketing empire',
  robots: 'noindex, nofollow', // Prevent search engines from indexing admin pages
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-layout">
      {children}
    </div>
  );
}
