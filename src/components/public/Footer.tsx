"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { usePathname } from "next/navigation";

const footerLinks = [
  {
    title: "Navigate",
    links: [
      { name: "Work", href: "/work" },
      { name: "Research", href: "/research" },
      { name: "Writing", href: "/writing" },
      { name: "Journal", href: "/journal" },
      { name: "Archive", href: "/archive" },
    ],
  },
  {
    title: "Connect",
    links: [
      { name: "LinkedIn", href: "https://www.linkedin.com/in/dhanushmendu", external: true },
      { name: "Email", href: "mailto:dhanush.mendu@gmail.com", external: true },
      { name: "About", href: "/about" },
    ],
  },
];

export function Footer() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") || pathname?.startsWith("/auth");

  if (isAdmin) return null;

  return (
    <footer className="border-t border-structural mt-32">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24 py-20">
        <div className="hidden lg:grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-24">
          {/* Identity */}
          <div className="col-span-2">
            <Link
              href="/"
              className="font-serif text-2xl tracking-normal text-[var(--text-main)] group hover:text-[var(--accent)] transition-colors"
            >
              Dhanush Mendu
            </Link>
            <p className="mt-6 type-body text-base text-[var(--text-muted)] leading-relaxed max-w-sm text-pretty">
              Research, public finance, data analysis and policy — building an evidence-based body of work.
            </p>
          </div>

          {/* Link Groups */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h3 className="type-metadata text-[var(--text-faint)] mb-6">
                {group.title}
              </h3>
              <ul className="space-y-4">
                {group.links.map((link) => (
                  <li key={link.name}>
                    {"external" in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="type-ui text-base text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors inline-flex items-center gap-1 group"
                      >
                        {link.name}
                        <svg className="w-3.5 h-3.5 text-[var(--text-faint)] group-hover:text-[var(--text-main)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="type-ui text-base text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
                      >
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Mobile / Tablet grid (fallback) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 lg:hidden">
          <div className="sm:col-span-2">
            <Link
              href="/"
              className="font-serif text-2xl tracking-normal text-[var(--text-main)] group hover:text-[var(--accent)] transition-colors"
            >
              Dhanush Mendu
            </Link>
            <p className="mt-4 type-body text-base text-[var(--text-muted)] leading-relaxed max-w-sm text-pretty">
              Research, public finance, data analysis and policy — building an evidence-based body of work.
            </p>
          </div>
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h3 className="type-metadata text-[var(--text-faint)] mb-4">
                {group.title}
              </h3>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.name}>
                    {"external" in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="type-ui text-base text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors inline-flex items-center gap-1 group"
                      >
                        {link.name}
                        <svg className="w-3.5 h-3.5 text-[var(--text-faint)] group-hover:text-[var(--text-main)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="type-ui text-base text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
                      >
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-20 pt-8 border-t border-structural flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="type-metadata text-[var(--text-muted)] text-[10px]">
            © {new Date().getFullYear()} DHANUSH MENDU. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-6">
            <p className="type-metadata text-[var(--text-faint)] text-[10px]">
              VER {new Date().toLocaleDateString("en-US", { month: "2-digit", year: "2-digit" })}
            </p>
            <div className="border border-structural">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
