"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { getClients, addClient, updateClient, deleteClient } from "@/lib/actions";
import { type Client } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription as FormDesc } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, PlusCircle, Trash, Edit } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import Image from "next/image";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/svg+xml"];

const clientSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  dataAiHint: z.string().min(2, "AI hint must be at least 2 characters.").max(40, "Hint is too long."),
  logoFile: z.any()
    .optional()
    .refine((files) => !files || files.length === 0 || files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine((files) => !files || files.length === 0 || ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type), "Only .jpg, .jpeg, .png, .svg and .webp formats are supported."),
});

type ClientFormData = z.infer<typeof clientSchema>;

function ClientFormDialog({
  trigger,
  client,
  onSave,
}: {
  trigger: React.ReactNode;
  client?: Client;
  onSave: () => Promise<void>;
}) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  const form = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: client?.name || "",
      dataAiHint: client?.dataAiHint || "",
      logoFile: undefined,
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      form.reset({
        name: client?.name || "",
        dataAiHint: client?.dataAiHint || "",
        logoFile: undefined,
      });
    }
  }, [client, form, isOpen]);

  const handleSubmit = async (data: ClientFormData) => {
    setIsSubmitting(true);
    
    if (!client && (!data.logoFile || data.logoFile.length === 0)) {
        form.setError("logoFile", { message: "A logo image is required." });
        setIsSubmitting(false);
        return;
    }

    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('dataAiHint', data.dataAiHint);
    if (data.logoFile && data.logoFile[0]) {
      formData.append('logoFile', data.logoFile[0]);
    }

    const action = client
      ? updateClient(client.id, formData)
      : addClient(formData);

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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{client ? 'Edit Client' : 'Add New Client'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client Name</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dataAiHint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image AI Hint</FormLabel>
                  <FormControl><Input placeholder="e.g. company logo" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="logoFile"
              render={({ field }) => (
                <FormItem>
                    <FormLabel>Logo Image</FormLabel>
                    {client?.logoUrl && (
                        <div className="mb-2">
                             <Image 
                                src={client.logoUrl} 
                                alt={client.name} 
                                width={100} 
                                height={40} 
                                className="object-contain border rounded-md p-2"
                            />
                        </div>
                    )}
                    <FormControl>
                        <Input
                            type="file"
                            accept={ACCEPTED_IMAGE_TYPES.join(",")}
                            onChange={(e) => field.onChange(e.target.files)}
                        />
                    </FormControl>
                    <FormDesc>{client ? "Upload a new logo to replace the current one." : "Logo image for the client."}</FormDesc>
                    <FormMessage />
                </FormItem>
              )}
            />
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

export function ClientsManager() {
    const { toast } = useToast();
    const [clients, setClients] = React.useState<Client[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    const fetchAndSetClients = React.useCallback(async () => {
        setIsLoading(true);
        const clientsData = await getClients();
        setClients(clientsData);
        setIsLoading(false);
    }, []);

    React.useEffect(() => {
        fetchAndSetClients();
    }, [fetchAndSetClients]);

    const handleDelete = async (id: string) => {
        const result = await deleteClient(id);
        if (result.success) {
            toast({ title: "Deleted!", description: result.message });
            await fetchAndSetClients();
        } else {
            toast({ variant: "destructive", title: "Error", description: result.message });
        }
    };
    
    const onSave = async () => {
      await fetchAndSetClients();
    };

    if (isLoading) {
        return (
             <Card>
                <CardHeader>
                  <CardTitle>Manage Clients</CardTitle>
                  <CardDescription>Add, edit, or remove the client logos displayed on your homepage.</CardDescription>
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
                    <CardTitle>Manage Clients</CardTitle>
                    <CardDescription>Add, edit, or remove client logos from your homepage.</CardDescription>
                </div>
                <ClientFormDialog
                    trigger={<Button><PlusCircle className="mr-2" /> Add Client</Button>}
                    onSave={onSave}
                />
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {clients.map(client => (
                        <div key={client.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-4">
                                <Image 
                                  src={client.logoUrl} 
                                  alt={client.name} 
                                  width={100} 
                                  height={40} 
                                  className="object-contain"
                                  data-ai-hint={client.dataAiHint}
                                />
                                <h3 className="font-semibold">{client.name}</h3>
                            </div>
                            <div className="flex gap-2">
                                <ClientFormDialog
                                    trigger={<Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>}
                                    client={client}
                                    onSave={onSave}
                                />
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive"><Trash className="h-4 w-4" /></Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                            <AlertDialogDescription>This will permanently delete the client and its logo.</AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDelete(client.id)}>Delete</AlertDialogAction>
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
