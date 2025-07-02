"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { getTestimonials, addTestimonial, updateTestimonial, deleteTestimonial } from "@/lib/actions";
import { type Testimonial } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription as FormDesc } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, PlusCircle, Trash, Edit, Star } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";


const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const testimonialSchema = z.object({
  quote: z.string().min(10, "Quote must be at least 10 characters long."),
  authorName: z.string().min(2, "Author name must be at least 2 characters."),
  authorTitle: z.string().min(2, "Author title must be at least 2 characters."),
  rating: z.coerce.number().int().min(1).max(5),
  avatarFile: z.any()
    .optional()
    .refine((files) => !files || files.length === 0 || files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 2MB.`)
    .refine((files) => !files || files.length === 0 || ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type), "Only .jpg, .jpeg, .png, and .webp formats are supported."),
});

type TestimonialFormData = z.infer<typeof testimonialSchema>;

function TestimonialFormDialog({
  trigger,
  testimonial,
  onSave,
}: {
  trigger: React.ReactNode;
  testimonial?: Testimonial;
  onSave: () => Promise<void>;
}) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  const form = useForm<TestimonialFormData>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      quote: testimonial?.quote || "",
      authorName: testimonial?.authorName || "",
      authorTitle: testimonial?.authorTitle || "",
      rating: testimonial?.rating || 5,
      avatarFile: undefined,
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      form.reset({
        quote: testimonial?.quote || "",
        authorName: testimonial?.authorName || "",
        authorTitle: testimonial?.authorTitle || "",
        rating: testimonial?.rating || 5,
        avatarFile: undefined,
      });
    }
  }, [testimonial, form, isOpen]);
  
  const handleSubmit = async (data: TestimonialFormData) => {
    setIsSubmitting(true);
    
    if (!testimonial && (!data.avatarFile || data.avatarFile.length === 0)) {
        form.setError("avatarFile", { message: "An avatar image is required." });
        setIsSubmitting(false);
        return;
    }

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
        if (key === 'avatarFile' && value && value[0]) {
            formData.append(key, value[0]);
        } else if (key !== 'avatarFile' && value !== undefined) {
            formData.append(key, String(value));
        }
    });

    const action = testimonial
      ? updateTestimonial(testimonial.id, formData)
      : addTestimonial(formData);

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
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{testimonial ? 'Edit Testimonial' : 'Add New Testimonial'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <ScrollArea className="h-[60vh] pr-6">
              <div className="space-y-4 py-4">
                <FormField
                  control={form.control}
                  name="quote"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quote</FormLabel>
                      <FormControl><Textarea className="min-h-[120px]" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="authorName"
                  render={({ field }) => (
                    <FormItem><FormLabel>Author Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="authorTitle"
                  render={({ field }) => (
                    <FormItem><FormLabel>Author Title</FormLabel><FormControl><Input placeholder="e.g. CEO, Acme Inc." {...field} /></FormControl><FormMessage /></FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rating</FormLabel>
                      <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={String(field.value)}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a rating" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[5, 4, 3, 2, 1].map(r => (
                            <SelectItem key={r} value={String(r)}>{r} Stars</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="avatarFile"
                  render={({ field }) => (
                    <FormItem>
                        <FormLabel>Author Avatar</FormLabel>
                        {testimonial?.avatarUrl && (
                            <div className="mb-2">
                                <Avatar>
                                    <AvatarImage src={testimonial.avatarUrl} alt={testimonial.authorName} />
                                    <AvatarFallback>{testimonial.authorName.charAt(0)}</AvatarFallback>
                                </Avatar>
                            </div>
                        )}
                        <FormControl>
                            <Input
                                type="file"
                                accept={ACCEPTED_IMAGE_TYPES.join(",")}
                                onChange={(e) => field.onChange(e.target.files)}
                            />
                        </FormControl>
                        <FormDesc>{testimonial ? "Upload a new image to replace the current one." : "Image of the author."}</FormDesc>
                        <FormMessage />
                    </FormItem>
                  )}
                />
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

export function TestimonialsManager() {
    const { toast } = useToast();
    const [testimonials, setTestimonials] = React.useState<Testimonial[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    const fetchAndSetTestimonials = React.useCallback(async () => {
        setIsLoading(true);
        const data = await getTestimonials();
        setTestimonials(data);
        setIsLoading(false);
    }, []);

    React.useEffect(() => {
        fetchAndSetTestimonials();
    }, [fetchAndSetTestimonials]);

    const handleDelete = async (id: string) => {
        const result = await deleteTestimonial(id);
        if (result.success) {
            toast({ title: "Deleted!", description: result.message });
            await fetchAndSetTestimonials();
        } else {
            toast({ variant: "destructive", title: "Error", description: result.message });
        }
    };
    
    const onSave = async () => {
      await fetchAndSetTestimonials();
    };

    if (isLoading) {
        return (
             <Card>
                <CardHeader>
                  <CardTitle>Manage Testimonials</CardTitle>
                  <CardDescription>Add, edit, or remove testimonials from your homepage.</CardDescription>
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
                    <CardTitle>Manage Testimonials</CardTitle>
                    <CardDescription>Add, edit, or remove testimonials from your homepage.</CardDescription>
                </div>
                <TestimonialFormDialog
                    trigger={<Button><PlusCircle className="mr-2" /> Add Testimonial</Button>}
                    onSave={onSave}
                />
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {testimonials.map(testimonial => (
                        <div key={testimonial.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-4">
                                <Avatar>
                                    <AvatarImage src={testimonial.avatarUrl} alt={testimonial.authorName} />
                                    <AvatarFallback>{testimonial.authorName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <h3 className="font-semibold">{testimonial.authorName} <span className="text-sm font-normal text-muted-foreground">- {testimonial.authorTitle}</span></h3>
                                    <p className="text-sm text-muted-foreground line-clamp-2">"{testimonial.quote}"</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <TestimonialFormDialog
                                    trigger={<Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>}
                                    testimonial={testimonial}
                                    onSave={onSave}
                                />
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive"><Trash className="h-4 w-4" /></Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                            <AlertDialogDescription>This will permanently delete the testimonial and its avatar.</AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDelete(testimonial.id)}>Delete</AlertDialogAction>
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
