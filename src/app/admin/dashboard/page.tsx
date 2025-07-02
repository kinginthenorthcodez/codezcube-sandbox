"use client"

import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { HomepageStatsForm } from "./homepage-stats-form";
import { ServicesManager } from "./offerings-manager";
import { ClientsManager } from "./clients-manager";

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/'); // Redirect to homepage after sign out
  };

  return (
    <div className="container py-16 md:py-24 space-y-8">
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
      
      <HomepageStatsForm />
      <ServicesManager />
      <ClientsManager />
    </div>
  );
}
