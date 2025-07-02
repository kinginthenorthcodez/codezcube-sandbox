
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { getSiteConfiguration, updateSiteConfiguration } from "@/lib/actions";
import { type SiteConfiguration } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const configSchema = z.object({
  socialLinks: z.object({
    github: z.string().url("Please enter a valid URL.").or(z.literal('')),
    twitter: z.string().url("Please enter a valid URL.").or(z.literal('')),
    linkedin: z.string().url("Please enter a valid URL.").or(z.literal('')),
  }),
});

export function SiteConfigurationManager() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isLoadingData, setIsLoadingData] = React.useState(true);

  const form = useForm<SiteConfiguration>({
    resolver: zodResolver(configSchema),
    defaultValues: {
      socialLinks: { github: "", twitter: "", linkedin: "" },
    },
  });

  React.useEffect(() => {
    async function loadData() {
      setIsLoadingData(true);
      const config = await getSiteConfiguration();
      if (config) {
        form.reset(config);
      }
      setIsLoadingData(false);
    }
    loadData();
  }, [form]);

  const onSubmit = async (data: SiteConfiguration) => {
    setIsSubmitting(true);
    const result = await updateSiteConfiguration(data);
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
          <CardTitle>Site Configuration</CardTitle>
          <CardDescription>Manage global site settings like social media links.</CardDescription>
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
        <CardTitle>Site Configuration</CardTitle>
        <CardDescription>Manage global site settings like social media links.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div>
              <h3 className="text-lg font-medium mb-4">Social Media Links</h3>
              <div className="space-y-4 pl-4 border-l-2">
                <FormField control={form.control} name="socialLinks.github" render={({ field }) => (
                  <FormItem>
                    <FormLabel>GitHub URL</FormLabel>
                    <FormControl><Input placeholder="https://github.com/your-profile" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="socialLinks.twitter" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Twitter/X URL</FormLabel>
                    <FormControl><Input placeholder="https://twitter.com/your-profile" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="socialLinks.linkedin" render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn URL</FormLabel>
                    <FormControl><Input placeholder="https://linkedin.com/in/your-profile" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </div>
            
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Configuration
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
