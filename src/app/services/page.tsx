import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getServices } from '@/lib/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

export default async function ServicesPage() {
    const services = await getServices();

    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="py-16 md:py-24 bg-secondary/50">
                <div className="container px-4 md:px-6">
                    <div className="grid gap-8 md:grid-cols-2 lg:gap-16 items-center">
                        <div className="flex flex-col justify-center space-y-4">
                            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl text-primary">
                                Our Expert Services
                            </h1>
                            <p className="max-w-[600px] text-muted-foreground md:text-xl">
                                Driving innovation and growth with tailored technology solutions. Explore how Codezcube can empower your business.
                            </p>
                        </div>
                        <div className="flex items-center justify-center">
                            <Image
                                src="https://firebasestorage.googleapis.com/v0/b/codezcube-sandbox.firebasestorage.app/o/images%2Fundraw_voice-interface_vo02.svg?alt=media&token=445f18ea-f5b9-4c40-a11c-1241e54d5aa7"
                                width={600}
                                height={400}
                                alt="Expert Services"
                                className="mx-auto overflow-hidden rounded-xl object-cover object-center"
                                data-ai-hint="voice interface"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Offerings Section */}
            <section id="offerings" className="py-16 md:py-24">
                <div className="container">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Explore Our Services</h2>
                        <p className="max-w-[700px] mx-auto text-muted-foreground md:text-lg">
                            We offer a range of expert services to bring your vision to life.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map(service => (
                           <Card key={service.id} className="flex flex-col">
                                <CardHeader>
                                    <CardTitle>{service.title}</CardTitle>
                                    <CardDescription>{service.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                     <ul className="space-y-2">
                                        {service.features.slice(0, 4).map((feature, index) => (
                                            <li key={index} className="flex items-start gap-2">
                                                <CheckCircle2 className="h-4 w-4 mt-1 text-primary flex-shrink-0" />
                                                <span className="text-sm text-muted-foreground">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                                <CardContent>
                                    <Button asChild className="w-full">
                                        <Link href={`/services/${service.slug}`}>Learn More</Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
