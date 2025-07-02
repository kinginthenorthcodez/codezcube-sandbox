import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { generateBlogPosts } from '@/ai/flows/blog-posts-flow';

export default async function BlogPage() {
  const { posts } = await generateBlogPosts({ topic: "The future of technology in Africa" });

  return (
    <div className="container py-16 md:py-24">
      <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">Our Blog & Knowledge Base</h1>
        <p className="max-w-[900px] text-muted-foreground md:text-xl">
          Insights on technology, case studies, and thought leadership from the CodezCube team.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post, index) => (
          <Card key={index} className="overflow-hidden flex flex-col group">
             <Link href="#" className="block">
                <CardContent className="p-0">
                  <Image
                    src={post.image}
                    alt={post.title}
                    width={600}
                    height={400}
                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                    data-ai-hint={post.hint}
                  />
                </CardContent>
              </Link>
            <CardHeader className="p-6">
              <Badge variant="outline" className="w-fit mb-2">{post.category}</Badge>
              <CardTitle className="text-xl leading-snug">
                <Link href="#">{post.title}</Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0 flex-1">
              <CardDescription>{post.excerpt}</CardDescription>
            </CardContent>
            <CardFooter className="p-6 pt-0 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={`https://github.com/shadcn.png`} alt={post.author} />
                  <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="text-sm font-medium">{post.author}</p>
                    <p className="text-xs text-muted-foreground">{post.date}</p>
                </div>
              </div>
              <Link href="#" className="text-sm font-semibold text-primary hover:underline">
                Read More <ArrowRight className="inline-block ml-1 h-4 w-4" />
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
