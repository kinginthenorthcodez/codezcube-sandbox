
"use client"

import Link from "next/link"
import { Menu, X, LayoutDashboard, LogOut } from "lucide-react"
import { useState } from "react"
import { usePathname, useRouter } from 'next/navigation'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "@/components/ui/sheet"
import { Logo } from "@/components/logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/hooks/use-auth"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const allNavLinks = [
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Case Studies" },
  { href: "/products", label: "Products" },
  { href: "/courses", label: "Courses & Career" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact Us" },
]

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, signOut, loading } = useAuth()

  const navLinks = allNavLinks.filter(link => {
    if (link.href === '/pricing') {
      return !loading && !!user;
    }
    return true;
  });

  const NavLink = ({ href, label, isMobile = false }: { href:string; label:string; isMobile?: boolean }) => (
    <Link
      href={href}
      onClick={() => setIsOpen(false)}
      className={cn(
        "font-medium transition-colors hover:text-primary",
        pathname === href ? "text-primary" : "text-muted-foreground",
        isMobile ? "text-lg p-2" : "text-sm"
      )}
    >
      {label}
    </Link>
  )
  
  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        {/* === Mobile View === */}
        <div className="flex w-full items-center justify-between md:hidden">
          <Logo />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="flex flex-col p-0">
                 <SheetHeader className="p-4 border-b">
                    <Logo />
                  </SheetHeader>
                <nav className="flex flex-col items-start gap-4 p-4">
                  {navLinks.map((link) => (
                    <NavLink key={link.href} {...link} isMobile />
                  ))}
                </nav>
                {/* Actions in mobile menu footer */}
                <div className="mt-auto flex flex-col gap-4 border-t p-4">
                  {user ? (
                     <>
                      <div className="flex items-center gap-2 rounded-md border p-2">
                          <Avatar>
                              <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium truncate">{user.email}</span>
                      </div>
                      <Button asChild onClick={() => setIsOpen(false)}><Link href="/admin/dashboard">Dashboard</Link></Button>
                      <Button variant="outline" onClick={handleSignOut}>Sign Out</Button>
                     </>
                  ) : (
                      <Button asChild onClick={() => setIsOpen(false)}><Link href="/login">Login</Link></Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* === Desktop View === */}
        <div className="hidden w-full items-center md:flex">
          {/* Left side: Logo + Nav */}
          <div className="flex flex-1 items-center gap-6 lg:gap-10">
            <Logo />
            <nav className="flex-1">
              <ul className="flex items-center justify-center gap-4 lg:gap-6">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <NavLink {...link} />
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          
          {/* Right Side: Buttons */}
          <div className="flex items-center justify-end gap-2">
            <ThemeToggle />
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                       <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">My Account</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/admin/dashboard">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild>
                <Link href="/login">Login</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
