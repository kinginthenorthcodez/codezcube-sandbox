
import { getSiteConfiguration } from "@/lib/actions";
import { CalendlyEmbed } from "./calendly-embed";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";

export default async function BookingPage() {
  const config = await getSiteConfiguration();

  return (
    <div className="container py-16 md:py-24">
       <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="mx-auto bg-primary/10 text-primary p-4 rounded-full w-fit mb-4">
                <Calendar className="h-10 w-10" />
            </div>
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">Book a Consultation</h1>
            <p className="max-w-[900px] text-muted-foreground md:text-xl">
                Schedule a free 30-minute consultation with our team to discuss your project. Choose a time that works for you below.
            </p>
        </div>
      
      {config.calendlyUrl ? (
        <Card className="min-h-[700px] w-full overflow-hidden">
            <CardContent className="p-0 sm:p-2 h-full">
                <CalendlyEmbed url={config.calendlyUrl} />
            </CardContent>
        </Card>
      ) : (
        <Card>
            <CardHeader>
                <CardTitle className="text-center">Booking Unavailable</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-center text-muted-foreground">The booking system is not configured yet. Please check back later or contact us directly.</p>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
