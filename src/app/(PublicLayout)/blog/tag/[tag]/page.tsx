import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import { getPostsByTag, BlogTagList } from "cloudful-blog"
import path from "path";

export default async function BlogTagPage(props: { params: Promise<{ tag: string }> }) {
    const { tag } = await props.params;
    const posts = getPostsByTag(path.join(process.cwd(), "/public/blog"), tag, true).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
  
  return (
    <PageContainer title="Blog" description={`Visually Me: Blog - ${tag}`} showTitle>
      <BlogTagList posts={posts} blogRootUrl='/blog' title='Blog' tag={tag}/>
    </PageContainer>
  );
}