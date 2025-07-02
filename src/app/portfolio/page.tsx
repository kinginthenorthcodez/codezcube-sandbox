import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { generateProjects } from '@/ai/flows/portfolio-projects-flow';

export default async function PortfolioPage() {
  const { projects } = await generateProjects({ topic: "Innovative Tech Solutions for Africa" });

  return (
    <div className="container py-16 md:py-24">
      <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">Our Portfolio</h1>
        <p className="max-w-[900px] text-muted-foreground md:text-xl">
          A glimpse into the impactful solutions we've delivered for our clients.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project, index) => (
          <Card key={index} className="overflow-hidden flex flex-col group">
            <CardContent className="p-0">
              <Image
                src={project.image}
                alt={project.title}
                width={600}
                height={400}
                className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                data-ai-hint={project.hint}
              />
            </CardContent>
            <div className="p-6 flex flex-col flex-1">
              <Badge variant="secondary" className="mb-2 w-fit">{project.category}</Badge>
              <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
              <p className="text-muted-foreground text-sm flex-1">{project.description}</p>
            </div>
            <CardFooter>
              <Button variant="link" className="p-0 h-auto">
                View Case Study <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
