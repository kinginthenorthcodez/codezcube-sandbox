"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { getPortfolioProjects, addPortfolioProject, updatePortfolioProject, deletePortfolioProject } from "@/lib/actions";
import { type PortfolioProject } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription as FormDesc } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, PlusCircle, Trash, Edit } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/svg+xml"];

const projectSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters."),
    slug: z.string().min(3, "Slug must be at least 3 characters.").regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens."),
    category: z.string().min(3, "Category is required."),
    description: z.string().min(10, "Short description must be at least 10 characters."),
    details: z.string().min(20, "Detailed description must be at least 20 characters."),
    tags: z.string().min(1, "Please provide at least one tag."),
    order: z.coerce.number().int().min(0),
    imageFile: z.any()
        .optional()
        .refine((files) => !files || files.length === 0 || files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
        .refine((files) => !files || files.length === 0 || ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type), "Only .jpg, .jpeg, .png, .svg and .webp formats are supported."),
});

type ProjectFormData = z.infer<typeof projectSchema>;

function ProjectFormDialog({
  trigger,
  project,
  onSave,
}: {
  trigger: React.ReactNode;
  project?: PortfolioProject;
  onSave: () => Promise<void>;
}) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  const defaultValues = React.useMemo(() => (
    project
      ? { ...project, tags: project.tags.join('\n'), imageFile: undefined }
      : { title: "", slug: "", category: "", description: "", details: "", tags: "", order: 0, imageFile: undefined }
  ), [project]);

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues,
  });

  React.useEffect(() => {
    if (isOpen) {
        form.reset(defaultValues);
    }
  }, [isOpen, defaultValues, form]);

  const handleSubmit = async (data: ProjectFormData) => {
    setIsSubmitting(true);
    
    if (!project && (!data.imageFile || data.imageFile.length === 0)) {
        form.setError("imageFile", { message: "A project image is required." });
        setIsSubmitting(false);
        return;
    }

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
        if (key === 'imageFile' && value && value[0]) {
            formData.append(key, value[0]);
        } else if (key !== 'imageFile' && value !== undefined) {
            formData.append(key, String(value));
        }
    });

    const action = project
      ? updatePortfolioProject(project.id, formData)
      : addPortfolioProject(formData);

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
          <DialogTitle>{project ? 'Edit Project' : 'Add New Project'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <ScrollArea className="h-[60vh] pr-6">
            <div className="space-y-4 py-4">
              <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="slug" render={({ field }) => (
                <FormItem><FormLabel>Slug</FormLabel><FormControl><Input placeholder="e.g. ecommerce-revamp" {...field} /></FormControl><FormDesc>A unique, URL-friendly identifier.</FormDesc><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="category" render={({ field }) => (
                <FormItem><FormLabel>Category</FormLabel><FormControl><Input placeholder="e.g. Web Development" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem><FormLabel>Short Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormDesc>A brief summary for the portfolio grid.</FormDesc><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="details" render={({ field }) => (
                <FormItem><FormLabel>Detailed Case Study</FormLabel><FormControl><Textarea className="min-h-[150px]" {...field} /></FormControl><FormDesc>The full content for the project detail page. Use two newlines for paragraphs.</FormDesc><FormMessage /></FormItem>
              )} />
              <FormField
                control={form.control}
                name="imageFile"
                render={({ field }) => (
                  <FormItem>
                      <FormLabel>Project Image</FormLabel>
                      {project?.imageUrl && (
                          <div className="mb-2">
                            <Image src={project.imageUrl} alt={project.title} width={200} height={100} className="rounded-md object-cover border p-2" />
                          </div>
                      )}
                      <FormControl>
                          <Input
                              type="file"
                              accept={ACCEPTED_IMAGE_TYPES.join(",")}
                              onChange={(e) => field.onChange(e.target.files)}
                          />
                      </FormControl>
                      <FormDesc>{project ? "Upload a new image to replace the current one." : "The main image for the project."}</FormDesc>
                      <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={form.control} name="tags" render={({ field }) => (
                <FormItem><FormLabel>Tags / Technologies</FormLabel><FormControl><Textarea className="min-h-[100px]" {...field} /></FormControl><FormDesc>Enter one tag per line (e.g., Next.js, Firebase).</FormDesc><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="order" render={({ field }) => (
                <FormItem><FormLabel>Order</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormDesc>The display order on the portfolio page.</FormDesc><FormMessage /></FormItem>
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

export function PortfolioManager() {
    const { toast } = useToast();
    const [projects, setProjects] = React.useState<PortfolioProject[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    const fetchAndSetProjects = React.useCallback(async () => {
        setIsLoading(true);
        const projectsData = await getPortfolioProjects();
        setProjects(projectsData);
        setIsLoading(false);
    }, []);

    React.useEffect(() => {
        fetchAndSetProjects();
    }, [fetchAndSetProjects]);

    const handleDelete = async (id: string) => {
        const result = await deletePortfolioProject(id);
        if (result.success) {
            toast({ title: "Deleted!", description: result.message });
            await fetchAndSetProjects();
        } else {
            toast({ variant: "destructive", title: "Error", description: result.message });
        }
    };
    
    const onSave = async () => {
      await fetchAndSetProjects();
    };

    if (isLoading) {
        return (
             <Card>
                <CardHeader>
                    <CardTitle>Manage Portfolio</CardTitle>
                    <CardDescription>Add, edit, or remove the case studies displayed on your site.</CardDescription>
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
                    <CardTitle>Manage Portfolio</CardTitle>
                    <CardDescription>Add, edit, or remove case studies from your site.</CardDescription>
                </div>
                <ProjectFormDialog
                    trigger={<Button><PlusCircle className="mr-2" /> Add Project</Button>}
                    onSave={onSave}
                />
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {projects.map(project => (
                        <div key={project.id} className="flex items-start justify-between p-4 border rounded-lg">
                            <div className="flex items-start gap-4">
                               <Image src={project.imageUrl} alt={project.title} width={120} height={80} className="rounded-md object-cover border p-1" />
                                <div>
                                    <h3 className="font-semibold">{project.title}</h3>
                                    <p className="text-sm text-muted-foreground">{project.category}</p>
                                    <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{project.description}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <ProjectFormDialog
                                    trigger={<Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>}
                                    project={project}
                                    onSave={onSave}
                                />
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive"><Trash className="h-4 w-4" /></Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                            <AlertDialogDescription>This action cannot be undone. This will permanently delete the project and its image.</AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDelete(project.id)}>Delete</AlertDialogAction>
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
