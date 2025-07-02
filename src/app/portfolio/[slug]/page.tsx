import { getPortfolioProjectBySlug, getPortfolioProjects } from "@/lib/actions";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, Clock, Target, PenTool, Brain, Search, Map, Bot, Palette, MonitorPlay, ThumbsUp, Clapperboard, Type } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Reusable component for case study sections
const CaseStudySection = ({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) => (
    <div id={title.toLowerCase().replace(/ /g, '-')} className="py-8">
        <div className="flex items-center gap-4 mb-4">
            <div className="bg-primary/10 text-primary p-3 rounded-full">
                {icon}
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">{title}</h2>
        </div>
        <div className="prose prose-lg text-muted-foreground max-w-none md:pl-16">
            {children}
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
            
            <article>
                <header className="text-center mb-12">
                    <Badge variant="secondary" className="mb-4">{project.category}</Badge>
                    <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl lg:text-6xl text-primary mb-4">{project.title}</h1>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{project.description}</p>
                </header>

                <CaseStudySection title="Hero Image" icon={<MonitorPlay className="h-6 w-6"/>}>
                    <Image 
                        src={project.imageUrl || 'https://placehold.co/1200x600.png'}
                        alt={project.title}
                        width={1200}
                        height={600}
                        className="rounded-lg shadow-lg object-cover w-full h-auto"
                        data-ai-hint="project case study"
                    />
                </CaseStudySection>
                <Separator className="my-8" />
                
                <CaseStudySection title="Problem Statement & Possible Solution" icon={<Target className="h-6 w-6"/>}>
                    {project.details.split('\n').filter(p => p.trim() !== '').map((paragraph, i) => <p key={i}>{paragraph}</p>)}
                </CaseStudySection>
                <Separator className="my-8" />

                <CaseStudySection title="Target Audience & The Approach" icon={<Users className="h-6 w-6"/>}>
                    <p>This section will detail the target audience for the project and the strategic approach taken to meet their needs. [Placeholder content]</p>
                </CaseStudySection>
                <Separator className="my-8" />
                
                <CaseStudySection title="My Role" icon={<PenTool className="h-6 w-6"/>}>
                    <p>This section will describe my specific role and responsibilities throughout the project lifecycle. [Placeholder content]</p>
                </CaseStudySection>
                <Separator className="my-8" />

                <CaseStudySection title="Design Thinking Process" icon={<Brain className="h-6 w-6"/>}>
                    <p>This section provides an overview of the design thinking methodology applied to this project. [Placeholder content]</p>
                </CaseStudySection>
                <Separator className="my-8" />
                
                <CaseStudySection title="Project Timeline" icon={<Clock className="h-6 w-6"/>}>
                    <p>A summary of the project timeline and key milestones. [Placeholder content]</p>
                </CaseStudySection>

                <Card className="my-12 bg-secondary/50">
                    <CardHeader>
                        <CardTitle className="text-3xl text-center text-primary">Empathize Phase</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                         <CaseStudySection title="Qualitative Research" icon={<Search className="h-6 w-6"/>}>
                            <p>Details about the qualitative research methods used, such as user interviews and observations. [Placeholder content]</p>
                        </CaseStudySection>
                        <Separator className="my-8" />
                        <CaseStudySection title="Quantitative Research" icon={<Search className="h-6 w-6"/>}>
                            <p>Details about quantitative research methods like surveys and analytics review. [Placeholder content]</p>
                        </CaseStudySection>
                    </CardContent>
                </Card>

                <Card className="my-12">
                    <CardHeader>
                        <CardTitle className="text-3xl text-center text-primary">Define Phase</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <CaseStudySection title="User Persona" icon={<Users className="h-6 w-6"/>}><p>A detailed user persona developed from the research findings. [Placeholder content]</p></CaseStudySection>
                        <Separator className="my-8" />
                        <CaseStudySection title="Empathy Map" icon={<Map className="h-6 w-6"/>}><p>An empathy map to visualize user attitudes and behaviors. [Placeholder content]</p></CaseStudySection>
                        <Separator className="my-8" />
                        <CaseStudySection title="Task Flow" icon={<Bot className="h-6 w-6"/>}><p>Diagrams or descriptions of the primary user task flows. [Placeholder content]</p></CaseStudySection>
                        <Separator className="my-8" />
                        <CaseStudySection title="Card Sorting" icon={<Bot className="h-6 w-6"/>}><p>Information on how card sorting was used to inform the information architecture. [Placeholder content]</p></CaseStudySection>
                        <Separator className="my-8" />
                        <CaseStudySection title="Information Architecture" icon={<Bot className="h-6 w-6"/>}><p>The resulting information architecture for the application. [Placeholder content]</p></CaseStudySection>
                    </CardContent>
                </Card>

                <Card className="my-12 bg-secondary/50">
                    <CardHeader>
                        <CardTitle className="text-3xl text-center text-primary">Design</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <CaseStudySection title="High-Fidelity Prototypes" icon={<MonitorPlay className="h-6 w-6"/>}><p>Showcase of the high-fidelity prototypes created for user testing. [Placeholder content]</p></CaseStudySection>
                        <Separator className="my-8" />
                        <CaseStudySection title="Typography & Colors" icon={<Palette className="h-6 w-6"/>}><p>The typography choices and color palette defined for the project. [Placeholder content]</p></CaseStudySection>
                        <Separator className="my-8" />
                        <CaseStudySection title="Visual Designs" icon={<Clapperboard className="h-6 w-6"/>}><p>Final visual designs and key screens of the application. [Placeholder content]</p></CaseStudySection>
                    </CardContent>
                </Card>

                <CaseStudySection title="Thank You Slide" icon={<ThumbsUp className="h-6 w-6"/>}>
                    <p>Thank you for reviewing this case study. Feel free to reach out with any questions! [Placeholder content]</p>
                </CaseStudySection>
                <Separator className="my-8" />

                <aside className="mt-8">
                    <div className="p-6 rounded-lg bg-secondary sticky top-24">
                        <h3 className="text-xl font-semibold mb-4 text-foreground">Technologies Used</h3>
                        <div className="flex flex-wrap gap-2">
                            {project.tags.map((tag, index) => (
                                <Badge key={index} variant="outline">{tag}</Badge>
                            ))}
                        </div>
                    </div>
                </aside>
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
