import Image from 'next/image';
import Link from 'next/link';
import { getPortfolioProjects } from '@/lib/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';

export default async function PortfolioPage() {
    const projects = await getPortfolioProjects();

    return (
        <div className="container py-16 md:py-24">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">Our Portfolio</h1>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                    A glimpse into the impactful solutions we've delivered for our clients.
                </p>
            </div>

            {projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map(project => (
                        <Card key={project.id} className="flex flex-col overflow-hidden group">
                           <div className="relative overflow-hidden">
                                <Image
                                    src={project.imageUrl || 'https://placehold.co/600x400.png'}
                                    alt={project.title}
                                    width={600}
                                    height={400}
                                    className="object-cover w-full h-48 transition-transform duration-300 ease-in-out group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
                           </div>
                            <CardHeader>
                                <Badge variant="secondary" className="w-fit mb-2">{project.category}</Badge>
                                <CardTitle className="text-xl">{project.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <CardDescription>{project.description}</CardDescription>
                            </CardContent>
                            <CardContent>
                                <Button asChild variant="outline" className="w-full">
                                    <Link href={`/portfolio/${project.slug}`}>
                                        View Case Study <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle className="text-center">No Projects Yet</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CardDescription className="text-center text-lg">
                            We are busy building amazing things! Check back soon to see our work.
                        </CardDescription>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
