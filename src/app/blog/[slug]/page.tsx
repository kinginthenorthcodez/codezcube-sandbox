
import { getBlogPostBySlug, getBlogPosts } from "@/lib/actions";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export async function generateStaticParams() {
    const posts = await getBlogPosts();
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
    const post = await getBlogPostBySlug(params.slug);

    if (!post) {
        notFound();
    }

    return (
        <article className="container max-w-4xl py-16 md:py-24">
            <div className="mb-8">
                <Button asChild variant="outline" size="sm">
                    <Link href="/blog">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Blog
                    </Link>
                </Button>
            </div>
            
            <header className="space-y-4 mb-8">
                <Badge variant="secondary">{post.category}</Badge>
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl lg:text-6xl">{post.title}</h1>
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{post.date}</span>
                    </div>
                </div>
            </header>

            <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-12 shadow-lg">
                <Image 
                    src={post.imageUrl || 'https://placehold.co/1200x600.png'}
                    alt={post.title}
                    fill
                    className="object-cover"
                    data-ai-hint="blog post header"
                    priority
                />
            </div>
            
            <div className="prose prose-lg dark:prose-invert max-w-none mx-auto">
                {post.content.split('\n').filter(p => p.trim() !== '').map((paragraph, i) => <p key={i}>{paragraph}</p>)}
            </div>

             <div className="mt-16 text-center border-t pt-12">
                 <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Ready to Start a Project?</h2>
                 <p className="max-w-[700px] mx-auto text-muted-foreground md:text-lg my-4">
                     Let's discuss how our expertise can bring your vision to life.
                 </p>
                 <Button asChild size="lg">
                     <Link href="/contact">Get in Touch</Link>
                 </Button>
            </div>
        </article>
    );
}
