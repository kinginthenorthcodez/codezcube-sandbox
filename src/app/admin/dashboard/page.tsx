"use client"

import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { HomepageStatsForm } from "./homepage-stats-form";
import { ServicesManager } from "./offerings-manager";
import { ClientsManager } from "./clients-manager";
import { TestimonialsManager } from "./testimonials-manager";
import { HomepageContentManager } from "./homepage-content-manager";

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/'); // Redirect to homepage after sign out
  };

  return (
    <div className="space-y-8">
      <div id="info">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Welcome to your Dashboard</CardTitle>
            <CardDescription>
              You are logged in as {user ? user.email : '...'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-6">This is your protected dashboard page. Only authenticated users can see this.</p>
            <Button onClick={handleSignOut}>
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <div id="content">
        <HomepageContentManager />
      </div>

      <div id="stats">
        <HomepageStatsForm />
      </div>
      <div id="services">
        <ServicesManager />
      </div>
      <div id="clients">
        <ClientsManager />
      </div>
      <div id="testimonials">
        <TestimonialsManager />
      </div>
    </div>
  );
}
