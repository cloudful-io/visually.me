'use client'
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import FeatureContent from "@/app/(PublicLayout)/components/FeatureContent"

const FeaturesPage = () => {
  return (
    <PageContainer title="Features" description="Visually.Me: Features">
      <FeatureContent/>
    </PageContainer>
  );
}

export default FeaturesPage;
