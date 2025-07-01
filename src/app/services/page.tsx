import Image from 'next/image';
import { Briefcase, Lightbulb, Users } from 'lucide-react';

const processSteps = [
  {
    step: "01",
    title: "Discovery & Planning",
    description: "Understand goals and define project scope.",
  },
  {
    step: "02",
    title: "Prototyping & Design",
    description: "Create wireframes and visual designs.",
  },
  {
    step: "03",
    title: "Development & Integration",
    description: "Build and integrate the core features.",
  },
  {
    step: "04",
    title: "Launch & Optimization",
    description: "Deploy, monitor, and improve the solution.",
  },
];

const whyChooseUs = [
    {
        icon: <Briefcase className="h-8 w-8 text-primary" />,
        title: "Expert Team",
        description: "Skilled professionals dedicated to your project's success."
    },
    {
        icon: <Lightbulb className="h-8 w-8 text-primary" />,
        title: "Innovative Solutions",
        description: "Cutting-edge technology tailored to your unique needs."
    },
    {
        icon: <Users className="h-8 w-8 text-primary" />,
        title: "Client-Focused",
        description: "Collaborative approach ensuring your vision is realized."
    }
]

export default function ServicesPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-secondary/50">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 items-center">
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
                src="https://placehold.co/600x400.png"
                width={600}
                height={400}
                alt="Expert Services"
                className="mx-auto overflow-hidden rounded-xl object-cover object-center"
                data-ai-hint="woman user interface"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Offerings Section */}
      <section id="offerings" className="py-16 md:py-24">
        <div className="container text-center">
          <div className="flex flex-col items-center justify-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Explore Our Offerings</h2>
            <p className="max-w-[700px] mx-auto text-muted-foreground md:text-lg">
              Our services are currently being updated. Please check back soon!
            </p>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="py-16 md:py-24 bg-secondary/50">
        <div className="container">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Our Planned Process</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-lg">
              A look into our structured approach for delivering exceptional results on future projects.
            </p>
          </div>
          <div className="relative max-w-5xl mx-auto">
            <div className="hidden md:block absolute top-8 left-0 w-full h-0.5 bg-border -translate-y-px" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
              {processSteps.map((step) => (
                <div key={step.step} className="flex flex-col items-center text-center">
                  <div className="mb-4 bg-primary text-primary-foreground rounded-full h-16 w-16 flex items-center justify-center text-2xl font-bold z-10 border-4 border-secondary/50">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm px-2">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section id="why-choose-us" className="py-16 md:py-24">
        <div className="container">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Why Choose Codezcube?</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-lg">
              At Codezcube, we're not just developers; we're your dedicated technology partners. We combine expertise with a passion for innovation to deliver solutions that exceed expectations and drive tangible results.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            {whyChooseUs.map((item) => (
              <div key={item.title} className="flex flex-col items-center text-center p-6 rounded-lg transition-colors">
                 <div className="mb-4 p-4 bg-primary/10 rounded-full">
                    {item.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
