
"use client"

import { Logo } from "@/components/logo"
import { Github, Linkedin, Twitter } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getSiteConfiguration } from "@/lib/actions"
import { useAuth } from "@/hooks/use-auth"
import React, { useEffect, useState } from "react"
import { type SiteConfiguration } from "@/types"

export function Footer() {
  const { user, loading, isAdmin } = useAuth();
  const [config, setConfig] = useState<SiteConfiguration | null>(null);

  useEffect(() => {
    async function fetchConfig() {
      const siteConfig = await getSiteConfiguration();
      setConfig(siteConfig);
    }
    fetchConfig();
  }, []);

  const { github, twitter, linkedin } = config?.socialLinks || { github: '#', twitter: '#', linkedin: '#' };

  return (
    <footer className="border-t">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-12">
          <div className="flex flex-col items-center gap-4 text-center md:col-span-4 md:items-start md:text-left">
            <Logo />
            <p className="text-sm text-muted-foreground">
              Innovating the Next. Empowering the Now.
            </p>
            {config && (
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" asChild>
                  <Link href={github} aria-label="Github" target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <Link href={twitter} aria-label="Twitter" target="_blank" rel="noopener noreferrer">
                    <Twitter className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <Link href={linkedin} aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
                    <Linkedin className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-8 text-center md:col-span-8 md:grid-cols-3 md:text-left">
            <div>
              <h4 className="font-medium text-sm mb-2">Quicklinks</h4>
              <ul className="space-y-2">
                <li><Link href="/services" className="text-sm text-muted-foreground hover:text-primary">Services</Link></li>
                <li><Link href="/portfolio" className="text-sm text-muted-foreground hover:text-primary">Case Studies</Link></li>
                <li><Link href="/blog" className="text-sm text-muted-foreground hover:text-primary">Blog</Link></li>
                <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-primary">Contact</Link></li>
                {!loading && user && isAdmin && <li><Link href="/admin" className="text-sm text-muted-foreground hover:text-primary">Admin</Link></li>}
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-2">Product/Solutions</h4>
              <ul className="space-y-2">
                <li><Link href="/products" className="text-sm text-muted-foreground hover:text-primary">Products</Link></li>
                <li><Link href="/courses" className="text-sm text-muted-foreground hover:text-primary">Courses & Career</Link></li>
                {!loading && user && <li><Link href="/pricing" className="text-sm text-muted-foreground hover:text-primary">Pricing</Link></li>}
              </ul>
            </div>
             <div className="col-span-2 md:col-span-1">
              <h4 className="font-medium text-sm mb-2">Legal</h4>
              <ul className="space-y-2">
                <li><Link href="/privacy-policy" className="text-sm text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
                <li><Link href="/terms-of-service" className="text-sm text-muted-foreground hover:text-primary">Terms of Service</Link></li>
                <li><Link href="/cookie-policy" className="text-sm text-muted-foreground hover:text-primary">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Codezcube. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
