import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import { getAllPosts, BlogList } from "cloudful-blog"
import path from "path";

export default function BlogPage() {
  const posts = getAllPosts(path.join(process.cwd(), "/public/blog"), true).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
  
  return (
    <PageContainer title="Blog" description="Visually Me: Blog" showTitle>
      <BlogList posts={posts} blogRootUrl='/blog' title='Blog' showFullContent/>
    </PageContainer>
  );
}