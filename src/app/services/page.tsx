import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, Cpu, School, Users, Briefcase, Bot } from "lucide-react";

const services = [
  {
    icon: <Code className="w-10 h-10 text-primary" />,
    title: "Web & Mobile Development",
    description: "We design and develop beautiful, responsive, and high-performance websites and mobile applications tailored to your business needs. From simple landing pages to complex enterprise-level apps, we've got you covered.",
  },
  {
    icon: <Cpu className="w-10 h-10 text-primary" />,
    title: "AI/ML Solutions",
    description: "Unlock the power of your data with our custom AI and Machine Learning solutions. We help you build intelligent systems for automation, prediction, and data analysis to gain a competitive edge.",
  },
  {
    icon: <School className="w-10 h-10 text-primary" />,
    title: "EdTech Product Development",
    description: "As specialists in educational technology, we create innovative digital learning platforms, tools, and content that engage learners and empower educators across Africa.",
  },
  {
    icon: <Users className="w-10 h-10 text-primary" />,
    title: "IT Staffing & Talent Sourcing",
    description: "Finding the right tech talent can be challenging. We connect you with our network of vetted developers, engineers, and IT professionals from across the continent to build your dream team.",
  },
  {
    icon: <Briefcase className="w-10 h-10 text-primary" />,
    title: "Technology Consultation",
    description: "Navigate the complex tech landscape with confidence. Our expert consultants provide strategic guidance on digital transformation, IT infrastructure, and technology roadmapping.",
  },
  {
    icon: <Bot className="w-10 h-10 text-primary" />,
    title: "Innovation Labs",
    description: "Partner with us in CodezCube Labs to incubate new ideas, build prototypes, and launch groundbreaking products. We provide the technical expertise and environment for innovation to thrive.",
  },
];

export default function ServicesPage() {
  return (
    <div className="container py-16 md:py-24">
      <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">Our Services</h1>
        <p className="max-w-[900px] text-muted-foreground md:text-xl">
          A full spectrum of technology services to fuel your growth and innovation.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service) => (
          <Card key={service.title} className="flex flex-col hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex items-center text-center">
              {service.icon}
              <CardTitle className="mt-4">{service.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription>{service.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
