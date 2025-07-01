"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Github } from "lucide-react";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(1, { message: "Password is required." }),
});

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.62 1.9-4.73 1.9-3.57 0-6.42-2.96-6.42-6.62s2.85-6.61 6.42-6.61c1.92 0 3.34.73 4.15 1.5l2.73-2.73C18.73 1.04 15.98 0 12.48 0 5.88 0 0 5.58 0 12.27s5.88 12.27 12.48 12.27c6.92 0 11.52-4.78 11.52-11.72 0-.78-.08-1.55-.2-2.32H12.48z" fill="currentColor"/>
    </svg>
);


export default function AdminPage() {
  const { signIn, signInWithGoogle, signInWithGitHub, user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [loadingProvider, setLoadingProvider] = useState<null | 'email' | 'google' | 'github'>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (user) {
      router.push("/admin/dashboard");
    }
  }, [user, router]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoadingProvider('email');
    try {
      await signIn(values.email, values.password);
      router.push("/admin/dashboard");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
      });
    } finally {
      setLoadingProvider(null);
    }
  }

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    setLoadingProvider(provider);
    try {
        if (provider === 'google') {
            await signInWithGoogle();
        } else {
            await signInWithGitHub();
        }
        router.push("/admin/dashboard");
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: `Login Failed with ${provider.charAt(0).toUpperCase() + provider.slice(1)}`,
            description: error.message || "An unexpected error occurred. Please try again.",
        });
    } finally {
        setLoadingProvider(null);
    }
  };

  const isLoading = loadingProvider !== null;
  
  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-secondary/50">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Login Dashboard</CardTitle>
          <CardDescription>Please sign in to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="email">Email</Label>
                    <FormControl>
                      <Input id="email" type="email" placeholder="admin@codezcube.com" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="password">Password</Label>
                    <FormControl>
                      <Input id="password" type="password" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {loadingProvider === 'email' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
              </Button>
            </form>
          </Form>
           <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                        Or continue with
                    </span>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" onClick={() => handleSocialLogin('google')} disabled={isLoading}>
                    {loadingProvider === 'google' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon className="mr-2 h-4 w-4" />}
                    Google
                </Button>
                <Button variant="outline" onClick={() => handleSocialLogin('github')} disabled={isLoading}>
                    {loadingProvider === 'github' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Github className="mr-2 h-4 w-4" />}
                    GitHub
                </Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
