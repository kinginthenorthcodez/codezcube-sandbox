
"use client"

import { SidebarProvider, Sidebar, SidebarHeader, SidebarTrigger, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset } from '@/components/ui/sidebar';
import { Settings, Home, Blocks, Users, LayoutDashboard, MessageSquareQuote, LayoutTemplate, Share2, LayoutGrid, Package, GraduationCap, Newspaper } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

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
                <SidebarMenuButton href="/admin/dashboard" tooltip={{children: "Welcome"}} isActive={pathname === '/admin/dashboard'}>
                  <Home />
                  Welcome
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton href="/admin/dashboard/site-configuration" tooltip={{children: "Site Configuration"}} isActive={pathname === '/admin/dashboard/site-configuration'}>
                  <Share2 />
                  Site Configuration
                </SidebarMenuButton>
              </SidebarMenuItem>
               <SidebarMenuItem>
                <SidebarMenuButton href="/admin/dashboard/homepage-content" tooltip={{children: "Homepage Content"}} isActive={pathname === '/admin/dashboard/homepage-content'}>
                  <LayoutTemplate />
                  Homepage Content
                </SidebarMenuButton>
              </SidebarMenuItem>
               <SidebarMenuItem>
                <SidebarMenuButton href="/admin/dashboard/homepage-stats" tooltip={{children: "Homepage Stats"}} isActive={pathname === '/admin/dashboard/homepage-stats'}>
                  <Settings />
                  Homepage Stats
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton href="/admin/dashboard/services" tooltip={{children: "Core Services"}} isActive={pathname === '/admin/dashboard/services'}>
                  <Blocks />
                  Core Services
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton href="/admin/dashboard/portfolio" tooltip={{children: "Portfolio"}} isActive={pathname === '/admin/dashboard/portfolio'}>
                  <LayoutGrid />
                  Portfolio
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton href="/admin/dashboard/products" tooltip={{children: "Products"}} isActive={pathname === '/admin/dashboard/products'}>
                  <Package />
                  Products
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton href="/admin/dashboard/courses" tooltip={{children: "Courses"}} isActive={pathname === '/admin/dashboard/courses'}>
                  <GraduationCap />
                  Courses
                </SidebarMenuButton>
              </SidebarMenuItem>
               <SidebarMenuItem>
                <SidebarMenuButton href="/admin/dashboard/blog" tooltip={{children: "Blog"}} isActive={pathname === '/admin/dashboard/blog'}>
                  <Newspaper />
                  Blog
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton href="/admin/dashboard/clients" tooltip={{children: "Clients"}} isActive={pathname === '/admin/dashboard/clients'}>
                  <Users />
                  Clients
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton href="/admin/dashboard/testimonials" tooltip={{children: "Testimonials"}} isActive={pathname === '/admin/dashboard/testimonials'}>
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
