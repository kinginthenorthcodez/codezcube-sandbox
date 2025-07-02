import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default async function PortfolioPage() {
  return (
    <div className="container py-16 md:py-24">
      <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">Our Portfolio</h1>
        <p className="max-w-[900px] text-muted-foreground md:text-xl">
          A glimpse into the impactful solutions we've delivered for our clients.
        </p>
      </div>
       <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-center">Coming Soon!</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-center text-lg">
            We are currently building the admin functionality to manage portfolio projects. Please check back later!
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}
