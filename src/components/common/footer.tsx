import { Logo } from "@/components/logo"
import { Github, Linkedin, Twitter } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-12">
          <div className="flex flex-col gap-4 md:col-span-4">
            <Logo />
            <p className="text-sm text-muted-foreground">
              Innovating the Next. Empowering the Now.
            </p>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" asChild>
                <Link href="#" aria-label="Github">
                  <Github className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href="#" aria-label="Twitter">
                  <Twitter className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href="#" aria-label="LinkedIn">
                  <Linkedin className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="grid gap-8 md:col-span-8 md:grid-cols-3">
            <div>
              <h4 className="font-medium text-sm mb-2">Quicklinks</h4>
              <ul className="space-y-2">
                <li><Link href="/services" className="text-sm text-muted-foreground hover:text-primary">Services</Link></li>
                <li><Link href="/portfolio" className="text-sm text-muted-foreground hover:text-primary">Case Studies</Link></li>
                <li><Link href="/blog" className="text-sm text-muted-foreground hover:text-primary">Blog</Link></li>
                <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-primary">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-2">Product/Solutions</h4>
              <ul className="space-y-2">
                <li><Link href="/products" className="text-sm text-muted-foreground hover:text-primary">Products</Link></li>
                <li><Link href="/courses" className="text-sm text-muted-foreground hover:text-primary">Courses & Career</Link></li>
                <li><Link href="/pricing" className="text-sm text-muted-foreground hover:text-primary">Pricing</Link></li>
              </ul>
            </div>
             <div>
              <h4 className="font-medium text-sm mb-2">Legal</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">Terms of Service</Link></li>
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
