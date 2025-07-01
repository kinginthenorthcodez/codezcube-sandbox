import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const projects = [
  {
    title: "SME E-commerce Platform",
    description: "A full-featured e-commerce solution for small and medium enterprises in Zambia, enabling them to sell their products online.",
    category: "Web Development",
    image: "https://placehold.co/600x400.png",
    hint: "online store shopping",
  },
  {
    title: "AI-Powered Learning Assistant",
    description: "An intelligent chatbot and learning platform that provides personalized educational support for students.",
    category: "AI/ML",
    image: "https://placehold.co/600x400.png",
    hint: "robot chatbot education",
  },
  {
    title: "National NGO Digital Portal",
    description: "A comprehensive web portal for a major NGO, featuring resource management, event scheduling, and community engagement tools.",
    category: "Web Development",
    image: "https://placehold.co/600x400.png",
    hint: "community website charity",
  },
  {
    title: "Mobile App for Farmers",
    description: "A cross-platform mobile app providing farmers with real-time weather data, market prices, and agricultural advice.",
    category: "Mobile Development",
    image: "https://placehold.co/600x400.png",
    hint: "agriculture app phone",
  },
  {
    title: "Government Service Automation",
    description: "An AI-driven system to automate and streamline public service requests for a government department.",
    category: "AI/ML",
    image: "https://placehold.co/600x400.png",
    hint: "government technology automation",
  },
  {
    title: "Interactive EdTech Game",
    description: "A gamified learning experience for primary school students, making mathematics fun and engaging.",
    category: "EdTech",
    image: "https://placehold.co/600x400.png",
    hint: "kids game learning",
  },
];

export default function PortfolioPage() {
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
