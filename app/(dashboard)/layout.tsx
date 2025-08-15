import * as React from 'react';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import Footer from '@/components/Footer';
import FeedbackButton from '@/components/FeedbackButton';
import Script from 'next/script';
import type { AppProps } from 'next/app';

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <>
      <Script
        src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
        strategy="afterInteractive"
      />
      <DashboardLayout defaultSidebarCollapsed>
        <div className="flex flex-col min-h-screen">
          <main className="flex-grow">{props.children}</main>
        </div>
        <Footer />
      </DashboardLayout>
      <FeedbackButton />
    </>
  );
}  