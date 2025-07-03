
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { getBlogPosts, addBlogPost, updateBlogPost, deleteBlogPost } from "@/lib/actions";
import { type BlogPost } from "@/types";
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
import { ScrollArea } from "@/components/ui/scroll-area";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const postSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters."),
    slug: z.string().min(3, "Slug must be at least 3 characters.").regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens."),
    author: z.string().min(2, "Author name is required."),
    category: z.string().min(2, "Category is required."),
    excerpt: z.string().min(10, "Excerpt must be at least 10 characters."),
    content: z.string().min(50, "Content must be at least 50 characters."),
    imageFile: z.any()
        .optional()
        .refine((files) => !files || files.length === 0 || files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
        .refine((files) => !files || files.length === 0 || ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type), "Only .jpg, .jpeg, .png, and .webp formats are supported."),
});

type PostFormData = z.infer<typeof postSchema>;

function PostFormDialog({
  trigger,
  post,
  onSave,
}: {
  trigger: React.ReactNode;
  post?: BlogPost;
  onSave: () => Promise<void>;
}) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  const form = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: post?.title || "",
      slug: post?.slug || "",
      author: post?.author || "",
      category: post?.category || "",
      excerpt: post?.excerpt || "",
      content: post?.content || "",
      imageFile: undefined,
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      form.reset({
        title: post?.title || "",
        slug: post?.slug || "",
        author: post?.author || "",
        category: post?.category || "",
        excerpt: post?.excerpt || "",
        content: post?.content || "",
        imageFile: undefined,
      });
    }
  }, [post, form, isOpen]);

  const handleSubmit = async (data: PostFormData) => {
    setIsSubmitting(true);
    
    if (!post && (!data.imageFile || data.imageFile.length === 0)) {
        form.setError("imageFile", { message: "A post image is required." });
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

    const action = post
      ? updateBlogPost(post.id, formData)
      : addBlogPost(formData);

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
          <DialogTitle>{post ? 'Edit Post' : 'Add New Post'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <ScrollArea className="h-[70vh] pr-6">
                <div className="space-y-4 py-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="slug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Slug</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. my-awesome-post" {...field} />
                          </FormControl>
                          <FormDesc>A unique, URL-friendly identifier.</FormDesc>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="author"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Author</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Jane Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Career Advice" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="imageFile"
                      render={({ field }) => (
                        <FormItem>
                            <FormLabel>Post Image</FormLabel>
                            {post?.imageUrl && (<div className="mb-2"><Image src={post.imageUrl} alt={post.title} width={200} height={100} className="rounded-md object-cover border p-2" /></div>)}
                            <FormControl>
                              <Input type="file" accept={ACCEPTED_IMAGE_TYPES.join(",")} onChange={(e) => field.onChange(e.target.files)} />
                            </FormControl>
                            <FormDesc>{post ? "Upload a new image to replace the current one." : "The main image for the post."}</FormDesc>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                      control={form.control}
                      name="excerpt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Excerpt</FormLabel>
                          <FormControl>
                            <Textarea {...field} />
                          </FormControl>
                          <FormDesc>A short summary for the blog list page.</FormDesc>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Content</FormLabel>
                          <FormControl>
                            <Textarea className="min-h-[300px]" {...field} />
                          </FormControl>
                          <FormDesc>The main content of the blog post. Use two newlines for paragraphs.</FormDesc>
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

export function BlogManager() {
    const { toast } = useToast();
    const [posts, setPosts] = React.useState<BlogPost[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    const fetchAndSetPosts = React.useCallback(async () => {
        setIsLoading(true);
        const data = await getBlogPosts();
        setPosts(data);
        setIsLoading(false);
    }, []);

    React.useEffect(() => {
        fetchAndSetPosts();
    }, [fetchAndSetPosts]);

    const handleDelete = async (id: string) => {
        const result = await deleteBlogPost(id);
        if (result.success) {
            toast({ title: "Deleted!", description: result.message });
            await fetchAndSetPosts();
        } else {
            toast({ variant: "destructive", title: "Error", description: result.message });
        }
    };
    
    const onSave = async () => {
      await fetchAndSetPosts();
    };

    if (isLoading) {
        return (
             <Card>
                <CardHeader>
                    <CardTitle>Manage Blog Posts</CardTitle>
                    <CardDescription>Add, edit, or remove the articles on your site.</CardDescription>
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
                    <CardTitle>Manage Blog Posts</CardTitle>
                    <CardDescription>Add, edit, or remove articles from your site.</CardDescription>
                </div>
                <PostFormDialog
                    trigger={<Button><PlusCircle className="mr-2" /> Add Post</Button>}
                    onSave={onSave}
                />
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {posts.map(post => (
                        <div key={post.id} className="flex items-start justify-between p-4 border rounded-lg">
                           <div className="flex items-start gap-4">
                                <Image src={post.imageUrl} alt={post.title} width={120} height={80} className="rounded-md object-cover border p-1" />
                                <div>
                                    <h3 className="font-semibold">{post.title}</h3>
                                    <p className="text-sm text-muted-foreground">{post.category} &middot; {post.date}</p>
                                    <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{post.excerpt}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <PostFormDialog
                                    trigger={<Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>}
                                    post={post}
                                    onSave={onSave}
                                />
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive"><Trash className="h-4 w-4" /></Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                            <AlertDialogDescription>This action cannot be undone. This will permanently delete the post and its image.</AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDelete(post.id)}>Delete</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </div>
                    ))}
                     {posts.length === 0 && (
                        <div className="text-center text-muted-foreground py-12">
                            <p>No blog posts have been added yet.</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

    