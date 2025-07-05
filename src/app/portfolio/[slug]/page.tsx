
import { getPortfolioProjectBySlug, getPortfolioProjects } from "@/lib/actions";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Tag } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export async function generateStaticParams() {
    const projects = await getPortfolioProjects();
    return projects.map((project) => ({
        slug: project.slug,
    }));
}

const CaseStudySection = ({ title, children }: { title: string; children: React.ReactNode }) => {
    if (!children || (typeof children === 'string' && !children.trim())) {
        return null;
    }
    return (
        <div className="mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-6 text-primary">{title}</h2>
            <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground space-y-4">
                {children}
            </div>
        </div>
    );
};

const Paragraphs = ({ text }: { text: string | undefined }) => {
    if (!text?.trim()) return null;
    return <>{text.split('\n').filter(p => p.trim()).map((p, i) => <p key={i}>{p}</p>)}</>;
};

export default async function PortfolioDetailPage({ params }: { params: { slug: string } }) {
    const project = await getPortfolioProjectBySlug(params.slug);

    if (!project) {
        notFound();
    }
    
    return (
        <div className="container max-w-5xl py-16 md:py-24">
            <div className="mb-8">
                <Button asChild variant="outline" size="sm">
                    <Link href="/portfolio">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Portfolio
                    </Link>
                </Button>
            </div>
            
            <header className="space-y-4 mb-12 text-center">
                <Badge variant="secondary">{project.category}</Badge>
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl lg:text-6xl">{project.title}</h1>
                <p className="max-w-3xl mx-auto text-muted-foreground md:text-xl">{project.description}</p>
            </header>

            <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-16 shadow-lg">
                <Image 
                    src={project.imageUrl || 'https://placehold.co/1200x600.png'}
                    alt={project.title}
                    fill
                    className="object-cover"
                    data-ai-hint="project hero"
                    priority
                />
            </div>
            
            <article>
                <CaseStudySection title="Problem Statement & Solution">
                    <Paragraphs text={project.problemStatement} />
                </CaseStudySection>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 my-16">
                    {project.targetAudience && <Card><CardHeader><CardTitle>Target Audience</CardTitle></CardHeader><CardContent><Paragraphs text={project.targetAudience} /></CardContent></Card>}
                    {project.myRole && <Card><CardHeader><CardTitle>My Role</CardTitle></CardHeader><CardContent><Paragraphs text={project.myRole} /></CardContent></Card>}
                    {project.projectTimeline && <Card className="md:col-span-2 lg:col-span-1"><CardHeader><CardTitle>Project Timeline</CardTitle></CardHeader><CardContent><Paragraphs text={project.projectTimeline} /></CardContent></Card>}
                </div>
                
                <CaseStudySection title="Design Thinking Process">
                    <Paragraphs text={project.designThinkingProcess} />
                </CaseStudySection>

                <CaseStudySection title="Qualitative Research">
                    <Paragraphs text={project.qualitativeResearch} />
                </CaseStudySection>

                <CaseStudySection title="Quantitative Research">
                    <Paragraphs text={project.quantitativeResearch} />
                </CaseStudySection>
                
                <CaseStudySection title="User Persona">
                    <Paragraphs text={project.userPersona} />
                </CaseStudySection>

                <CaseStudySection title="Empathy Map">
                    <Paragraphs text={project.empathyMap} />
                </CaseStudySection>

                <CaseStudySection title="Task Flow">
                    <Paragraphs text={project.taskFlow} />
                </CaseStudySection>
                
                <CaseStudySection title="Card Sorting">
                    <Paragraphs text={project.cardSorting} />
                </CaseStudySection>

                <CaseStudySection title="Information Architecture">
                    <Paragraphs text={project.informationArchitecture} />
                </CaseStudySection>

                <CaseStudySection title="High-Fidelity Prototypes">
                    <Paragraphs text={project.highFidelityPrototypes} />
                </CaseStudySection>
                
                <CaseStudySection title="Typography & Colors">
                    <Paragraphs text={project.typographyAndColors} />
                </CaseStudySection>

                <CaseStudySection title="Visual Designs">
                    <Paragraphs text={project.visualDesigns} />
                </CaseStudySection>
                
                <Separator className="my-16" />

                {project.tags && project.tags.length > 0 && (
                    <div className="mb-12">
                        <h3 className="text-2xl font-bold mb-4">Technologies & Tags</h3>
                        <div className="flex flex-wrap gap-2">
                            {project.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-base py-1 px-3">
                                    <Tag className="mr-2 h-4 w-4"/>
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}

                <CaseStudySection title="A Final Word">
                    <Paragraphs text={project.thankYouNote} />
                </CaseStudySection>

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
