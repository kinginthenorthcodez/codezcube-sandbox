
import { getSiteConfiguration } from "@/lib/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function CookiePolicyPage() {
  const config = await getSiteConfiguration();

  return (
    <div className="container py-16 md:py-24">
      <Card>
        <CardHeader>
          <CardTitle className="text-4xl font-bold tracking-tighter sm:text-5xl">Cookie Policy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-lg dark:prose-invert max-w-none mx-auto">
            {config.cookiePolicy?.split('\n').filter(p => p.trim() !== '').map((paragraph, i) => <p key={i}>{paragraph}</p>)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
