"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const navigation = [
  { name: "Work", href: "/work" },
  { name: "Research", href: "/research" },
  { name: "Journal", href: "/journal" },
  { name: "About", href: "/about" },
  { name: "Archive", href: "/archive" },
];

export function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Do not render public header on admin pages (Auth will render this fine if needed, but lets skip on /admin)
  const isAdmin = pathname?.startsWith("/admin") || pathname?.startsWith("/auth");

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      setIsSearchOpen(true);
    }
    if (e.key === "Escape") {
      setIsSearchOpen(false);
      setIsMenuOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  if (isAdmin) return null;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
          isScrolled
            ? "bg-[var(--bg-primary)]/90 backdrop-blur-md border-b border-structural shadow-sm"
            : "bg-[var(--bg-primary)]/60 backdrop-blur-sm border-b border-structural/40"
        }`}
      >
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24">
          <div className="flex items-center justify-between h-20">
            {/* Logo / Identity */}
            <div className="flex items-center gap-6">
              <Link
                href="/"
                className="group flex flex-col"
              >
                <span className="font-serif text-2xl tracking-normal text-[var(--text-main)] group-hover:text-[var(--accent)] transition-colors">
                  Dhanush Mendu
                </span>
                <span className="type-metadata text-[10px] text-[var(--text-muted)] -mt-1 hidden sm:block">
                  Research & Analysis Archive
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8 lg:gap-10">
              {navigation.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`font-mono text-xs uppercase tracking-widest transition-all relative py-1 ${
                      isActive
                        ? "text-[var(--text-main)] font-semibold"
                        : "text-[var(--text-muted)] hover:text-[var(--text-main)]"
                    }`}
                  >
                    {item.name}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--text-main)]" />
                    )}
                  </Link>
                );
              })}

              {/* Search Button Trigger */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-2 px-2.5 py-1 border border-structural hover:border-structural-strong bg-[var(--bg-secondary)]/40 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
                aria-label="Search Catalog"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.75}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <span className="font-mono text-[10px] uppercase tracking-wider hidden lg:inline">Catalog</span>
                <kbd className="font-mono text-[9px] px-1 py-0.2 bg-[var(--bg-primary)] border border-structural rounded text-[var(--text-faint)]">
                  ⌘K
                </kbd>
              </button>

              {/* Theme Toggle */}
              <div className="pl-2 border-l border-structural">
                <ThemeToggle />
              </div>
            </nav>

            {/* Mobile Actions */}
            <div className="flex items-center gap-3 md:hidden">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-[var(--text-muted)] hover:text-[var(--text-main)]"
                aria-label="Search"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <ThemeToggle />
              <button
                className="p-2 text-[var(--text-main)] border border-structural"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
                aria-expanded={isMenuOpen}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden bg-[var(--bg-primary)] border-b border-structural px-6 py-8 space-y-6">
            <nav className="space-y-4">
              {navigation.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`block font-mono text-sm uppercase tracking-widest py-2 border-b border-structural/40 ${
                      isActive
                        ? "text-[var(--text-main)] font-bold pl-2 border-l-2 border-l-[var(--text-main)]"
                        : "text-[var(--text-muted)]"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </header>

      {/* Search Modal */}
      {isSearchOpen && (
        <SearchModal onClose={() => setIsSearchOpen(false)} />
      )}
    </>
  );
}

function SearchModal({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.results || []);
        }
      } catch {
        // silently fail
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-2xl bg-[var(--bg-primary)] border border-structural-strong shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-structural bg-[var(--bg-secondary)]/40">
          <span className="type-metadata text-[10px] text-[var(--text-muted)]">
            Archival Dossier Search Console
          </span>
          <kbd className="font-mono text-[10px] text-[var(--text-faint)] border border-structural px-1.5 py-0.5 bg-[var(--bg-primary)]">
            ESC to close
          </kbd>
        </div>

        {/* Input area */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-structural">
          <svg className="w-5 h-5 text-[var(--text-muted)] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects, research monographs, field records..."
            className="w-full bg-transparent text-[var(--text-main)] placeholder:text-[var(--text-faint)] focus:outline-none font-serif text-lg md:text-xl"
            autoFocus
          />
        </div>

        {/* Results Stream */}
        {query.trim() ? (
          <div className="max-h-[60vh] overflow-y-auto divide-y divide-structural">
            {isLoading ? (
              <div className="p-8 text-center type-metadata text-[var(--text-muted)]">
                Executing Catalog Query…
              </div>
            ) : results.length > 0 ? (
              <div className="p-2 space-y-1">
                {results.map((result) => (
                  <Link
                    key={result.id}
                    href={result.href}
                    onClick={onClose}
                    className="flex items-start gap-4 p-4 hover:bg-[var(--bg-secondary)]/50 transition-colors group"
                  >
                    <span className="type-metadata font-mono text-[9px] px-1.5 py-0.5 border border-structural text-[var(--text-muted)] uppercase tracking-wider shrink-0 mt-0.5">
                      {result.type}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="type-ui font-serif text-base text-[var(--text-main)] group-hover:text-[var(--accent)] transition-colors truncate">
                        {result.title}
                      </div>
                      {result.description && (
                        <div className="type-metadata text-[11px] text-[var(--text-muted)] mt-1 line-clamp-2 leading-relaxed">
                          {result.description}
                        </div>
                      )}
                    </div>
                    <span className="text-[var(--text-faint)] group-hover:text-[var(--text-main)] group-hover:translate-x-1 transition-all text-xs">
                      →
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center space-y-2">
                <p className="type-body text-[var(--text-muted)] italic text-sm">
                  No verified records matching &ldquo;{query}&rdquo;
                </p>
                <p className="type-metadata text-[var(--text-faint)] text-[10px]">
                  Refine query terms or browse categories directly.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="p-8 text-center space-y-3 bg-[var(--bg-secondary)]/10">
            <p className="type-metadata text-[var(--text-muted)]">
              Index includes Project Dossiers, Policy Monographs, Field Records, and Topics
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

interface SearchResult {
  id: string;
  type: "project" | "article" | "journal" | "topic";
  title: string;
  description?: string;
  href: string;
}
