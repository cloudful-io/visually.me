'use client'
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import AboutUsContent from "@/app/(PublicLayout)/components/AboutUsContent"

const AboutPage = () => {
  return (
    <PageContainer title="About Us" description="Plan Smarter. Live Better. Visually Me.">
      <AboutUsContent/>
    </PageContainer>
  );
}

export default AboutPage;
