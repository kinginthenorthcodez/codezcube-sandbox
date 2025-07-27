
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const signInSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(1, { message: "Password is required." }),
});

const signUpSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});


const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.62 1.9-4.73 1.9-3.57 0-6.42-2.96-6.42-6.62s2.85-6.61 6.42-6.61c1.92 0 3.34.73 4.15 1.5l2.73-2.73C18.73 1.04 15.98 0 12.48 0 5.88 0 0 5.58 0 12.27s5.88 12.27 12.48 12.27c6.92 0 11.52-4.78 11.52-11.72 0-.78-.08-1.55-.2-2.32H12.48z" fill="currentColor"/>
    </svg>
);


export default function LoginPage() {
  const { signIn, signUp, signInWithGoogle, signInWithGitHub, user, isProcessingSocialLogin } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [loadingProvider, setLoadingProvider] = useState<null | 'email-signin' | 'email-signup' | 'google' | 'github'>(null);

  const signInForm = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signUpForm = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (user) {
      router.push("/admin/dashboard");
    }
  }, [user, router]);

  async function onSignInSubmit(values: z.infer<typeof signInSchema>) {
    setLoadingProvider('email-signin');
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
  
  async function onSignUpSubmit(values: z.infer<typeof signUpSchema>) {
    setLoadingProvider('email-signup');
    try {
      await signUp(values.email, values.password);
      router.push("/admin/dashboard");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Sign Up Failed",
        description: error.message || "An unexpected error occurred. Please try again.",
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
        // The user will be redirected, so the page will reload.
        // We don't need to do anything else here.
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: `Login Failed with ${provider.charAt(0).toUpperCase() + provider.slice(1)}`,
            description: error.message || "An unexpected error occurred. Please try again.",
        });
        setLoadingProvider(null);
    }
  };

  const isLoading = loadingProvider !== null || isProcessingSocialLogin;
  
  if (isProcessingSocialLogin) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-4 text-muted-foreground">Finalizing sign-in...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-secondary/50">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Access Your Account</CardTitle>
          <CardDescription>Sign in or create an account to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              <TabsContent value="signin">
                <Form {...signInForm}>
                  <form onSubmit={signInForm.handleSubmit(onSignInSubmit)} className="space-y-4 pt-4">
                    <FormField
                      control={signInForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <Label htmlFor="email-signin">Email</Label>
                          <FormControl>
                            <Input id="email-signin" type="email" placeholder="admin@codezcube.com" {...field} disabled={isLoading} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={signInForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <Label htmlFor="password-signin">Password</Label>
                          <FormControl>
                            <Input id="password-signin" type="password" {...field} disabled={isLoading} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {loadingProvider === 'email-signin' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Sign In
                    </Button>
                  </form>
                </Form>
              </TabsContent>
              <TabsContent value="signup">
                <Form {...signUpForm}>
                  <form onSubmit={signUpForm.handleSubmit(onSignUpSubmit)} className="space-y-4 pt-4">
                    <FormField
                      control={signUpForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <Label htmlFor="email-signup">Email</Label>
                          <FormControl>
                            <Input id="email-signup" type="email" placeholder="user@example.com" {...field} disabled={isLoading} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={signUpForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <Label htmlFor="password-signup">Password</Label>
                          <FormControl>
                            <Input id="password-signup" type="password" {...field} disabled={isLoading} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={signUpForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <Label htmlFor="confirmPassword">Confirm Password</Label>
                          <FormControl>
                            <Input id="confirmPassword" type="password" {...field} disabled={isLoading} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {loadingProvider === 'email-signup' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Create Account
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
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
