import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Briefcase, Zap, BarChartBig, Star } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const stats = [
  {
    icon: <Briefcase className="w-8 h-8 text-primary" />,
    value: '50+',
    label: 'Projects Completed',
  },
  {
    icon: <Zap className="w-8 h-8 text-primary" />,
    value: '98%',
    label: 'Client Satisfaction',
  },
  {
    icon: <BarChartBig className="w-8 h-8 text-primary" />,
    value: '5+',
    label: 'Years of Experience',
  },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      <section className="py-24 sm:py-32 md:py-40">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col justify-center space-y-6">
              <h1 className="text-5xl font-bold tracking-tighter sm:text-6xl xl:text-7xl/none text-primary">
                Innovate. Build. Empower.
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Codezcube delivers cutting-edge Web Development, Mobile Development, AI/ML, and EdTech solutions to transform your ideas into reality.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg">
                  <Link href="/services">Discover Our Services</Link>
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <Image
                src="https://placehold.co/600x500.png"
                width={600}
                height={500}
                alt="Hero Image"
                className="mx-auto aspect-square overflow-hidden rounded-xl object-cover object-center"
                data-ai-hint="developer holding phone"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="offerings" className="py-16 md:py-24 bg-secondary">
        <div className="container">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Our Core Offerings</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              We provide a comprehensive suite of technology services designed to elevate your business, from initial concept to final deployment.
            </p>
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
        </div>
      </section>
      
      <section id="testimonials" className="py-16 md:py-24 bg-secondary">
        <div className="container">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">What Our Clients Say</h2>
          </div>
          <div className="mt-12 max-w-3xl mx-auto">
            <Card>
              <CardContent className="p-8">
                <div className="flex gap-1 mb-4 text-primary">
                    <Star className="fill-current" />
                    <Star className="fill-current" />
                    <Star className="fill-current" />
                    <Star className="fill-current" />
                    <Star className="fill-current" />
                </div>
                <blockquote className="text-lg italic text-muted-foreground">
                  "Working with Codezcube was a game-changer for our organization. Their team is not only technically proficient but also deeply committed to our success. They delivered beyond our expectations."
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
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Ready to Elevate Your Business?</h2>
            <p className="max-w-[800px] text-primary-foreground/80 md:text-xl">
              Let's discuss how Codezcube can help you achieve your goals with our innovative tech solutions. Schedule a free consultation today!
            </p>
            <Button asChild size="lg" variant="secondary" className="bg-accent text-accent-foreground hover:bg-accent/90 mt-4">
              <Link href="/booking">Book a Free Consultation</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
