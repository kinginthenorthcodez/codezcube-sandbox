"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { getHomepageStats, updateHomepageStats } from "@/lib/actions";
import { type HomepageStats } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const statsSchema = z.object({
  projectsCompleted: z.string().min(1, "This field is required."),
  clientSatisfaction: z.string().min(1, "This field is required."),
  yearsOfExperience: z.string().min(1, "This field is required."),
});

export function HomepageStatsForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isLoadingData, setIsLoadingData] = React.useState(true);

  const form = useForm<HomepageStats>({
    resolver: zodResolver(statsSchema),
    defaultValues: {
      projectsCompleted: "",
      clientSatisfaction: "",
      yearsOfExperience: "",
    },
  });

  React.useEffect(() => {
    async function loadData() {
      setIsLoadingData(true);
      const stats = await getHomepageStats();
      form.reset(stats);
      setIsLoadingData(false);
    }
    loadData();
  }, [form]);

  const onSubmit = async (data: HomepageStats) => {
    setIsSubmitting(true);
    const result = await updateHomepageStats(data);
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
          <CardTitle>Manage Homepage Stats</CardTitle>
          <CardDescription>Update the key statistics displayed on your homepage.</CardDescription>
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
        <CardTitle>Manage Homepage Stats</CardTitle>
        <CardDescription>Update the key statistics displayed on your homepage.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="projectsCompleted"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Projects Completed</FormLabel>
                  <FormControl>
                    <Input placeholder="50+" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="clientSatisfaction"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client Satisfaction</FormLabel>
                  <FormControl>
                    <Input placeholder="98%" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="yearsOfExperience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Years of Experience</FormLabel>
                  <FormControl>
                    <Input placeholder="5+" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
