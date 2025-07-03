
import { getBlogPosts } from '@/lib/actions';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Newspaper } from 'lucide-react';

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="container py-16 md:py-24">
      <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">Our Blog & Knowledge Base</h1>
        <p className="max-w-[900px] text-muted-foreground md:text-xl">
          Insights on technology, case studies, and thought leadership from the CodezCube team.
        </p>
      </div>
      
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map(post => (
            <Card key={post.id} className="flex flex-col overflow-hidden group">
              <Link href={`/blog/${post.slug}`} className="block">
                <div className="relative overflow-hidden aspect-video">
                  <Image
                    src={post.imageUrl || 'https://placehold.co/600x400.png'}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                    data-ai-hint="blog post"
                  />
                </div>
              </Link>
              <CardHeader>
                <CardDescription>{post.date} &middot; {post.category}</CardDescription>
                <CardTitle className="text-xl leading-tight hover:text-primary">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground line-clamp-3">{post.excerpt}</p>
              </CardContent>
              <CardContent>
                <Link href={`/blog/${post.slug}`} className="text-sm font-semibold text-primary hover:underline">
                  Read More &rarr;
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center py-20">
          <div className="bg-primary/10 text-primary p-4 rounded-full mb-6">
              <Newspaper className="h-12 w-12" />
          </div>
          <h2 className="text-3xl font-bold mb-4">
              Blog Coming Soon!
          </h2>
          <p className="max-w-2xl text-muted-foreground">
              We're busy writing insightful articles. Check back soon to read our thoughts on technology, innovation, and career development.
          </p>
        </div>
      )}
    </div>
  );
}
