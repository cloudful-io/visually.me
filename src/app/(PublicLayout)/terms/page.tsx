import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import TermsOfUse from '@/app/components/TermsOfUse';

export default function TermsOfUsePage() {
  return (
    <PageContainer title="Terms of Use" description="Visually.Me: Terms of Use" showTitle>
      <TermsOfUse/>
    </PageContainer>
  );
}