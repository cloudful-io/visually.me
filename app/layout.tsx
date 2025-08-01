import * as React from 'react';
import { NextAppProvider } from '@toolpad/core/nextjs';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import ElderlyIcon from '@mui/icons-material/Elderly';
import PaidIcon from '@mui/icons-material/Paid';
import LinearProgress from '@mui/material/LinearProgress'
import type { Navigation } from '@toolpad/core/AppProvider';
import { SessionProvider, signIn, signOut } from 'next-auth/react';
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
  },
  {
    segment: 'pension',
    title: 'Pension',
    icon: <ElderlyIcon />
  },*/

  {
      segment: 'retirement-incomes',
      title: 'Retirement Incomes',
      icon: <PaidIcon />,
      children: [
        {
          segment: 'retirement-savings',
          title: 'Retirement Savings',
          icon: <PaidIcon />,
        },
        {
          segment: 'social-security',
          title: 'Social Security Benefits',
          icon: <PaidIcon />,
        },
      ],
    },

];

const BRANDING = {
  title: process.env.REACT_APP_SITE_TITLE,
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
        <SessionProvider session={session}>

          <AppRouterCacheProvider options={{ enableCssLayer: true }}>
            <React.Suspense fallback={<LinearProgress />}>
              <NextAppProvider
                navigation={NAVIGATION}
                branding={BRANDING}
                authentication={AUTHENTICATION}
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
