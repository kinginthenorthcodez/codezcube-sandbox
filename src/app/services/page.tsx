
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getServices } from '@/lib/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Users, Lightbulb, HeartHandshake } from 'lucide-react';

const processSteps = [
  {
    number: '01',
    title: 'Discovery & Planning',
    description: 'Understand goals and define project scope.',
  },
  {
    number: '02',
    title: 'Prototyping & Design',
    description: 'Create wireframes and visual designs.',
  },
  {
    number: '03',
    title: 'Development & Integration',
    description: 'Build and integrate the core features.',
  },
  {
    number: '04',
    title: 'Launch & Optimization',
    description: 'Deploy, monitor, and improve the solution.',
  },
];

const whyChooseUsItems = [
  {
    icon: <Users className="h-8 w-8" />,
    title: 'Expert Team',
    description: "Skilled professionals dedicated to your project's success.",
  },
  {
    icon: <Lightbulb className="h-8 w-8" />,
    title: 'Innovative Solutions',
    description: 'Cutting-edge technology tailored to your unique needs.',
  },
  {
    icon: <HeartHandshake className="h-8 w-8" />,
    title: 'Client-Focused',
    description: 'Collaborative approach ensuring your vision is realized.',
  },
];

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
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Explore Our Offerings</h2>
                        {services.length === 0 && (
                            <p className="text-muted-foreground">Our services are currently being updated. Please check back soon!</p>
                        )}
                    </div>
                    {services.length > 0 && (
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
                    )}
                </div>
            </section>

            {/* Planned Process Section */}
            <section id="process" className="py-16 md:py-24 bg-background">
              <div className="container">
                <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Our Planned Process</h2>
                  <p className="max-w-[700px] mx-auto text-muted-foreground md:text-lg">
                    A look into our structured approach for delivering exceptional results on future projects.
                  </p>
                </div>
                <div className="relative max-w-5xl mx-auto">
                  {/* The connecting line for larger screens */}
                  <div className="hidden md:block absolute top-8 left-0 w-full h-px bg-border -translate-y-1/2"></div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-y-12 md:gap-y-0 md:gap-x-8 relative">
                    {processSteps.map((step) => (
                      <div key={step.number} className="flex flex-col items-center text-center">
                        <div className="mb-4 z-10 flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground font-bold text-2xl border-4 border-background">
                          {step.number}
                        </div>
                        <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                        <p className="text-muted-foreground text-sm">{step.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Why Choose Us Section */}
            <section id="why-us" className="py-16 md:py-24 bg-secondary/50">
                <div className="container">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Why Choose Codezcube?</h2>
                        <p className="max-w-3xl text-muted-foreground md:text-xl">
                           At Codezcube, we're not just developers; we're your dedicated technology partners. We combine expertise with a passion for innovation to deliver solutions that exceed expectations and drive tangible results.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {whyChooseUsItems.map((item) => (
                            <div key={item.title} className="p-6 flex flex-col items-center text-center">
                                <div className="flex items-center justify-center mb-4">
                                    <div className="p-4 rounded-full bg-primary/10 text-primary">
                                        {item.icon}
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                                <p className="text-muted-foreground">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
