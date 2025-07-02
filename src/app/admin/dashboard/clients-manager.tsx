"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { getClients, addClient, updateClient, deleteClient } from "@/lib/actions";
import { type Client } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, PlusCircle, Trash, Edit } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import Image from "next/image";

const clientSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  logoUrl: z.string().url("Please enter a valid URL for the logo."),
  dataAiHint: z.string().min(2, "AI hint must be at least 2 characters.").max(40, "Hint is too long."),
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
      logoUrl: client?.logoUrl || "",
      dataAiHint: client?.dataAiHint || "",
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      form.reset({
        name: client?.name || "",
        logoUrl: client?.logoUrl || "",
        dataAiHint: client?.dataAiHint || "",
      });
    }
  }, [client, form, isOpen]);

  const handleSubmit = async (data: ClientFormData) => {
    setIsSubmitting(true);
    const clientData: Omit<Client, 'id'> = {
        ...data,
        logoStoragePath: client?.logoStoragePath || ""
    };

    const action = client
      ? updateClient(client.id, clientData)
      : addClient(clientData);

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
              name="logoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo URL</FormLabel>
                  <FormControl><Input placeholder="https://..." {...field} /></FormControl>
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
                                            <AlertDialogDescription>This will permanently delete the client.</AlertDialogDescription>
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
