'use client'
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import LandingContent from './components/LandingContent';

const HomePage = () => {
  return (
    <PageContainer title="Visually.Me" description="Plan Smarter. Live Better. Visually Me.">
      <LandingContent/>
    </PageContainer>
  );
}

export default HomePage;
