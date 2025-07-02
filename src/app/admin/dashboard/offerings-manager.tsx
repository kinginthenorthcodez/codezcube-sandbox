"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { getOfferings, addOffering, updateOffering, deleteOffering } from "@/lib/actions";
import { type Offering } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, PlusCircle, Trash, Edit, HelpCircle } from "lucide-react";
import * as icons from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const offeringSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters."),
    description: z.string().min(10, "Description must be at least 10 characters."),
    icon: z.string().min(1, "Icon name is required."),
    order: z.coerce.number().int().min(0),
});

const DynamicIcon = ({ name }: { name: string }) => {
    const LucideIcon = icons[name as keyof typeof icons] as React.ElementType;
    if (!LucideIcon) {
        return <HelpCircle className="w-8 h-8 text-muted-foreground" />;
    }
    return <LucideIcon className="w-8 h-8 text-primary" />;
};

function OfferingFormDialog({
  trigger,
  offering,
  onSave,
}: {
  trigger: React.ReactNode;
  offering?: Offering;
  onSave: () => Promise<void>;
}) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  const form = useForm<z.infer<typeof offeringSchema>>({
    resolver: zodResolver(offeringSchema),
    defaultValues: offering || { title: "", description: "", icon: "", order: 0 },
  });

  React.useEffect(() => {
    form.reset(offering || { title: "", description: "", icon: "", order: 0 });
  }, [offering, form, isOpen]);

  const handleSubmit = async (data: z.infer<typeof offeringSchema>) => {
    setIsSubmitting(true);
    const action = offering
      ? updateOffering(offering.id, data)
      : addOffering(data);

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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{offering ? 'Edit Offering' : 'Add New Offering'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField control={form.control} name="title" render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl><Textarea {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="icon" render={({ field }) => (
              <FormItem>
                <FormLabel>Icon Name</FormLabel>
                <FormControl><Input placeholder="e.g. Code, Smartphone" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="order" render={({ field }) => (
              <FormItem>
                <FormLabel>Order</FormLabel>
                <FormControl><Input type="number" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <DialogFooter>
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


export function OfferingsManager() {
    const { toast } = useToast();
    const [offerings, setOfferings] = React.useState<Offering[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    const fetchAndSetOfferings = React.useCallback(async () => {
        setIsLoading(true);
        const offeringsData = await getOfferings();
        setOfferings(offeringsData);
        setIsLoading(false);
    }, []);

    React.useEffect(() => {
        fetchAndSetOfferings();
    }, [fetchAndSetOfferings]);
    
    const handleDelete = async (id: string) => {
        const result = await deleteOffering(id);
        if (result.success) {
            toast({ title: "Deleted!", description: result.message });
            await fetchAndSetOfferings();
        } else {
            toast({ variant: "destructive", title: "Error", description: result.message });
        }
    };
    
    const onSave = async () => {
      await fetchAndSetOfferings();
    };

    if (isLoading) {
        return (
             <Card>
                <CardHeader>
                    <CardTitle>Manage Core Offerings</CardTitle>
                    <CardDescription>Add, edit, or remove the core offerings displayed on your homepage.</CardDescription>
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
                    <CardTitle>Manage Core Offerings</CardTitle>
                    <CardDescription>Add, edit, or remove offerings from your homepage.</CardDescription>
                </div>
                <OfferingFormDialog
                    trigger={<Button><PlusCircle className="mr-2" /> Add Offering</Button>}
                    onSave={onSave}
                />
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {offerings.map(offering => (
                        <div key={offering.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-4">
                                <DynamicIcon name={offering.icon} />
                                <div>
                                    <h3 className="font-semibold">{offering.title}</h3>
                                    <p className="text-sm text-muted-foreground">{offering.description}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <OfferingFormDialog
                                    trigger={<Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>}
                                    offering={offering}
                                    onSave={onSave}
                                />
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive"><Trash className="h-4 w-4" /></Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                            <AlertDialogDescription>This action cannot be undone. This will permanently delete the offering.</AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDelete(offering.id)}>Delete</AlertDialogAction>
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
