import Link from "next/link";

import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";

const footerGroups = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Workflow", href: "#how-it-works" },
      { label: "Pricing", href: "#pricing" },
    ],
  },
  {
    title: "Platform",
    links: [
      { label: "Rubrics", href: "#features" },
      { label: "Peer matching", href: "#features" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Preview", href: "#hero" },
      { label: "Contact", href: "mailto:hello@gemprep.dev" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t bg-secondary/45">
      <div className="site-container py-12">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">
              AI-powered peer technical interview practice for candidates who
              want better signal from every session.
            </p>
            <div className="mt-5 flex items-center gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href="#pricing">View pricing</Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link href="#faq">Read FAQ</Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {footerGroups.map((group) => (
              <div key={group.title}>
                <h3 className="text-sm font-semibold">{group.title}</h3>
                <ul className="mt-3 space-y-2">
                  {group.links.map((link) => (
                    <li key={link.href + link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-3 border-t pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; 2026 GEMPREP. All rights reserved.</p>
          <p>Frontend foundation phase. Backend services not connected.</p>
        </div>
      </div>
    </footer>
  );
}
