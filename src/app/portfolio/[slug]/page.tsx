
import { getPortfolioProjectBySlug, getPortfolioProjects, getClients } from "@/lib/actions";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Search, MessageSquare, Award, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import React from "react";

export async function generateStaticParams() {
    const projects = await getPortfolioProjects();
    return projects.map((project) => ({
        slug: project.slug,
    }));
}

export default async function PortfolioDetailPage({ params }: { params: { slug: string } }) {
    const project = await getPortfolioProjectBySlug(params.slug);
    const clients = await getClients();

    if (!project) {
        notFound();
    }
    
    const keyFeatures = [
        { icon: <Search className="w-8 h-8 text-primary" />, title: "Discover", description: "In-depth discovery phase to understand user needs and define a clear project roadmap, ensuring the final product is both beautiful and functional." },
        { icon: <MessageSquare className="w-8 h-8 text-primary" />, title: "Comment", description: "Iterative design and development process with constant feedback loops, allowing for collaborative refinement and alignment with client goals." },
        { icon: <Award className="w-8 h-8 text-primary" />, title: "Win Awards", description: "Focus on delivering award-winning, high-quality solutions that stand out in the market and provide a tangible return on investment." },
    ];

    return (
        <div className="bg-background">
            <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center text-center text-primary-foreground">
                <Image
                    src={project.imageUrl || 'https://placehold.co/1920x1080.png'}
                    alt={project.title}
                    fill
                    className="object-cover"
                    data-ai-hint="abstract background"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
                <div className="relative z-10 container px-4 space-y-4">
                    <Badge variant="secondary" className="text-base">{project.category}</Badge>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter">{project.title}</h1>
                    <p className="text-xl md:text-2xl text-primary-foreground/80 max-w-3xl mx-auto">{project.description}</p>
                    <div className="mt-8">
                         <Button asChild>
                            <Link href="/portfolio">
                                <ArrowLeft className="mr-2" />
                                Back to Portfolio
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>
            
            <section className="-mt-32 relative z-20 pb-16 md:pb-24">
                <div className="container">
                    <Image
                        src="https://placehold.co/1200x600.png"
                        width={1200}
                        height={600}
                        alt="Project Mockups on devices"
                        className="rounded-lg shadow-2xl"
                        data-ai-hint="app mockup tablet phone"
                    />
                </div>
            </section>

            <section className="py-16 md:py-24 bg-secondary/50">
                <div className="container text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Showcasing Gorgeous Photography</h2>
                    <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-16">
                        {project.problemStatement || "The core challenge was to create a platform that not only displays high-quality photography but also fosters a community of creators through engagement and recognition."}
                    </p>
                    <div className="grid md:grid-cols-3 gap-12">
                        {keyFeatures.map(feature => (
                            <div key={feature.title} className="flex flex-col items-center">
                                <div className="p-4 bg-background rounded-full mb-4 shadow-md">{feature.icon}</div>
                                <h3 className="text-2xl font-bold mb-2">{feature.title}</h3>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            
            <section className="py-16 md:py-24">
                <div className="container grid lg:grid-cols-2 gap-12 items-center">
                    <div>
                         <h2 className="text-3xl md:text-4xl font-bold mb-4">Photography Matters</h2>
                         <p className="text-lg text-muted-foreground">
                            {project.designThinkingProcess || "We focused on a clean, minimal UI that puts the photography front and center. The interface is designed to be intuitive, allowing users to browse, vote, and upload with ease, ensuring the art is always the hero."}
                         </p>
                    </div>
                    <Image
                        src={"https://placehold.co/800x600.png"}
                        width={800}
                        height={600}
                        alt="Photography showcase"
                        className="rounded-lg shadow-xl"
                        data-ai-hint="photo collage"
                    />
                </div>
            </section>

            <section className="py-16 md:py-24 bg-secondary/50">
                <div className="container grid lg:grid-cols-2 gap-12 items-center">
                     <div className="flex justify-center">
                         <Image
                            src="https://placehold.co/300x600.png"
                            width={300}
                            height={600}
                            alt="Mobile voting screen"
                            className="rounded-2xl shadow-2xl"
                            data-ai-hint="mobile app screen"
                         />
                     </div>
                     <div className="lg:order-first">
                         <h2 className="text-3xl md:text-4xl font-bold mb-4">Making Voting Pleasurable</h2>
                         <p className="text-lg text-muted-foreground mb-8">
                            {project.taskFlow || "The voting process was simplified to a single tap, creating an engaging and addictive user experience. We designed a clear and simple flow to encourage participation."}
                         </p>
                         <ul className="space-y-4">
                            <li className="flex items-start gap-3"><CheckCircle className="h-6 w-6 text-primary flex-shrink-0" /><span>Intuitive one-tap voting system.</span></li>
                            <li className="flex items-start gap-3"><CheckCircle className="h-6 w-6 text-primary flex-shrink-0" /><span>Real-time leaderboards and ranking.</span></li>
                            <li className="flex items-start gap-3"><CheckCircle className="h-6 w-6 text-primary flex-shrink-0" /><span>Seamless sharing to social media.</span></li>
                         </ul>
                     </div>
                </div>
            </section>

             <section className="py-16 md:py-24">
                <div className="container text-center">
                     <h2 className="text-3xl md:text-4xl font-bold mb-4">Seamless Across Mobile and Web</h2>
                     <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-12">
                        {project.highFidelityPrototypes || "A consistent and beautiful user experience was crafted for both mobile and desktop, ensuring accessibility and ease of use no matter the device."}
                    </p>
                    <Image
                        src="https://placehold.co/1200x600.png"
                        width={1200}
                        height={600}
                        alt="Desktop and Mobile Mockups"
                        className="rounded-lg shadow-xl"
                        data-ai-hint="desktop app screen"
                    />
                </div>
            </section>

            <section className="py-16 md:py-24 bg-secondary/50">
                <div className="container text-center">
                    <h3 className="text-2xl font-semibold mb-6">Technologies Used</h3>
                    <div className="flex flex-wrap gap-3 justify-center">
                        {project.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-lg px-4 py-1">{tag}</Badge>
                        ))}
                    </div>
                </div>
            </section>
            
            {clients.length > 0 && (
                 <section className="py-16 md:py-24 bg-gray-900 text-gray-400">
                    <div className="container">
                        <h3 className="text-center text-xl font-semibold mb-8">Trusted by industry leaders</h3>
                        <div className="flex items-center justify-center gap-x-12 gap-y-8 flex-wrap">
                          {clients.map((client) => (
                            <div key={client.id} title={client.name}>
                              <Image
                                src={client.logoUrl}
                                alt={`${client.name} Logo`}
                                width={140}
                                height={50}
                                className="object-contain grayscale invert hover:grayscale-0 hover:invert-0 opacity-70 hover:opacity-100 transition-all duration-300"
                                data-ai-hint={client.dataAiHint}
                              />
                            </div>
                          ))}
                        </div>
                    </div>
                </section>
            )}

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
