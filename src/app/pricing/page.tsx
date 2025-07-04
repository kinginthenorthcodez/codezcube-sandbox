
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, DollarSign, Download, Mail, MessageSquare, ShieldCheck, Users, Bot, Briefcase, BarChart, Settings, Globe, CircleDollarSign, PlusCircle, Palette } from 'lucide-react';
import Link from 'next/link';

const pricingData = {
  web: {
    title: "Web & App Development",
    icon: <Briefcase className="h-6 w-6" />,
    plans: [
      { plan: "Starter", price: "$499 (one time)", includes: "1 page static site, responsive design, basic contact form" },
      { plan: "Pro", price: "$1,200-$2,000", includes: "5-10 page site, blog, animations, contact + newsletter forms" },
      { plan: "App MVP", price: "$3,500+", includes: "Custom Next.js/Flutter app, up to 4 screens" },
    ],
    addOns: "E-commerce ($700+), SEO setup ($150), CMS integration ($300)",
  },
  ai: {
    title: "AI Tools & Automation",
    icon: <Bot className="h-6 w-6" />,
    plans: [
      { plan: "Starter Bot", price: "$200-$490", includes: "WhatsApp/Telegram chatbot using DialogFlow or GPT" },
      { plan: "Automation Kit", price: "$700+", includes: "Automation with Zapier/Make, etc." },
      { plan: "AI SaaS Build", price: "Custom Quote", includes: "Custom AI/ML tool or platform" },
    ],
    addOns: "API integration ($250+), GPT-4 engine ($200/month)",
  },
  training: {
    title: "Digital Skills & Training",
    icon: <Users className="h-6 w-6" />,
    plans: [
      { plan: "Single Course", price: "$49", includes: "Lifetime access to one course" },
      { plan: "Bootcamp Pass", price: "$199 / person", includes: "4-week structured training + community access" },
      { plan: "Corporate Package", price: "$799+", includes: "Custom training for teams (x10 participants)" },
    ],
    addOns: "Certification, LMS access, WhatsApp group mentoring",
  },
  data: {
    title: "Data & Business Intelligence",
    icon: <BarChart className="h-6 w-6" />,
    plans: [
      { plan: "Dash Mini", price: "$350", includes: "Single GDS/Data Studio dashboard" },
      { plan: "ETL Package", price: "$950+", includes: "Custom data pipeline (SQL/BigQuery/etc.)" },
      { plan: "BI Suite", price: "$2,000+", includes: "Full data warehouse + dashboards" },
    ],
    addOns: "",
  },
  digitalGraphics: {
    title: "Digital Graphics & Design",
    icon: <Palette className="h-6 w-6" />,
    plans: [
      { plan: "Logo & Branding Kit", price: "$250+", includes: "Custom logo design, color palette, typography guidelines" },
      { plan: "Social Media Pack", price: "$150/month", includes: "10 social media graphics, post templates, profile banners" },
      { plan: "Presentation Design", price: "$400+", includes: "Custom PowerPoint/Google Slides template, up to 20 slides" },
    ],
    addOns: "Custom illustrations ($50/hr), UI/UX mockups (Custom Quote)",
  },
  cyberSecurity: {
    title: "Cyber Security",
    icon: <ShieldCheck className="h-6 w-6" />,
    plans: [
      { plan: "Vulnerability Scan", price: "$500 (one time)", includes: "Comprehensive scan of one web application for known vulnerabilities (e.g., OWASP Top 10)." },
      { plan: "Penetration Test", price: "$2,500+", includes: "Simulated cyber-attack against your system to check for exploitable vulnerabilities." },
      { plan: "Security Retainer", price: "Custom Quote", includes: "Ongoing security monitoring, incident response, and regular audits." },
    ],
    addOns: "Phishing simulation campaign ($400), Employee security training ($300+)",
  },
  maintenance: {
    title: "Maintenance & Support Plans",
    icon: <Settings className="h-6 w-6" />,
    plans: [
      { plan: "Basic", price: "$49", includes: "Uptime monitoring, backups, security patches" },
      { plan: "Growth", price: "$149", includes: "Bug fixes, analytics reports, 2 updates/month" },
      { plan: "Scale", price: "$299", includes: "SLA support, AI enhancements, unlimited updates" },
    ],
    addOns: "",
  },
};

