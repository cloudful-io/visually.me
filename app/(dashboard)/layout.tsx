import * as React from 'react';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import Footer from '@/components/Footer';

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <DashboardLayout defaultSidebarCollapsed>
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">{props.children}</main>
      </div>
      <Footer />
    </DashboardLayout>
  );
}  