import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function BlogPage() {
  return (
    <div className="container py-16 md:py-24">
      <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">Our Blog & Knowledge Base</h1>
        <p className="max-w-[900px] text-muted-foreground md:text-xl">
          Insights on technology, case studies, and thought leadership from the CodezCube team.
        </p>
      </div>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-center">Coming Soon!</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-center text-lg">
            We are currently building the admin functionality to manage blog posts. Please check back later!
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}
