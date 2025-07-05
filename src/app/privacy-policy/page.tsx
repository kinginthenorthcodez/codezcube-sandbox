
import { getSiteConfiguration } from "@/lib/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default async function PrivacyPolicyPage() {
  const config = await getSiteConfiguration();

  return (
    <div className="container py-16 md:py-24">
      <Card>
        <CardHeader>
          <CardTitle className="text-4xl font-bold tracking-tighter sm:text-5xl">Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-lg dark:prose-invert max-w-none mx-auto">
             <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {config.privacyPolicy}
            </ReactMarkdown>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
