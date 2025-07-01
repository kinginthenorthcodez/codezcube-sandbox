import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Calendar } from "lucide-react";
import Link from "next/link";

export default function BookingPage() {
  return (
    <div className="container flex items-center justify-center min-h-[60vh] py-16 md:py-24">
      <Card className="w-full max-w-lg text-center">
        <CardHeader>
          <div className="mx-auto bg-primary/10 text-primary p-4 rounded-full w-fit mb-4">
            <Calendar className="h-10 w-10" />
          </div>
          <CardTitle className="text-3xl">Book a Consultation</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Schedule a free 30-minute consultation with our team to discuss your project.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-6">
            Click the button below to be redirected to our Calendly page where you can choose a time that works best for you. We look forward to speaking with you!
          </p>
          <Button asChild size="lg">
            <Link href="https://calendly.com" target="_blank" rel="noopener noreferrer">
              Go to Calendly <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
