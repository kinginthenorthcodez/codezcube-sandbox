"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { getServices, addService, updateService, deleteService } from "@/lib/actions";
import { type Service } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription as FormDesc } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, PlusCircle, Trash, Edit, HelpCircle } from "lucide-react";
import * as icons from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

const serviceSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters."),
    slug: z.string().min(3, "Slug must be at least 3 characters.").regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens."),
    description: z.string().min(10, "Short description must be at least 10 characters."),
    details: z.string().min(20, "Detailed description must be at least 20 characters."),
    iconName: z.string().min(1, "Icon name is required."),
    imageUrl: z.string().url("Image URL must be a valid URL."),
    features: z.string().min(1, "Please provide at least one feature."),
    order: z.coerce.number().int().min(0),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

const DynamicIcon = ({ name }: { name: string }) => {
    const LucideIcon = icons[name as keyof typeof icons] as React.ElementType;
    if (!LucideIcon) {
        return <HelpCircle className="w-8 h-8 text-muted-foreground" />;
    }
    return <LucideIcon className="w-8 h-8 text-primary" />;
};

function ServiceFormDialog({
  trigger,
  service,
  onSave,
}: {
  trigger: React.ReactNode;
  service?: Service;
  onSave: () => Promise<void>;
}) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  const form = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: service 
      ? { ...service, features: service.features.join('\n') } 
      : { title: "", slug: "", description: "", details: "", iconName: "", imageUrl: "", features: "", order: 0 },
  });

  React.useEffect(() => {
    if (isOpen) {
        form.reset(service 
          ? { ...service, features: service.features.join('\n') } 
          : { title: "", slug: "", description: "", details: "", iconName: "", imageUrl: "", features: "", order: 0 }
        );
    }
  }, [service, form, isOpen]);

  const handleSubmit = async (data: ServiceFormData) => {
    setIsSubmitting(true);
    const serviceData = {
        ...data,
        features: data.features.split('\n').map(f => f.trim()).filter(f => f),
    };

    const action = service
      ? updateService(service.id, serviceData)
      : addService(serviceData);

    const result = await action;
    if (result.success) {
      toast({ title: "Success!", description: result.message });
      await onSave();
      setIsOpen(false);
    } else {
      toast({ variant: "destructive", title: "Error", description: result.message });
    }
    setIsSubmitting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{service ? 'Edit Service' : 'Add New Service'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <ScrollArea className="h-[60vh] pr-6">
            <div className="space-y-4">
            <FormField control={form.control} name="title" render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="slug" render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl><Input placeholder="e.g. web-development" {...field} /></FormControl>
                <FormDesc>A unique, URL-friendly identifier.</FormDesc>
                <FormMessage />
              </FormItem>
            )} />
             <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <FormLabel>Short Description</FormLabel>
                <FormControl><Textarea {...field} /></FormControl>
                <FormDesc>A brief summary for homepage cards.</FormDesc>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="details" render={({ field }) => (
              <FormItem>
                <FormLabel>Detailed Description</FormLabel>
                <FormControl><Textarea className="min-h-[150px]" {...field} /></FormControl>
                 <FormDesc>The full description for the service detail page. Use \\n for line breaks.</FormDesc>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="iconName" render={({ field }) => (
              <FormItem>
                <FormLabel>Icon Name</FormLabel>
                <FormControl><Input placeholder="e.g. BrainCircuit" {...field} /></FormControl>
                <FormDesc>A valid `lucide-react` icon name.</FormDesc>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="imageUrl" render={({ field }) => (
              <FormItem>
                <FormLabel>Image URL</FormLabel>
                <FormControl><Input placeholder="https://..." {...field} /></FormControl>
                <FormDesc>The main image for the service detail page.</FormDesc>
                <FormMessage />
              </FormItem>
            )} />
             <FormField control={form.control} name="features" render={({ field }) => (
              <FormItem>
                <FormLabel>Features</FormLabel>
                <FormControl><Textarea className="min-h-[120px]" {...field} /></FormControl>
                <FormDesc>Enter one feature per line.</FormDesc>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="order" render={({ field }) => (
              <FormItem>
                <FormLabel>Order</FormLabel>
                <FormControl><Input type="number" {...field} /></FormControl>
                <FormDesc>The display order on the homepage.</FormDesc>
                <FormMessage />
              </FormItem>
            )} />
            </div>
            </ScrollArea>
            <DialogFooter className="mt-6 pt-4 border-t">
              <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export function ServicesManager() {
    const { toast } = useToast();
    const [services, setServices] = React.useState<Service[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    const fetchAndSetServices = React.useCallback(async () => {
        setIsLoading(true);
        const servicesData = await getServices();
        setServices(servicesData);
        setIsLoading(false);
    }, []);

    React.useEffect(() => {
        fetchAndSetServices();
    }, [fetchAndSetServices]);
    
    const handleDelete = async (id: string) => {
        const result = await deleteService(id);
        if (result.success) {
            toast({ title: "Deleted!", description: result.message });
            await fetchAndSetServices();
        } else {
            toast({ variant: "destructive", title: "Error", description: result.message });
        }
    };
    
    const onSave = async () => {
      await fetchAndSetServices();
    };

    if (isLoading) {
        return (
             <Card>
                <CardHeader>
                    <CardTitle>Manage Core Services</CardTitle>
                    <CardDescription>Add, edit, or remove the core services displayed on your site.</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center p-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Manage Core Services</CardTitle>
                    <CardDescription>Add, edit, or remove services from your site.</CardDescription>
                </div>
                <ServiceFormDialog
                    trigger={<Button><PlusCircle className="mr-2" /> Add Service</Button>}
                    onSave={onSave}
                />
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {services.map(service => (
                        <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-4">
                                <DynamicIcon name={service.iconName} />
                                <div>
                                    <h3 className="font-semibold">{service.title}</h3>
                                    <p className="text-sm text-muted-foreground">{service.description}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <ServiceFormDialog
                                    trigger={<Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>}
                                    service={service}
                                    onSave={onSave}
                                />
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive"><Trash className="h-4 w-4" /></Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                            <AlertDialogDescription>This action cannot be undone. This will permanently delete the service.</AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDelete(service.id)}>Delete</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
