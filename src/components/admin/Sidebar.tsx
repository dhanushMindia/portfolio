"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const navGroups = [
  {
    title: "Overview",
    items: [
      {
        name: "Dashboard",
        href: "/admin",
        icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
      },
    ],
  },
  {
    title: "Content",
    items: [
      {
        name: "Projects",
        href: "/admin/projects",
        icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
      },
      {
        name: "Articles",
        href: "/admin/articles",
        icon: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z",
      },
      {
        name: "Journal",
        href: "/admin/journal",
        icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
      },
    ],
  },
  {
    title: "Organize",
    items: [
      {
        name: "Media",
        href: "/admin/media",
        icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
      },
      {
        name: "Topics",
        href: "/admin/topics",
        icon: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z",
      },
      {
        name: "Settings",
        href: "/admin/settings",
        icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
      },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen border-r border-structural bg-[var(--bg-secondary)] flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-structural">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-[var(--text-main)] flex items-center justify-center">
            <span className="text-[var(--bg-primary)] text-xs font-bold">D</span>
          </div>
          <div>
            <p className="text-sm font-medium text-[var(--text-main)] leading-none">
              Research Platform
            </p>
            <p className="text-[10px] text-[var(--text-faint)] dark:text-[var(--text-muted)] mt-0.5">
              Admin
            </p>
          </div>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-4 border-b border-structural">
        <div className="grid grid-cols-2 gap-2">
          <Link
            href="/admin/projects/new"
            className="text-xs text-center px-3 py-2 bg-[var(--bg-primary)] border border-structural rounded-md text-[var(--text-main)] hover:border-gray-400 dark:hover:border-gray-600 transition-colors"
          >
            + Project
          </Link>
          <Link
            href="/admin/journal/new"
            className="text-xs text-center px-3 py-2 bg-[var(--bg-primary)] border border-structural rounded-md text-[var(--text-main)] hover:border-gray-400 dark:hover:border-gray-600 transition-colors"
          >
            + Week
          </Link>
          <Link
            href="/admin/articles/new"
            className="text-xs text-center px-3 py-2 bg-[var(--bg-primary)] border border-structural rounded-md text-[var(--text-main)] hover:border-gray-400 dark:hover:border-gray-600 transition-colors"
          >
            + Article
          </Link>
          <Link
            href="/admin/media"
            className="text-xs text-center px-3 py-2 bg-[var(--bg-primary)] border border-structural rounded-md text-[var(--text-main)] hover:border-gray-400 dark:hover:border-gray-600 transition-colors"
          >
            + Upload
          </Link>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
        {navGroups.map((group) => (
          <div key={group.title}>
            <h3 className="px-3 text-[10px] font-medium uppercase tracking-widest text-[var(--text-faint)] dark:text-[var(--text-muted)] mb-2">
              {group.title}
            </h3>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const isActive =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href);
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                        isActive
                          ? "bg-[var(--bg-primary)] text-[var(--text-main)] shadow-sm border border-structural"
                          : "text-[var(--text-muted)] hover:text-gray-900 dark:hover:text-gray-50 hover:bg-white dark:hover:bg-gray-900"
                      }`}
                    >
                      <svg
                        className="w-4 h-4 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d={item.icon}
                        />
                      </svg>
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-structural space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--text-muted)] hover:text-gray-900 dark:hover:text-gray-50 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          View site
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--text-muted)] hover:text-red-600 dark:hover:text-red-400 transition-colors w-full"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign out
        </button>
      </div>
    </aside>
  );
}
