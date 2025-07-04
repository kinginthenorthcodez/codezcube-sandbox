
import { getCourseBySlug, getCourses } from "@/lib/actions";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, BarChart, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export async function generateStaticParams() {
    const courses = await getCourses();
    return courses.map((course) => ({
        slug: course.slug,
    }));
}

export default async function CourseDetailPage({ params }: { params: { slug: string } }) {
    const course = await getCourseBySlug(params.slug);

    if (!course) {
        notFound();
    }

    return (
        <div className="container py-16 md:py-24">
            <div className="mb-12">
                <Button asChild variant="outline">
                    <Link href="/courses">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to All Courses
                    </Link>
                </Button>
            </div>
            
            <header className="grid md:grid-cols-2 gap-12 items-center mb-16">
                 <div>
                    <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl text-primary mb-4">{course.title}</h1>
                    <p className="text-lg text-muted-foreground mb-6">{course.description}</p>
                    <div className="flex items-center gap-6 text-muted-foreground">
                        <Badge variant="secondary" className="text-base py-1 px-3 flex items-center gap-2"><BarChart className="h-4 w-4" /> {course.level}</Badge>
                        <div className="flex items-center gap-2 text-base"><Clock className="h-4 w-4" /> {course.duration}</div>
                    </div>
                 </div>
                 <div className="relative aspect-video">
                    <Image 
                        src={course.imageUrl || 'https://placehold.co/600x400.png'}
                        alt={course.title}
                        fill
                        className="rounded-lg shadow-lg object-cover w-full h-auto"
                        data-ai-hint={course.dataAiHint}
                    />
                 </div>
            </header>

            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">What You'll Learn</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                        {course.modules.map((module, index) => (
                            <li key={index} className="flex items-start gap-3">
                                <CheckCircle className="h-5 w-5 mt-0.5 text-primary flex-shrink-0" />
                                <span className="text-muted-foreground">{module}</span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>

            <div className="mt-16 text-center border-t pt-12">
                 <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Ready to Take the Next Step?</h2>
                 <p className="max-w-[700px] mx-auto text-muted-foreground md:text-lg my-4">
                     Whether you're ready to enroll or just have a few questions, we're here to help you on your learning journey.
                 </p>
                 <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button asChild size="lg">
                        <Link href={`/contact?subject=${encodeURIComponent(`Enrollment Inquiry: ${course.title}`)}&message=${encodeURIComponent(`I'm interested in enrolling in the "${course.title}" course. Please provide me with more details on the next steps.`)}`}>
                            Enroll Now
                        </Link>
                    </Button>
                    <Button asChild size="lg" variant="outline">
                        <Link href={`/contact?subject=${encodeURIComponent(`Question About: ${course.title}`)}`}>
                            Inquire
                        </Link>
                    </Button>
                 </div>
            </div>
        </div>
    );
}
