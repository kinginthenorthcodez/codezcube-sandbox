
import { getPortfolioProjectBySlug, getPortfolioProjects } from "@/lib/actions";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, Clock, Target, PenTool, Brain, Search, Map, Bot, Palette, MonitorPlay, ThumbsUp, Clapperboard, Type, Microscope, BookUser, Workflow, Shuffle, Network, Lightbulb, BarChartBig } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import React from "react";

// Reusable component for timeline items
const TimelineItem = ({ title, icon, children, isLast = false }: { title: string; icon: React.ReactNode; children: React.ReactNode; isLast?: boolean }) => (
    <div className="relative flex items-start gap-6 sm:gap-8">
        <div className="flex flex-col items-center">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary ring-8 ring-background">
                 {React.cloneElement(icon as React.ReactElement, { className: "h-6 w-6 text-primary-foreground" })}
            </div>
            {!isLast && <div className="h-full min-h-[4rem] w-px bg-border" />}
        </div>
        <div id={title.toLowerCase().replace(/ /g, '-')} className="flex-1 pb-12 pt-2">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">{title}</h2>
            <div className="prose prose-lg text-muted-foreground max-w-none">
                {typeof children === 'string' 
                    ? children.split('\n').filter(p => p.trim() !== '').map((paragraph, i) => <p key={i}>{paragraph}</p>)
                    : children
                }
            </div>
        </div>
    </div>
);

// Reusable component for sub-sections within a timeline item
const TimelineSubSection = ({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) => (
    <div className="mt-8 rounded-lg border bg-card/50 p-6">
        <div className="flex items-center gap-3 mb-3">
             <div className="bg-secondary p-2 rounded-md text-primary">
                {icon}
            </div>
            <h3 className="text-xl font-semibold text-foreground">{title}</h3>
        </div>
        <div className="text-base">
            {typeof children === 'string' 
                ? children.split('\n').filter(p => p.trim() !== '').map((paragraph, i) => <p key={i}>{paragraph}</p>)
                : children
            }
        </div>
    </div>
);

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
            
            <header className="text-center mb-12">
                <Badge variant="secondary" className="mb-4">{project.category}</Badge>
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl lg:text-6xl text-primary mb-4">{project.title}</h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{project.description}</p>
            </header>
            
            <div className="mt-16 grid lg:grid-cols-12 gap-12">
                <article className="lg:col-span-8">
                    <div>
                        <TimelineItem title="Hero Image" icon={<MonitorPlay />}>
                            <Image 
                                src={project.imageUrl || 'https://placehold.co/1200x600.png'}
                                alt={project.title}
                                width={1200}
                                height={600}
                                className="rounded-lg shadow-lg object-cover w-full h-auto"
                                data-ai-hint="project case study"
                            />
                        </TimelineItem>

                        <TimelineItem title="Problem Statement & Possible Solution" icon={<Target />}>
                           {project.problemStatement}
                        </TimelineItem>

                        <TimelineItem title="Target Audience & The Approach" icon={<Users />}>
                           {project.targetAudience}
                        </TimelineItem>

                        <TimelineItem title="My Role" icon={<PenTool />}>
                           {project.myRole}
                        </TimelineItem>

                        <TimelineItem title="Design Thinking Process" icon={<Brain />}>
                           {project.designThinkingProcess}
                        </TimelineItem>

                        <TimelineItem title="Project Timeline" icon={<Clock />}>
                            {project.projectTimeline}
                        </TimelineItem>

                        <TimelineItem title="Empathize Phase" icon={<Search />}>
                            <p>In this phase, we focused on understanding the user's needs, motivations, and pain points through various research methods.</p>
                            <TimelineSubSection title="Qualitative Research" icon={<Microscope className="h-5 w-5"/>}>
                                {project.qualitativeResearch}
                            </TimelineSubSection>
                            <TimelineSubSection title="Quantitative Research" icon={<BarChartBig className="h-5 w-5"/>}>
                                {project.quantitativeResearch}
                            </TimelineSubSection>
                        </TimelineItem>

                        <TimelineItem title="Define Phase" icon={<Lightbulb />}>
                            <p>Here, we synthesized our research findings to articulate the core user problems and define clear project goals.</p>
                            <TimelineSubSection title="User Persona" icon={<BookUser className="h-5 w-5"/>}>{project.userPersona}</TimelineSubSection>
                            <TimelineSubSection title="Empathy Map" icon={<Map className="h-5 w-5"/>}>{project.empathyMap}</TimelineSubSection>
                            <TimelineSubSection title="Task Flow" icon={<Workflow className="h-5 w-5"/>}>{project.taskFlow}</TimelineSubSection>
                            <TimelineSubSection title="Card Sorting" icon={<Shuffle className="h-5 w-5"/>}>{project.cardSorting}</TimelineSubSection>
                            <TimelineSubSection title="Information Architecture" icon={<Network className="h-5 w-5"/>}>{project.informationArchitecture}</TimelineSubSection>
                        </TimelineItem>

                        <TimelineItem title="Design Phase" icon={<Palette />}>
                            <p>This phase involved creating the visual and interactive elements of the product, from initial sketches to high-fidelity, polished designs.</p>
                            <TimelineSubSection title="High-Fidelity Prototypes" icon={<MonitorPlay className="h-5 w-5"/>}>{project.highFidelityPrototypes}</TimelineSubSection>
                            <TimelineSubSection title="Typography & Colors" icon={<Type className="h-5 w-5"/>}>{project.typographyAndColors}</TimelineSubSection>
                            <TimelineSubSection title="Visual Designs" icon={<Clapperboard className="h-5 w-5"/>}>{project.visualDesigns}</TimelineSubSection>
                        </TimelineItem>

                        <TimelineItem title="Thank You" icon={<ThumbsUp />} isLast={true}>
                             {project.thankYouNote}
                        </TimelineItem>
                    </div>
                </article>

                <aside className="lg:col-span-4">
                    <div className="p-6 rounded-lg bg-secondary sticky top-24">
                        <h3 className="text-xl font-semibold mb-4 text-foreground">Technologies Used</h3>
                        <div className="flex flex-wrap gap-2">
                            {project.tags.map((tag, index) => (
                                <Badge key={index} variant="outline">{tag}</Badge>
                            ))}
                        </div>
                    </div>
                </aside>
            </div>

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
