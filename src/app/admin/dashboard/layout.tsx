"use client"

import { SidebarProvider, Sidebar, SidebarHeader, SidebarTrigger, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset } from '@/components/ui/sidebar';
import { Settings, Home, Blocks, Users, LayoutDashboard, MessageSquareQuote, LayoutTemplate, Share2, LayoutGrid } from 'lucide-react';
import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-[calc(100vh-4rem)] bg-secondary/20">
        <Sidebar>
          <SidebarHeader>
             <div className="flex items-center gap-2 p-2 pr-0">
                <div className="flex items-center justify-center h-8 w-8 bg-primary rounded-lg text-primary-foreground">
                    <LayoutDashboard size={18}/>
                </div>
                <span className="font-semibold text-lg">Dashboard</span>
             </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton href="#info" tooltip={{children: "Welcome"}}>
                  <Home />
                  Welcome
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton href="#site-config" tooltip={{children: "Site Configuration"}}>
                  <Share2 />
                  Site Configuration
                </SidebarMenuButton>
              </SidebarMenuItem>
               <SidebarMenuItem>
                <SidebarMenuButton href="#content" tooltip={{children: "Homepage Content"}}>
                  <LayoutTemplate />
                  Homepage Content
                </SidebarMenuButton>
              </SidebarMenuItem>
               <SidebarMenuItem>
                <SidebarMenuButton href="#stats" tooltip={{children: "Homepage Stats"}}>
                  <Settings />
                  Homepage Stats
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton href="#services" tooltip={{children: "Core Services"}}>
                  <Blocks />
                  Core Services
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton href="#portfolio" tooltip={{children: "Portfolio"}}>
                  <LayoutGrid />
                  Portfolio
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton href="#clients" tooltip={{children: "Clients"}}>
                  <Users />
                  Clients
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton href="#testimonials" tooltip={{children: "Testimonials"}}>
                  <MessageSquareQuote />
                  Testimonials
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <div className="p-4 sm:p-6 lg:p-8">
             <div className="flex items-center gap-4 mb-8">
                <SidebarTrigger className="md:hidden" />
                <h1 className="text-2xl md:text-3xl font-bold">Admin Content Manager</h1>
             </div>
            {children}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
