"use client";

import { ThemeModeProvider } from "@/contexts/ThemeModeContext";
import { CacheProvider } from "@emotion/react";
import GoogleAnalytics from "@/app/(DashboardLayout)/components/shared/GoogleAnalytics"
import createEmotionCache from "@/utils/createEmotionCache";

const clientSideEmotionCache = createEmotionCache();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CacheProvider value={clientSideEmotionCache}>
        <ThemeModeProvider>
          <GoogleAnalytics />
          {children}
        </ThemeModeProvider>
      </CacheProvider>
    </>
  );
}