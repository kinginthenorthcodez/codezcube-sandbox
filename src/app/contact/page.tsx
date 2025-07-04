
import { Suspense } from "react"
import { Mail, Phone, MapPin, Loader2 } from "lucide-react"
import { getSiteConfiguration } from "@/lib/actions"
import { ContactForm } from "./contact-form"

export default async function ContactPage() {
  const config = await getSiteConfiguration();
  const { contactInfo } = config;

  return (
    <div className="container py-16 md:py-24">
      <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">Get in Touch</h1>
        <p className="max-w-[900px] text-muted-foreground md:text-xl">
          Have a project in mind or just want to say hello? We'd love to hear from you.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-8">
            <h2 className="text-2xl font-bold">Contact Information</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                  <div className="bg-secondary p-3 rounded-md">
                      <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                      <h3 className="font-semibold">Email</h3>
                      <p className="text-muted-foreground">Reach out to us for any inquiries.</p>
                      <a href={`mailto:${contactInfo.email}`} className="text-primary hover:underline">{contactInfo.email}</a>
                  </div>
              </div>
              <div className="flex items-start gap-4">
                   <div className="bg-secondary p-3 rounded-md">
                      <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                      <h3 className="font-semibold">Phone</h3>
                      <p className="text-muted-foreground">Mon-Fri from 9am to 5pm.</p>
                      <a href={`tel:${contactInfo.phone.replace(/\s/g, '')}`} className="text-primary hover:underline">{contactInfo.phone}</a>
                  </div>
              </div>
              <div className="flex items-start gap-4">
                   <div className="bg-secondary p-3 rounded-md">
                      <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                      <h3 className="font-semibold">Office</h3>
                      <p className="text-muted-foreground">{contactInfo.addressLine1}</p>
                      <p className="text-primary">{contactInfo.addressLine2}</p>
                  </div>
              </div>
            </div>
        </div>
        <div>
          <Suspense fallback={
            <div className="flex items-center justify-center h-full min-h-[500px]">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          }>
            <ContactForm />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
