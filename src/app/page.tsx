
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Briefcase, Zap, BarChartBig, Star, HelpCircle, CheckCircle2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getHomepageStats, getServices, getClients, getTestimonials, getHomepageContent } from '@/lib/actions';
import * as icons from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

export default async function Home() {
  const statsData = await getHomepageStats();
  const servicesData = await getServices();
  const clientsData = await getClients();
  const testimonialsData = await getTestimonials();
  const contentData = await getHomepageContent();

  const stats = [
    {
      icon: <Briefcase className="w-8 h-8 text-primary" />,
      value: statsData.projectsCompleted,
      label: 'Projects Completed',
    },
    {
      icon: <Zap className="w-8 h-8 text-primary" />,
      value: statsData.clientSatisfaction,
      label: 'Client Satisfaction',
    },
    {
      icon: <BarChartBig className="w-8 h-8 text-primary" />,
      value: statsData.yearsOfExperience,
      label: 'Years of Experience',
    },
  ];

  const DynamicIcon = ({ name, className }: { name: string, className?: string }) => {
    const LucideIcon = icons[name as keyof typeof icons] as React.ElementType;
    if (!LucideIcon) {
      return <HelpCircle className={className || "w-10 h-10 text-primary"} />;
    }
    return <LucideIcon className={className || "w-10 h-10 text-primary"} />;
  };

  return (
    <div className="flex flex-col">
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 md:grid-cols-2 lg:gap-16">
            <div className="flex flex-col justify-center space-y-2">
              <h1 className="text-5xl font-bold tracking-tighter sm:text-6xl xl:text-7xl/none text-primary">
                {contentData.hero.headline}
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                {contentData.hero.subtext}
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg">
                  <Link href={contentData.hero.ctaLink}>{contentData.hero.ctaText}</Link>
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <Image
                src="https://firebasestorage.googleapis.com/v0/b/codezcube-sandbox.firebasestorage.app/o/images%2Fundraw_visionary-technology_6ouq.svg?alt=media&token=078b84e1-0ea0-440f-aa5e-66471552e10f"
                width={600}
                height={500}
                alt="Visionary Technology"
                className="mx-auto aspect-square overflow-hidden rounded-xl object-contain object-center"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="offerings" className="py-16 md:py-24 bg-secondary">
        <div className="container">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Our Core Offerings</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              We provide a comprehensive suite of technology services designed to elevate your business, from initial concept to final deployment.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicesData.map((service) => (
               <Card key={service.id} className="flex flex-col">
                 <CardContent className="p-6 flex-grow">
                    <div className="flex items-start gap-4 mb-4">
                        <div className="p-3 rounded-full bg-accent/10 text-accent">
                            <DynamicIcon name={service.iconName} className="w-6 h-6" />
                        </div>
                        <CardTitle className="text-2xl mt-1 leading-tight">{service.title}</CardTitle>
                    </div>
                    <CardDescription className="mb-6">{service.description}</CardDescription>
                    <ul className="space-y-3">
                        {service.features.slice(0, 3).map((feature, index) => (
                            <li key={index} className="flex items-start gap-3">
                                <CheckCircle2 className="h-4 w-4 mt-1 text-accent flex-shrink-0" />
                                <span className="text-sm text-muted-foreground">{feature}</span>
                            </li>
                        ))}
                    </ul>
                 </CardContent>
                 <div className="p-6 pt-0">
                    <Button asChild variant="outline" className="w-full">
                        <Link href={`/services/${service.slug}`}>Learn More</Link>
                    </Button>
                 </div>
               </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="clients" className="py-16 md:py-24">
        <div className="container">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Clients we are proud of</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              We've had the privilege of working with some of the most innovative companies and visionary startups to bring their ideas to life.
            </p>
          </div>
          <div className="mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col text-center items-center p-6">
                <div className="mb-4">{stat.icon}</div>
                <p className="text-4xl font-bold text-primary">{stat.value}</p>
                <p className="text-muted-foreground mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-16">
            <div className="flex items-center justify-center gap-x-8 gap-y-4 flex-wrap">
              {clientsData.map((client) => (
                <div key={client.id} title={client.name}>
                  <Image
                    src={client.logoUrl}
                    alt={`${client.name} Logo`}
                    width={150}
                    height={60}
                    className="object-contain grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300"
                    data-ai-hint={client.dataAiHint}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      <section id="testimonials" className="py-16 md:py-24 bg-secondary">
        <div className="container">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">What Our Clients Say</h2>
             <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Hear from our partners about their experience working with us.
            </p>
          </div>
          {testimonialsData.length > 0 ? (
             <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full max-w-3xl mx-auto"
            >
              <CarouselContent>
                {testimonialsData.map((testimonial) => (
                  <CarouselItem key={testimonial.id}>
                    <div className="p-1">
                      <Card>
                        <CardContent className="p-8 flex flex-col justify-between h-full">
                          <div>
                            <div className="flex gap-1 mb-4 text-primary">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className={i < testimonial.rating ? 'fill-current' : 'fill-current text-muted-foreground/30'} />
                              ))}
                            </div>
                            <blockquote className="text-lg italic text-muted-foreground mb-6">
                              "{testimonial.quote}"
                            </blockquote>
                          </div>
                          <div className="flex items-center gap-4 mt-auto">
                            <Avatar>
                              <AvatarImage src={testimonial.avatarUrl} alt={testimonial.authorName} />
                              <AvatarFallback>{testimonial.authorName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold">{testimonial.authorName}</p>
                              <p className="text-sm text-muted-foreground">{testimonial.authorTitle}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          ) : (
             <p className="text-center text-muted-foreground mt-8">No testimonials yet. Check back soon!</p>
          )}
        </div>
      </section>

      <section id="cta" className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">{contentData.cta.headline}</h2>
            <p className="max-w-[800px] text-primary-foreground/80 md:text-xl">
              {contentData.cta.subtext}
            </p>
            <Button asChild size="lg" variant="outline" className="mt-4 bg-transparent border-primary-foreground/80 text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <Link href={contentData.cta.ctaLink}>{contentData.cta.ctaText}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
