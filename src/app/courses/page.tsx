
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getCourses, getBlogPosts } from '@/lib/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, GraduationCap, Clock, BarChart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default async function CoursesPage() {
  const courses = await getCourses();
  const blogPosts = await getBlogPosts();
  const latestPosts = blogPosts.slice(0, 3);

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
                src="https://firebasestorage.googleapis.com/v0/b/codezcube-sandbox.firebasestorage.app/o/images%2Fundraw_educator_6dgp.svg?alt=media&token=f18d2a38-ee4d-4996-9575-6e6f65e1b287"
                width={600}
                height={400}
                alt="Courses and Career Paths"
                className="mx-auto overflow-hidden rounded-xl object-cover object-center shadow-lg"
                data-ai-hint="educator teaching"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Courses Section */}
      <section id="our-courses" className="py-16 md:py-24">
        <div className="container">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Our Courses</h2>
            <p className="max-w-[700px] mx-auto text-muted-foreground md:text-lg">
              Explore our curated list of courses designed to equip you with in-demand tech skills.
            </p>
          </div>
          {courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map(course => (
                <Card key={course.id} className="flex flex-col overflow-hidden group">
                  <div className="relative overflow-hidden">
                    <Image
                      src={course.imageUrl || 'https://placehold.co/600x400.png'}
                      alt={course.title}
                      width={600}
                      height={400}
                      className="object-cover w-full h-48 transition-transform duration-300 ease-in-out group-hover:scale-105"
                      data-ai-hint={course.dataAiHint}
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl">{course.title}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
                        <Badge variant="outline" className="flex items-center gap-1.5"><BarChart className="h-3.5 w-3.5" /> {course.level}</Badge>
                        <div className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {course.duration}</div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground line-clamp-3">{course.description}</p>
                  </CardContent>
                  <CardContent>
                    <Button asChild className="w-full">
                      <Link href={`/courses/${course.slug}`}>
                        View Details <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
             <div className="flex flex-col items-center justify-center text-center py-16">
                <div className="bg-primary/10 text-primary p-4 rounded-full mb-6">
                    <GraduationCap className="h-12 w-12" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Courses Coming Soon!</h3>
                <p className="max-w-prose text-muted-foreground">
                    We're developing new courses to help you achieve your career goals. Check back soon for updates.
                </p>
            </div>
          )}
        </div>
      </section>

      {/* Career Development Section */}
      <section id="career-advice" className="py-16 md:py-24 bg-secondary/50">
        <div className="container">
           <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Career Development & Advice</h2>
            <p className="max-w-[700px] mx-auto text-muted-foreground md:text-lg">
              Gain insights from our latest articles on career growth, industry trends, and skill development.
            </p>
          </div>
           {latestPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestPosts.map(post => (
                <Card key={post.id} className="flex flex-col overflow-hidden group">
                    <Link href={`/blog/${post.slug}`} className="block">
                        <div className="relative overflow-hidden aspect-video">
                            <Image
                                src={post.imageUrl || 'https://placehold.co/600x400.png'}
                                alt={post.title}
                                width={600}
                                height={400}
                                className="object-cover w-full transition-transform duration-300 ease-in-out group-hover:scale-105"
                                data-ai-hint="career advice blog"
                            />
                        </div>
                    </Link>
                    <CardHeader>
                        <CardTitle className="text-xl leading-tight hover:text-primary"><Link href={`/blog/${post.slug}`}>{post.title}</Link></CardTitle>
                         <CardDescription>{post.date} &middot; {post.category}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <p className="text-sm text-muted-foreground line-clamp-3">{post.excerpt}</p>
                    </CardContent>
                </Card>
              ))}
            </div>
           ) : (
             <p className="text-center text-muted-foreground">No career advice articles found. Please check back later.</p>
           )}
           <div className="text-center mt-12">
             <Button asChild>
                <Link href="/blog">Read All Articles <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
           </div>
        </div>
      </section>
    </div>
  );
}
