import * as React from 'react';
import { NextAppProvider } from '@toolpad/core/nextjs';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PaidIcon from '@mui/icons-material/Paid';
import CalculateIcon from '@mui/icons-material/Calculate';
import StorageIcon from '@mui/icons-material/Storage';
import SchoolIcon from '@mui/icons-material/School';
import RealEstateAgentIcon from '@mui/icons-material/RealEstateAgent';
import LinearProgress from '@mui/material/LinearProgress'
import Image from 'next/image'
import {type Navigation, type Session } from '@toolpad/core/AppProvider';
import { SessionProvider, signIn, signOut } from 'next-auth/react';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import { auth } from '../auth';

import theme from '../theme';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL!;
export const metadata = {
  title: process.env.REACT_APP_SITE_TITLE,
  description: 'Take control of your financial future with our all-in-one planning platform. Whether you are preparing for retirement, estimating Social Security income, mapping out college savings, or managing housing and living expenses — our interactive calculators and intuitive charts make it easy to visualize your goals and stay on track.',
  openGraph: {
    siteName: process.env.REACT_APP_SITE_TITLE,
    type: "website",
    locale: "en_US",
    images: [`${baseUrl}/images/logo512.png`],
  },
};

const NAVIGATION: Navigation = [
  {
    kind: 'header',
    title: 'Menu',
  },
  {
    segment: '',
    title: 'Home',
    icon: <HomeIcon />,
  },
  /*{
    segment: 'employees',
    title: 'Employees',
    icon: <PersonIcon />,
    pattern: 'employees{/:employeeId}*',
  },*/

  {
      segment: 'calculators',
      title: 'Calculators',
      icon: <CalculateIcon />,
      children: [
        {
          kind: 'header',
          title: 'Expenses',
        },
        {
          segment: 'college-tuition',
          title: 'College Tuition',
          icon: <SchoolIcon />,
        },
        {
          segment: 'mortgage',
          title: 'Mortgage Amortization',
          icon: <RealEstateAgentIcon />,
        },

        {
          kind: 'header',
          title: 'Incomes',
        },
        {
          segment: 'fers-pension',
          title: 'FERS Pension',
          icon: <PersonIcon />,
        },
        {
          segment: 'retirement-savings',
          title: 'Retirement Savings',
          icon: <PaidIcon />,
        },
        {
          segment: 'social-security',
          title: 'Social Security Benefits',
          icon: <AccountBalanceIcon />,
        },
      ],
    },
    /*{
      segment: 'database',
      title: 'Database',
      icon: <StorageIcon />,
    },*/

];

const BRANDING = {
  title: process.env.REACT_APP_SITE_TITLE,
  logo: <Image src="/images/logo.png" alt="Visually.Me" width="40" height="48"/>,

};

const AUTHENTICATION = {
  signIn,
  signOut,
};

export default async function RootLayout(props: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <html lang="en" data-toolpad-color-scheme="light" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" href="/images/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/images/favicon.svg" />
        <link rel="shortcut icon" href="/images/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/images/apple-touch-icon.png" />
        <link rel="manifest" href="/images/site.webmanifest" />
      </head>
      <body>
        <GoogleAnalytics />
        <SessionProvider session={session}>

          <AppRouterCacheProvider options={{ enableCssLayer: true }}>
            <React.Suspense fallback={<LinearProgress />}>
              <NextAppProvider
                navigation={NAVIGATION}
                branding={BRANDING}
                //authentication={AUTHENTICATION}
                session={session}
                theme={theme}
              >
                {props.children}
              </NextAppProvider>
            </React.Suspense>
          </AppRouterCacheProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
