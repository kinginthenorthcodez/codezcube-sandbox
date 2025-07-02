"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { getHomepageContent, updateHomepageContent } from "@/lib/actions";
import { type HomepageContent } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const contentSchema = z.object({
  hero: z.object({
    headline: z.string().min(1, "Headline is required."),
    subtext: z.string().min(1, "Subtext is required."),
    ctaText: z.string().min(1, "CTA button text is required."),
    ctaLink: z.string().min(1, "CTA button link is required."),
  }),
  cta: z.object({
    headline: z.string().min(1, "Headline is required."),
    subtext: z.string().min(1, "Subtext is required."),
    ctaText: z.string().min(1, "CTA button text is required."),
    ctaLink: z.string().min(1, "CTA button link is required."),
  }),
});

export function HomepageContentManager() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isLoadingData, setIsLoadingData] = React.useState(true);

  const form = useForm<HomepageContent>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      hero: { headline: "", subtext: "", ctaText: "", ctaLink: "" },
      cta: { headline: "", subtext: "", ctaText: "", ctaLink: "" },
    },
  });

  React.useEffect(() => {
    async function loadData() {
      setIsLoadingData(true);
      const content = await getHomepageContent();
      if (content) {
        form.reset(content);
      }
      setIsLoadingData(false);
    }
    loadData();
  }, [form]);

  const onSubmit = async (data: HomepageContent) => {
    setIsSubmitting(true);
    const result = await updateHomepageContent(data);
    if (result.success) {
      toast({
        title: "Success!",
        description: result.message,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.message,
      });
    }
    setIsSubmitting(false);
  };

  if (isLoadingData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Manage Homepage Content</CardTitle>
          <CardDescription>Update the text and links for key sections of your homepage.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Homepage Content</CardTitle>
        <CardDescription>Update the text and links for key sections of your homepage.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div>
              <h3 className="text-lg font-medium mb-4">Hero Section</h3>
              <div className="space-y-4 pl-4 border-l-2 border-primary">
                <FormField control={form.control} name="hero.headline" render={({ field }) => (
                  <FormItem><FormLabel>Headline</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="hero.subtext" render={({ field }) => (
                  <FormItem><FormLabel>Subtext</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="hero.ctaText" render={({ field }) => (
                  <FormItem><FormLabel>Button Text</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="hero.ctaLink" render={({ field }) => (
                  <FormItem><FormLabel>Button Link</FormLabel><FormControl><Input placeholder="/example-page" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
            </div>

            <Separator />
            
            <div>
              <h3 className="text-lg font-medium mb-4">Main Call-to-Action Section</h3>
              <div className="space-y-4 pl-4 border-l-2 border-accent">
                <FormField control={form.control} name="cta.headline" render={({ field }) => (
                  <FormItem><FormLabel>Headline</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="cta.subtext" render={({ field }) => (
                  <FormItem><FormLabel>Subtext</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="cta.ctaText" render={({ field }) => (
                  <FormItem><FormLabel>Button Text</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="cta.ctaLink" render={({ field }) => (
                  <FormItem><FormLabel>Button Link</FormLabel><FormControl><Input placeholder="/example-page" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
            </div>
            
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save All Changes
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
