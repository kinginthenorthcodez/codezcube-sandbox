
"use client";

import * as React from "react";
import { getMessages, deleteMessage, updateMessageStatus } from "@/lib/actions";
import { type ContactMessage } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trash, Mail, MailOpen, Inbox } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

export function MessagesManager() {
    const { toast } = useToast();
    const [messages, setMessages] = React.useState<ContactMessage[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    const fetchAndSetMessages = React.useCallback(async () => {
        setIsLoading(true);
        const messagesData = await getMessages();
        setMessages(messagesData);
        setIsLoading(false);
    }, []);

    React.useEffect(() => {
        fetchAndSetMessages();
    }, [fetchAndSetMessages]);

    const handleDelete = async (id: string) => {
        const result = await deleteMessage(id);
        if (result.success) {
            toast({ title: "Deleted!", description: result.message });
            await fetchAndSetMessages();
        } else {
            toast({ variant: "destructive", title: "Error", description: result.message });
        }
    };

    const handleToggleRead = async (id: string, currentState: boolean) => {
        await updateMessageStatus(id, !currentState);
        fetchAndSetMessages(); // Refetch to update UI
    }
    
    if (isLoading) {
        return (
             <Card>
                <CardHeader>
                    <CardTitle>Manage Messages</CardTitle>
                    <CardDescription>View and manage messages from your contact form.</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center p-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Manage Messages</CardTitle>
                <CardDescription>View and manage messages from your contact form.</CardDescription>
            </CardHeader>
            <CardContent>
                {messages.length === 0 ? (
                    <div className="text-center text-muted-foreground py-12">
                        <Inbox className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                        <p className="font-semibold text-lg">Your inbox is empty.</p>
                        <p>New messages from your website's contact form will appear here.</p>
                    </div>
                ) : (
                    <Accordion type="multiple" className="w-full">
                        {messages.map(message => (
                            <AccordionItem key={message.id} value={message.id}>
                                <AccordionTrigger 
                                    className={`p-4 rounded-lg flex justify-between items-center transition-colors ${!message.isRead ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-secondary/50'}`}
                                    onClick={() => !message.isRead && handleToggleRead(message.id, message.isRead)}
                                >
                                    <div className="flex items-center gap-4 text-left">
                                        {!message.isRead && <Badge>New</Badge>}
                                        <div className="flex flex-col">
                                            <span className="font-semibold">{message.subject}</span>
                                            <span className="text-sm text-muted-foreground">From: {message.name} ({message.email})</span>
                                        </div>
                                    </div>
                                    <span className="text-sm text-muted-foreground">{message.receivedAt}</span>
                                </AccordionTrigger>
                                <AccordionContent className="p-6 bg-secondary/30 border-l-4 border-primary/20">
                                    <p className="whitespace-pre-wrap">{message.message}</p>
                                    <div className="flex justify-end gap-2 mt-4">
                                        <Button 
                                            variant="ghost" 
                                            size="sm"
                                            onClick={() => handleToggleRead(message.id, message.isRead)}
                                        >
                                            {message.isRead ? <MailOpen className="mr-2 h-4 w-4" /> : <Mail className="mr-2 h-4 w-4" />}
                                            {message.isRead ? 'Mark as Unread' : 'Mark as Read'}
                                        </Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="outline" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                                                    <Trash className="mr-2 h-4 w-4" /> Delete
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>This will permanently delete this message. This action cannot be undone.</AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDelete(message.id)}>Delete</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                )}
            </CardContent>
        </Card>
    );
}