const PricingSection = ({ section }: { section: (typeof pricingData)[keyof typeof pricingData] }) => (
  <div className="mb-12">
    <div className="flex items-center gap-3 mb-4">
        <div className="bg-primary/10 text-primary p-2 rounded-full">
            {section.icon}
        </div>
        <h2 className="text-2xl font-bold">{section.title}</h2>
    </div>
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[25%]">Plan</TableHead>
            <TableHead className="w-[25%]">Price (USD)</TableHead>
            <TableHead>Includes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {section.plans.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{item.plan}</TableCell>
              <TableCell>{item.price}</TableCell>
              <TableCell>{item.includes}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
    {section.addOns && (
      <p className="text-sm text-muted-foreground mt-3">
        <span className="font-semibold text-foreground">Add-ons:</span> {section.addOns}
      </p>
    )}
  </div>
);

export default function PricingPage() {
  return (
    <div className="container py-16 md:py-24">
      <Card className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div className="flex items-start gap-4">
                <div className="hidden sm:block bg-primary/10 text-primary p-3 rounded-full mt-1">
                    <DollarSign className="h-8 w-8" />
                </div>
                <div>
                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tighter">CodezCube Services & Pricing</h1>
                    <p className="text-muted-foreground mt-2 max-w-2xl">
                        Transparent pricing. Scalable solutions. Built to grow with your business.
                    </p>
                </div>
            </div>
            <Button variant="outline" className="w-full md:w-auto flex-shrink-0">
                <Download className="mr-2" />
                Download PDF
            </Button>
        </div>

        <div className="space-y-8">
            <PricingSection section={pricingData.web} />
            <PricingSection section={pricingData.ai} />
            <PricingSection section={pricingData.training} />
            <PricingSection section={pricingData.data} />
            <PricingSection section={pricingData.digitalGraphics} />
            <PricingSection section={pricingData.cyberSecurity} />
            <PricingSection section={pricingData.maintenance} />
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 mt-12">
             <Card className="bg-secondary/50">
                <CardHeader className="flex-row items-center gap-3 space-y-0">
                    <div className="bg-primary/10 text-primary p-2 rounded-full"><Globe className="h-5 w-5" /></div>
                    <CardTitle className="text-xl">Special for African Startups & NGOs</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2 text-muted-foreground list-disc pl-5">
                        <li>Subsidized pricing & grants available</li>
                        <li>Ask about local currency billing or community sponsorship</li>
                    </ul>
                </CardContent>
            </Card>
            <Card className="bg-secondary/50">
                <CardHeader className="flex-row items-center gap-3 space-y-0">
                    <div className="bg-primary/10 text-primary p-2 rounded-full"><PlusCircle className="h-5 w-5" /></div>
                    <CardTitle className="text-xl">Optional Add-ons</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2 text-muted-foreground list-disc pl-5">
                        <li>SSL & Hosting Setup - $59 one-time</li>
                        <li>Domain & Email Integration - $49/year</li>
                        <li>Content & SEO - $250/page</li>
                        <li>Graphic Design - $35/hour</li>
                    </ul>
                </CardContent>
            </Card>
        </div>
        
        <div className="mt-12 text-center border-t pt-8">
            <h2 className="text-2xl font-bold mb-2">Let's Build Together</h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-x-6 gap-y-2 text-muted-foreground">
                <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <a href="mailto:hello@codezcube.com" className="hover:text-primary">hello@codezcube.com</a>
                </div>
                <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                     <Link href="/contact" className="hover:text-primary">Contact Us</Link>
                </div>
            </div>
        </div>
      </Card>
    </div>
  );
}
