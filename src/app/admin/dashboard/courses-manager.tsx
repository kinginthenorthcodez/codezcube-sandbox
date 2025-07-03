
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
import { Loader2, PlusCircle, Trash, Edit } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import Image from "next/image";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const courseSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters."),
    description: z.string().min(10, "Description must be at least 10 characters."),
    category: z.string().min(2, "Category is required."),
    courseUrl: z.string().url("Please enter a valid URL."),
    order: z.coerce.number().int().min(0),
    imageFile: z.any()
        .optional()
        .refine((files) => !files || files.length === 0 || files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
        .refine((files) => !files || files.length === 0 || ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type), "Only .jpg, .jpeg, .png, and .webp formats are supported."),
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

  const form = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: course?.title || "",
      description: course?.description || "",
      category: course?.category || "",
      courseUrl: course?.courseUrl || "",
      order: course?.order || 0,
      imageFile: undefined,
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      form.reset({
        title: course?.title || "",
        description: course?.description || "",
        category: course?.category || "",
        courseUrl: course?.courseUrl || "",
        order: course?.order || 0,
        imageFile: undefined,
      });
    }
  }, [course, form, isOpen]);

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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{course ? 'Edit Course' : 'Add New Course'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
            <FormField control={form.control} name="title" render={({ field }) => (
              <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
             <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="category" render={({ field }) => (
              <FormItem><FormLabel>Category</FormLabel><FormControl><Input placeholder="e.g. Web Development" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="courseUrl" render={({ field }) => (
                <FormItem><FormLabel>Course URL</FormLabel><FormControl><Input placeholder="https://example.com/course" {...field} /></FormControl><FormMessage /></FormItem>
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
                        <Input
                            type="file"
                            accept={ACCEPTED_IMAGE_TYPES.join(",")}
                            onChange={(e) => field.onChange(e.target.files)}
                        />
                    </FormControl>
                    <FormDesc>{course ? "Upload a new image to replace the current one." : "The main image for the course."}</FormDesc>
                    <FormMessage />
                </FormItem>
              )}
            />
            <FormField control={form.control} name="order" render={({ field }) => (
              <FormItem><FormLabel>Display Order</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormDesc>The order in which the course appears.</FormDesc><FormMessage /></FormItem>
            )} />
            <DialogFooter className="mt-4 pt-4 border-t">
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
                <div className="space-y-4">
                    {courses.map(course => (
                        <div key={course.id} className="flex items-start justify-between p-4 border rounded-lg">
                           <div className="flex items-start gap-4">
                                <Image src={course.imageUrl} alt={course.title} width={120} height={80} className="rounded-md object-cover border p-1" />
                                <div>
                                    <h3 className="font-semibold">{course.title}</h3>
                                    <p className="text-sm text-muted-foreground">{course.category}</p>
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
                     {courses.length === 0 && (
                        <div className="text-center text-muted-foreground py-12">
                            <p>No courses have been added yet.</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
