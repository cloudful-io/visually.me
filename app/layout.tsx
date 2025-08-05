import * as React from 'react';
import { NextAppProvider } from '@toolpad/core/nextjs';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PaidIcon from '@mui/icons-material/Paid';
import CalculateIcon from '@mui/icons-material/Calculate';
import LinearProgress from '@mui/material/LinearProgress'
import {type Navigation, type Session } from '@toolpad/core/AppProvider';
import { SessionProvider, signIn, signOut } from 'next-auth/react';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import { auth } from '../auth';

import theme from '../theme';

export const metadata = {
  title: process.env.REACT_APP_SITE_TITLE,
  description: 'This is a sample app built with Toolpad Core and Next.js',
};

const NAVIGATION: Navigation = [
  {
    kind: 'header',
    title: 'Navigation',
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

];

const BRANDING = {
  title: process.env.REACT_APP_SITE_TITLE,
  logo: <img src="/images/logo.png" alt="Visually.Me" />,

};

const AUTHENTICATION = {
  signIn,
  signOut,
};

export default async function RootLayout(props: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <html lang="en" data-toolpad-color-scheme="light" suppressHydrationWarning>
      <body>
        <GoogleAnalytics />
        <SessionProvider session={session}>

          <AppRouterCacheProvider options={{ enableCssLayer: true }}>
            <React.Suspense fallback={<LinearProgress />}>
              <NextAppProvider
                navigation={NAVIGATION}
                branding={BRANDING}
                authentication={AUTHENTICATION}
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
