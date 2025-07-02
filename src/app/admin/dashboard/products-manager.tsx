
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { getProducts, addProduct, updateProduct, deleteProduct } from "@/lib/actions";
import { type Product } from "@/types";
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

const productSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters."),
    description: z.string().min(10, "Description must be at least 10 characters."),
    category: z.string().min(2, "Category is required."),
    productUrl: z.string().url("Please enter a valid URL."),
    order: z.coerce.number().int().min(0),
    imageFile: z.any()
        .optional()
        .refine((files) => !files || files.length === 0 || files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
        .refine((files) => !files || files.length === 0 || ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type), "Only .jpg, .jpeg, .png, and .webp formats are supported."),
});

type ProductFormData = z.infer<typeof productSchema>;

function ProductFormDialog({
  trigger,
  product,
  onSave,
}: {
  trigger: React.ReactNode;
  product?: Product;
  onSave: () => Promise<void>;
}) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: product?.title || "",
      description: product?.description || "",
      category: product?.category || "",
      productUrl: product?.productUrl || "",
      order: product?.order || 0,
      imageFile: undefined,
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      form.reset({
        title: product?.title || "",
        description: product?.description || "",
        category: product?.category || "",
        productUrl: product?.productUrl || "",
        order: product?.order || 0,
        imageFile: undefined,
      });
    }
  }, [product, form, isOpen]);

  const handleSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    
    if (!product && (!data.imageFile || data.imageFile.length === 0)) {
        form.setError("imageFile", { message: "A product image is required." });
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

    const action = product
      ? updateProduct(product.id, formData)
      : addProduct(formData);

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
          <DialogTitle>{product ? 'Edit Product' : 'Add New Product'}</DialogTitle>
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
              <FormItem><FormLabel>Category</FormLabel><FormControl><Input placeholder="e.g. EdTech" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="productUrl" render={({ field }) => (
                <FormItem><FormLabel>Product URL</FormLabel><FormControl><Input placeholder="https://example.com/product" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
             <FormField
              control={form.control}
              name="imageFile"
              render={({ field }) => (
                <FormItem>
                    <FormLabel>Product Image</FormLabel>
                    {product?.imageUrl && (
                        <div className="mb-2">
                           <Image src={product.imageUrl} alt={product.title} width={200} height={100} className="rounded-md object-cover border p-2" />
                        </div>
                    )}
                    <FormControl>
                        <Input
                            type="file"
                            accept={ACCEPTED_IMAGE_TYPES.join(",")}
                            onChange={(e) => field.onChange(e.target.files)}
                        />
                    </FormControl>
                    <FormDesc>{product ? "Upload a new image to replace the current one." : "The main image for the product."}</FormDesc>
                    <FormMessage />
                </FormItem>
              )}
            />
            <FormField control={form.control} name="order" render={({ field }) => (
              <FormItem><FormLabel>Display Order</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormDesc>The order in which the product appears.</FormDesc><FormMessage /></FormItem>
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

export function ProductsManager() {
    const { toast } = useToast();
    const [products, setProducts] = React.useState<Product[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    const fetchAndSetProducts = React.useCallback(async () => {
        setIsLoading(true);
        const productsData = await getProducts();
        setProducts(productsData);
        setIsLoading(false);
    }, []);

    React.useEffect(() => {
        fetchAndSetProducts();
    }, [fetchAndSetProducts]);
    
    const handleDelete = async (id: string) => {
        const result = await deleteProduct(id);
        if (result.success) {
            toast({ title: "Deleted!", description: result.message });
            await fetchAndSetProducts();
        } else {
            toast({ variant: "destructive", title: "Error", description: result.message });
        }
    };
    
    const onSave = async () => {
      await fetchAndSetProducts();
    };

    if (isLoading) {
        return (
             <Card>
                <CardHeader>
                    <CardTitle>Manage Products</CardTitle>
                    <CardDescription>Add, edit, or remove the products displayed on your site.</CardDescription>
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
                    <CardTitle>Manage Products</CardTitle>
                    <CardDescription>Add, edit, or remove products from your site.</CardDescription>
                </div>
                <ProductFormDialog
                    trigger={<Button><PlusCircle className="mr-2" /> Add Product</Button>}
                    onSave={onSave}
                />
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {products.map(product => (
                        <div key={product.id} className="flex items-start justify-between p-4 border rounded-lg">
                           <div className="flex items-start gap-4">
                                <Image src={product.imageUrl} alt={product.title} width={120} height={80} className="rounded-md object-cover border p-1" />
                                <div>
                                    <h3 className="font-semibold">{product.title}</h3>
                                    <p className="text-sm text-muted-foreground">{product.category}</p>
                                    <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{product.description}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <ProductFormDialog
                                    trigger={<Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>}
                                    product={product}
                                    onSave={onSave}
                                />
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive"><Trash className="h-4 w-4" /></Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                            <AlertDialogDescription>This action cannot be undone. This will permanently delete the product and its image.</AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDelete(product.id)}>Delete</AlertDialogAction>
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
