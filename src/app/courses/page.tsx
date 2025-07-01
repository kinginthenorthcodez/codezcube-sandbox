
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function CoursesPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-secondary/50">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:gap-16 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl text-primary">
                Courses & Career Paths
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Empower your future with our industry-focused courses and expert career guidance. Start your learning journey today.
              </p>
            </div>
            <div className="flex items-center justify-center">
              <Image
                src="https://placehold.co/600x400.png"
                width={600}
                height={400}
                alt="Courses and Career Paths"
                className="mx-auto overflow-hidden rounded-xl object-cover object-center shadow-lg"
                data-ai-hint="people teaching whiteboard"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Courses Section */}
      <section id="our-courses" className="py-16 md:py-24">
        <div className="container text-center">
          <div className="flex flex-col items-center justify-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Our Courses</h2>
            <p className="max-w-[700px] mx-auto text-muted-foreground md:text-lg">
              No courses available at the moment. Check back soon!
            </p>
          </div>
        </div>
      </section>

      {/* Career Development Section */}
      <section id="career-advice" className="py-16 md:py-24 bg-secondary/50">
        <div className="container text-center">
          <div className="flex flex-col items-center justify-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Career Development & Advice</h2>
            <p className="max-w-[700px] mx-auto text-muted-foreground md:text-lg">
              No career advice articles found. Please ensure they are added to the 'careerAdvice' collection in Firestore with the correct fields (title, content, description, order).
            </p>
             <Button asChild className="mt-4">
              <Link href="/blog">Read Career Articles</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="py-16 md:py-24">
        <div className="container">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Ready to Upskill?</h2>
            <p className="max-w-[800px] text-muted-foreground md:text-xl">
              Invest in yourself with Codezcube. Our courses are designed to equip you with the skills needed for tomorrow's tech landscape.
            </p>
            <Button asChild size="lg" className="mt-4">
              <Link href="/booking">Enroll or Inquire Now</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
