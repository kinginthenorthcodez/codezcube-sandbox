
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { getCourses, addCourse, updateCourse, deleteCourse } from "@/lib/actions";
import { type Course } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription as FormDesc } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, PlusCircle, Trash, Edit, GraduationCap } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/svg+xml"];

const courseSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters."),
    slug: z.string().min(3, "Slug must be at least 3 characters.").regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens."),
    description: z.string().min(10, "Description must be at least 10 characters."),
    level: z.string().min(2, "Level is required."),
    duration: z.string().min(2, "Duration is required."),
    dataAiHint: z.string().min(2, "AI hint is required."),
    modules: z.string().min(1, "Please provide at least one module."),
    imageFile: z.any()
        .optional()
        .refine((files) => !files || files.length === 0 || files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
        .refine((files) => !files || files.length === 0 || ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type), "Only .jpg, .jpeg, .png, .svg and .webp formats are supported."),
});

type CourseFormData = z.infer<typeof courseSchema>;

function CourseFormDialog({
  trigger,
  course,
  onSave,
}: {
  trigger: React.ReactNode;
  course?: Course;
  onSave: () => Promise<void>;
}) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  const defaultValues = React.useMemo(() => (
    course 
      ? { ...course, modules: course.modules.join('\n'), imageFile: undefined } 
      : { title: "", slug: "", description: "", level: "", duration: "", dataAiHint: "", modules: "", imageFile: undefined }
  ), [course]);

  const form = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues
  });

  React.useEffect(() => {
    if (isOpen) {
      form.reset(defaultValues);
    }
  }, [course, form, isOpen, defaultValues]);

  const handleSubmit = async (data: CourseFormData) => {
    setIsSubmitting(true);
    
    if (!course && (!data.imageFile || data.imageFile.length === 0)) {
        form.setError("imageFile", { message: "A course image is required." });
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

    const action = course
      ? updateCourse(course.id, formData)
      : addCourse(formData);

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
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>{course ? 'Edit Course' : 'Add New Course'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <ScrollArea className="h-[70vh] pr-6">
                <div className="space-y-4 py-4">
                  <FormField control={form.control} name="title" render={({ field }) => (
                    <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                   <FormField control={form.control} name="slug" render={({ field }) => (
                    <FormItem><FormLabel>Slug</FormLabel><FormControl><Input placeholder="e.g. intro-to-web-dev" {...field} /></FormControl><FormDesc>A unique, URL-friendly identifier.</FormDesc><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="level" render={({ field }) => (
                      <FormItem><FormLabel>Level</FormLabel><FormControl><Input placeholder="e.g. Beginner" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="duration" render={({ field }) => (
                      <FormItem><FormLabel>Duration</FormLabel><FormControl><Input placeholder="e.g. 12 Weeks" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name="dataAiHint" render={({ field }) => (
                    <FormItem><FormLabel>AI Image Hint</FormLabel><FormControl><Input placeholder="e.g. online course" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField
                    control={form.control}
                    name="imageFile"
                    render={({ field }) => (
                      <FormItem>
                          <FormLabel>Course Image</FormLabel>
                          {course?.imageUrl && (
                              <div className="mb-2">
                                <Image src={course.imageUrl} alt={course.title} width={200} height={100} className="rounded-md object-cover border p-2" />
                              </div>
                          )}
                          <FormControl>
                              <Input type="file" accept={ACCEPTED_IMAGE_TYPES.join(",")} onChange={(e) => field.onChange(e.target.files)} />
                          </FormControl>
                          <FormDesc>{course ? "Upload a new image to replace the current one." : "The main image for the course."}</FormDesc>
                          <FormMessage />
                      </FormItem>
                  )}
                  />
                  <FormField control={form.control} name="modules" render={({ field }) => (
                    <FormItem><FormLabel>Modules</FormLabel><FormControl><Textarea className="min-h-[200px]" {...field} /></FormControl><FormDesc>Enter one module per line.</FormDesc><FormMessage /></FormItem>
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

export function CoursesManager() {
    const { toast } = useToast();
    const [courses, setCourses] = React.useState<Course[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    const fetchAndSetCourses = React.useCallback(async () => {
        setIsLoading(true);
        const coursesData = await getCourses();
        setCourses(coursesData);
        setIsLoading(false);
    }, []);

    React.useEffect(() => {
        fetchAndSetCourses();
    }, [fetchAndSetCourses]);
    
    const handleDelete = async (id: string) => {
        const result = await deleteCourse(id);
        if (result.success) {
            toast({ title: "Deleted!", description: result.message });
            await fetchAndSetCourses();
        } else {
            toast({ variant: "destructive", title: "Error", description: result.message });
        }
    };
    
    const onSave = async () => {
      await fetchAndSetCourses();
    };

    if (isLoading) {
        return (
             <Card>
                <CardHeader>
                    <CardTitle>Manage Courses</CardTitle>
                    <CardDescription>Add, edit, or remove the courses displayed on your site.</CardDescription>
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
                    <CardTitle>Manage Courses</CardTitle>
                    <CardDescription>Add, edit, or remove courses from your site.</CardDescription>
                </div>
                <CourseFormDialog
                    trigger={<Button><PlusCircle className="mr-2" /> Add Course</Button>}
                    onSave={onSave}
                />
            </CardHeader>
            <CardContent>
                {courses.length > 0 ? (
                    <div className="space-y-4">
                        {courses.map(course => (
                            <div key={course.id} className="flex items-start justify-between p-4 border rounded-lg">
                               <div className="flex items-start gap-4">
                                    <Image src={course.imageUrl} alt={course.title} width={120} height={80} className="rounded-md object-cover border p-1" />
                                    <div>
                                        <h3 className="font-semibold">{course.title}</h3>
                                        <p className="text-sm text-muted-foreground">{course.level} &middot; {course.duration}</p>
                                        <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{course.description}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <CourseFormDialog
                                        trigger={<Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>}
                                        course={course}
                                        onSave={onSave}
                                    />
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive"><Trash className="h-4 w-4" /></Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                <AlertDialogDescription>This action cannot be undone. This will permanently delete the course and its image.</AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDelete(course.id)}>Delete</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-muted-foreground py-12">
                        <GraduationCap className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-4 text-lg font-semibold">No courses yet</h3>
                        <p className="mt-1 text-sm">Get started by adding your first course.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
