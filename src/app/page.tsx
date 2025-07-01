import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Code, Cpu, School, Users, Star } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const services = [
  {
    icon: <Code className="w-8 h-8 text-primary" />,
    title: 'Web & Mobile Development',
    description: 'Crafting bespoke, high-performance web and mobile applications that drive business growth.',
  },
  {
    icon: <Cpu className="w-8 h-8 text-primary" />,
    title: 'AI/ML Solutions',
    description: 'Leveraging artificial intelligence and machine learning to build intelligent systems and unlock data-driven insights.',
  },
  {
    icon: <School className="w-8 h-8 text-primary" />,
    title: 'EdTech Products',
    description: 'Developing innovative educational technology to transform learning experiences in Africa and beyond.',
  },
  {
    icon: <Users className="w-8 h-8 text-primary" />,
    title: 'IT Staffing & Consultation',
    description: 'Connecting businesses with top-tier tech talent and providing expert IT strategy consulting.',
  },
];

const portfolio = [
  {
    title: "SME E-commerce Platform",
    category: "Web Development",
    image: "https://placehold.co/600x400.png",
    hint: "online store"
  },
  {
    title: "AI-Powered Learning Assistant",
    category: "AI/ML",
    image: "https://placehold.co/600x400.png",
    hint: "robot chatbot"
  },
  {
    title: "National NGO Digital Portal",
    category: "Web Development",
    image: "https://placehold.co/600x400.png",
    hint: "community website"
  },
    {
    title: "Mobile App for Farmers",
    category: "Mobile Development",
    image: "https://placehold.co/600x400.png",
    hint: "agriculture app"
  },
]

export default function Home() {
  return (
    <div className="flex flex-col">
      <section className="bg-secondary/50 py-24 sm:py-32 md:py-40">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col justify-center space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Building the Future of Tech in Africa
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                CodezCube is your partner in innovation, offering cutting-edge web services, AI solutions, and educational programs to empower businesses and talent across the continent.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg">
                  <Link href="/services">Our Services</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
             <div className="flex items-center justify-center">
              <Image
                src="https://placehold.co/600x400.png"
                width={600}
                height={400}
                alt="Hero Image"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center"
                data-ai-hint="technology team"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="py-16 md:py-24">
        <div className="container">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Our Core Services</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              We provide a comprehensive suite of technology services designed to elevate your business.
            </p>
          </div>
          <div className="mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            {services.map((service) => (
              <Card key={service.title} className="flex flex-col text-center items-center p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="mb-4">{service.icon}</div>
                <CardHeader className="p-0">
                  <CardTitle className="text-lg">{service.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-0 mt-2">
                  <CardDescription>{service.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="portfolio" className="py-16 md:py-24 bg-secondary/50">
        <div className="container">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Our Portfolio</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Discover a selection of our successful projects and case studies.
            </p>
          </div>
          <div className="relative mt-12">
            <Carousel opts={{ align: "start", loop: true }} className="w-full">
              <CarouselContent>
                {portfolio.map((item, index) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-1">
                      <Card className="overflow-hidden">
                        <CardContent className="p-0">
                          <Image
                            src={item.image}
                            alt={item.title}
                            width={600}
                            height={400}
                            className="w-full h-48 object-cover"
                            data-ai-hint={item.hint}
                          />
                          <div className="p-4">
                            <Badge variant="secondary" className="mb-2">{item.category}</Badge>
                            <h3 className="text-lg font-semibold">{item.title}</h3>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute left-[-50px] top-1/2 -translate-y-1/2 fill-black" />
              <CarouselNext className="absolute right-[-50px] top-1/2 -translate-y-1/2 fill-black" />
            </Carousel>
          </div>
           <div className="text-center mt-12">
             <Button asChild variant="outline">
              <Link href="/portfolio">View All Projects <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>
      
      <section id="testimonials" className="py-16 md:py-24">
        <div className="container">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">What Our Clients Say</h2>
          </div>
          <div className="mt-12 max-w-3xl mx-auto">
            <Card>
              <CardContent className="p-8">
                <div className="flex gap-1 mb-4">
                    <Star className="text-accent fill-accent" />
                    <Star className="text-accent fill-accent" />
                    <Star className="text-accent fill-accent" />
                    <Star className="text-accent fill-accent" />
                    <Star className="text-accent fill-accent" />
                </div>
                <blockquote className="text-lg italic text-muted-foreground">
                  "Working with CodezCube was a game-changer for our organization. Their team is not only technically proficient but also deeply committed to our success. They delivered beyond our expectations."
                </blockquote>
                <div className="flex items-center gap-4 mt-6">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">Jane Doe</p>
                    <p className="text-sm text-muted-foreground">CEO, Acme Inc.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="cta" className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Ready to Start Your Project?</h2>
            <p className="max-w-[600px] text-primary-foreground/80 md:text-xl">
              Let's build something amazing together. Book a free consultation to discuss your ideas.
            </p>
            <Button asChild size="lg" variant="secondary" className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href="/booking">Book a Free Consultation</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
