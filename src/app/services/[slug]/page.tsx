import { getServiceBySlug, getServices } from "@/lib/actions";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export async function generateStaticParams() {
    const services = await getServices();
    return services.map((service) => ({
        slug: service.slug,
    }));
}

export default async function ServiceDetailPage({ params }: { params: { slug: string } }) {
    const service = await getServiceBySlug(params.slug);

    if (!service) {
        notFound();
    }

    return (
        <div className="container py-16 md:py-24">
            <div className="mb-12">
                <Button asChild variant="outline">
                    <Link href="/services">
                        <ArrowLeft className="mr-2" />
                        Back to All Services
                    </Link>
                </Button>
            </div>
            <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="order-2 md:order-1">
                    <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl text-primary mb-4">{service.title}</h1>
                    <div className="prose prose-lg text-muted-foreground max-w-none mb-6">
                        {service.details.split('\n').map((line, i) => <p key={i}>{line}</p>)}
                    </div>
                    <h2 className="text-2xl font-bold mb-4">Key Features</h2>
                    <ul className="space-y-3">
                        {service.features.map((feature, index) => (
                             <li key={index} className="flex items-start gap-3">
                                <CheckCircle2 className="h-5 w-5 mt-0.5 text-primary flex-shrink-0" />
                                <span className="text-muted-foreground">{feature}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="order-1 md:order-2">
                    <Image 
                        src={service.imageUrl || 'https://placehold.co/600x400.png'}
                        alt={service.title}
                        width={600}
                        height={400}
                        className="rounded-lg shadow-lg object-cover w-full h-auto"
                        data-ai-hint="abstract technology"
                    />
                </div>
            </div>
             <div className="mt-16 text-center">
                 <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Ready to Start a Project?</h2>
                 <p className="max-w-[700px] mx-auto text-muted-foreground md:text-lg my-4">
                     Let's discuss how our {service.title} expertise can help you achieve your goals.
                 </p>
                 <Button asChild size="lg">
                     <Link href="/contact">Get in Touch</Link>
                 </Button>
            </div>
        </div>
    );
}
