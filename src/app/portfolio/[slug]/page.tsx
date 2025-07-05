
import { getPortfolioProjectBySlug, getPortfolioProjects } from "@/lib/actions";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Tag, Clock, ClipboardList, AlertTriangle, Heart, FileText, Lightbulb, PenTool, CheckSquare, Palette, User } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { Metadata } from 'next';

export async function generateStaticParams() {
    const projects = await getPortfolioProjects();
    return projects.map((project) => ({
        slug: project.slug,
    }));
}

export async function generateMetadata({ params }: { params: { slug:string } }): Promise<Metadata> {
  const project = await getPortfolioProjectBySlug(params.slug);

  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }

  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images: [
        {
          url: project.imageUrl,
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
    },
  };
}

const Section = ({ icon: Icon, title, children, className }: { icon?: React.ElementType; title: string; children: React.ReactNode; className?: string }) => {
    if (!children) return null;
    
    // A check to see if children are empty paragraphs or empty arrays
    const childrenArray = React.Children.toArray(children);
    if (childrenArray.length === 0) return null;
    if (childrenArray.every(child => {
        if (React.isValidElement(child) && child.props.text) {
             return !child.props.text.trim();
        }
        if (React.isValidElement(child) && child.props.images) {
            return child.props.images.length === 0;
        }
        return false;
    })) {
        return null;
    }

    return (
        <section className={cn("py-12", className)}>
            <div className="flex items-center gap-4 mb-8">
                {Icon && <div className="bg-primary/10 text-primary p-3 rounded-lg"><Icon className="h-6 w-6" /></div>}
                <h2 className="text-3xl font-bold tracking-tight text-primary">{title}</h2>
            </div>
            {children}
        </section>
    );
};

const ProseContent = ({ text }: { text: string | undefined }) => {
    if (!text?.trim()) return null;
    return (
        <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground space-y-4">
            {text.split('\n').filter(p => p.trim()).map((p, i) => <p key={i}>{p}</p>)}
        </div>
    );
};

const ImageCollage = ({ images, altPrefix }: { images: { imageUrl: string }[] | undefined; altPrefix: string }) => {
    if (!images || images.length === 0) return null;
    return (
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-4 my-8">
            {images.map((image, index) => (
                <div key={index} className="relative aspect-video rounded-lg overflow-hidden shadow-lg border">
                    <Image
                        src={image.imageUrl}
                        alt={`${altPrefix} ${index + 1}`}
                        fill
                        className="object-cover"
                    />
                </div>
            ))}
        </div>
    );
}

const DesignProcessStage = ({ icon: Icon, title, children }: { icon: React.ElementType, title: string, children: React.ReactNode }) => (
    <div className="flex flex-col items-center text-center">
        <div className="flex flex-col items-center gap-4 mb-4">
            <div className="bg-primary/10 text-primary p-4 rounded-full border-2 border-primary/20">
                <Icon className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-semibold">{title}</h3>
        </div>
        <div className="text-sm text-muted-foreground space-y-2">
            {children}
        </div>
    </div>
);

export default async function PortfolioDetailPage({ params }: { params: { slug:string } }) {
    const project = await getPortfolioProjectBySlug(params.slug);

    if (!project) {
        notFound();
    }
    
    return (
        <div className="bg-secondary/30">
            <div className="container max-w-6xl py-16 md:py-24">
                <div className="mb-12">
                    <Button asChild variant="ghost">
                        <Link href="/portfolio">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Portfolio
                        </Link>
                    </Button>
                </div>
                
                {/* Hero Section */}
                <header className="grid md:grid-cols-2 gap-12 items-center mb-16">
                    <div className="space-y-6">
                        <Badge variant="secondary" className="text-base py-1 px-3">{project.category}</Badge>
                        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl lg:text-6xl">{project.title}</h1>
                        
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-semibold text-lg mb-2">Project Timeline</h3>
                                {project.projectTimeline ? <p className="flex items-center gap-2 text-muted-foreground"><Clock className="h-4 w-4" /> {project.projectTimeline}</p> : <p className="text-muted-foreground">Not specified.</p>}
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg mb-2">Technologies & Tools</h3>
                                {project.tags && project.tags.length > 0 ? (
                                     <div className="flex flex-wrap gap-2">
                                        {project.tags.map((tag) => (
                                            <Badge key={tag} variant="outline">{tag}</Badge>
                                        ))}
                                    </div>
                                ) : <p className="text-muted-foreground">Not specified.</p>}
                            </div>
                        </div>

                    </div>
                    <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden shadow-2xl">
                        <Image 
                            src={project.imageUrl || 'https://placehold.co/800x600.png'}
                            alt={project.title}
                            fill
                            className="object-cover"
                            data-ai-hint="project hero"
                            priority
                        />
                    </div>
                </header>

                <Card className="p-8 md:p-12 shadow-lg">
                    <Section icon={ClipboardList} title="Overview">
                        <ProseContent text={project.description} />
                    </Section>
                    
                    <Section icon={AlertTriangle} title="Problem Statement & Solution">
                        <ProseContent text={project.problemStatement} />
                    </Section>
                    
                    <Separator className="my-8" />
                    
                    <h2 className="text-4xl font-bold tracking-tight text-center mb-16">Our Process</h2>
                    
                    {/* Empathize Section */}
                    <Section icon={Heart} title="Empathize">
                        <ProseContent text={project.qualitativeResearch} />
                        <ProseContent text={project.quantitativeResearch} />
                    </Section>
                     <Section title="User Persona & Empathy Map">
                        <ProseContent text={project.userPersona} />
                        <ProseContent text={project.empathyMap} />
                    </Section>
                    
                    {/* Define Section */}
                    <Section icon={FileText} title="Define">
                        <ProseContent text={project.taskFlow} />
                        <ProseContent text={project.cardSorting} />
                    </Section>
                    <Section title="Information Architecture">
                        <ProseContent text={project.informationArchitecture} />
                    </Section>

                     {/* Ideate Section */}
                    <Section icon={Lightbulb} title="Ideate">
                       <ProseContent text={project.designThinkingProcess} />
                    </Section>
                    
                    {/* Design Section */}
                    <Section icon={PenTool} title="Design">
                        <Card className="bg-secondary/50 p-6 my-4">
                            <h3 className="text-2xl font-semibold mb-4">High-Fidelity Prototypes</h3>
                            <ProseContent text={project.highFidelityPrototypes} />
                            <ImageCollage images={project.highFidelityPrototypesImages} altPrefix="Prototype" />
                        </Card>
                        <Card className="bg-secondary/50 p-6 my-4">
                            <h3 className="text-2xl font-semibold mb-4">Visual Designs</h3>
                            <ProseContent text={project.visualDesigns} />
                            <ImageCollage images={project.visualDesignsImages} altPrefix="Visual Design" />
                        </Card>
                    </Section>
                     <Section icon={Palette} title="Typography & Colors">
                        <ProseContent text={project.typographyAndColors} />
                    </Section>
                    
                    {/* Test Section */}
                    <Section icon={CheckSquare} title="Results & Final Word">
                        <ProseContent text={project.thankYouNote} />
                    </Section>
                    
                    <div className="mt-16 text-center border-t pt-12">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Have a Similar Project?</h2>
                        <p className="max-w-[700px] mx-auto text-muted-foreground md:text-lg my-4">
                            Let's discuss how our expertise can bring your vision to life.
                        </p>
                        <Button asChild size="lg">
                            <Link href="/contact">Get in Touch</Link>
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
}
