import { getPortfolioProjectBySlug, getPortfolioProjects } from "@/lib/actions";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Tag } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export async function generateStaticParams() {
    const projects = await getPortfolioProjects();
    return projects.map((project) => ({
        slug: project.slug,
    }));
}

export default async function PortfolioDetailPage({ params }: { params: { slug: string } }) {
    const project = await getPortfolioProjectBySlug(params.slug);

    if (!project) {
        notFound();
    }

    return (
        <div className="container py-16 md:py-24">
            <div className="mb-12">
                <Button asChild variant="outline">
                    <Link href="/portfolio">
                        <ArrowLeft className="mr-2" />
                        Back to Portfolio
                    </Link>
                </Button>
            </div>
            
            <article>
                <header className="mb-8">
                    <Badge variant="secondary" className="mb-2">{project.category}</Badge>
                    <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl text-primary mb-4">{project.title}</h1>
                    <p className="text-xl text-muted-foreground">{project.description}</p>
                </header>

                <div className="mb-12">
                     <Image 
                        src={project.imageUrl || 'https://placehold.co/1200x600.png'}
                        alt={project.title}
                        width={1200}
                        height={600}
                        className="rounded-lg shadow-lg object-cover w-full h-auto"
                        data-ai-hint="project case study"
                    />
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 prose prose-lg text-muted-foreground max-w-none">
                        <h2 className="text-2xl font-bold text-foreground mb-4">Case Study Details</h2>
                        {project.details.split('\n').filter(p => p.trim() !== '').map((paragraph, i) => <p key={i}>{paragraph}</p>)}
                    </div>
                    <aside className="md:col-span-1">
                        <div className="p-6 rounded-lg bg-secondary/50 sticky top-24">
                            <h3 className="text-xl font-semibold mb-4 text-foreground">Technologies Used</h3>
                            <div className="flex flex-wrap gap-2">
                                {project.tags.map((tag, index) => (
                                    <Badge key={index} variant="outline">{tag}</Badge>
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>
            </article>

            <div className="mt-16 text-center border-t pt-12">
                 <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Have a Similar Project?</h2>
                 <p className="max-w-[700px] mx-auto text-muted-foreground md:text-lg my-4">
                     Let's discuss how our expertise can bring your vision to life.
                 </p>
                 <Button asChild size="lg">
                     <Link href="/contact">Get in Touch</Link>
                 </Button>
            </div>
        </div>
    );
}
