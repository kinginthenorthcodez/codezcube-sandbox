import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Clock, BarChart, Users } from 'lucide-react';

const courses = [
  {
    title: "Introduction to React & Next.js",
    description: "Master the fundamentals of modern web development with React and Next.js. Build high-performance, server-rendered applications.",
    category: "Web Development",
    level: "Beginner",
    duration: "8 Weeks",
    image: "https://placehold.co/600x400.png",
    hint: "code screen",
  },
  {
    title: "Machine Learning Foundations",
    description: "Dive into the world of AI with this comprehensive course on machine learning algorithms, data preprocessing, and model evaluation.",
    category: "AI/ML",
    level: "Intermediate",
    duration: "12 Weeks",
    image: "https://placehold.co/600x400.png",
    hint: "neural network",
  },
  {
    title: "UI/UX Design for Developers",
    description: "Learn the principles of user-centric design and create intuitive, beautiful interfaces for your web and mobile applications.",
    category: "Design",
    level: "Beginner",
    duration: "6 Weeks",
    image: "https://placehold.co/600x400.png",
    hint: "wireframe design",
  },
  {
    title: "Advanced Node.js & Backend Systems",
    description: "Scale your backend development skills. Learn about microservices, API design, databases, and system architecture with Node.js.",
    category: "Web Development",
    level: "Advanced",
    duration: "10 Weeks",
    image: "https://placehold.co/600x400.png",
    hint: "server database",
  },
];

export default function CoursesPage() {
  return (
    <div className="container py-16 md:py-24">
      <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">Courses & Career Paths</h1>
        <p className="max-w-[900px] text-muted-foreground md:text-xl">
          Upskill with our expert-led courses and accelerate your career in technology.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course, index) => (
          <Card key={index} className="overflow-hidden flex flex-col group">
            <CardContent className="p-0">
              <Image
                src={course.image}
                alt={course.title}
                width={600}
                height={400}
                className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                data-ai-hint={course.hint}
              />
            </CardContent>
            <CardHeader className="p-6">
              <Badge variant="default" className="w-fit mb-2 bg-accent text-accent-foreground">{course.category}</Badge>
              <CardTitle className="text-xl">{course.title}</CardTitle>
              <CardDescription>{course.description}</CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0 flex-1">
              <div className="flex justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <BarChart className="h-4 w-4" />
                  <span>{course.level}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{course.duration}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-6 bg-secondary/50">
              <Button asChild className="w-full">
                <Link href="#">Enroll Now</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
