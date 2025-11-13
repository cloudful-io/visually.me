import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import PrivacyPolicy from '@/app/components/PrivacyPolicy';

export default function PrivacyPolicyPage() {
  return (
    <PageContainer title="Privacy Policy" description="Visually.Me: Privacy Policy" showTitle>
      <PrivacyPolicy/>
    </PageContainer>
  );
}