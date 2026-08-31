import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { AdminNav } from "@/components/admin/AdminNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] pb-24">
      {/* Top bar */}
      <header className="border-b border-structural-strong bg-[var(--bg-primary)] sticky top-0 z-10">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link
              href="/admin"
              className="font-mono text-sm tracking-wider uppercase font-bold text-[var(--text-main)]"
            >
              ADMINISTRATIVE SYSTEM
            </Link>
            <AdminNav />
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="type-metadata text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
            >
              LIVESTREAM PUBLICATION ↗
            </Link>
            <form action="/api/auth/signout" method="POST">
              <button
                type="submit"
                className="type-metadata text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
              >
                DISCONNECT
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-[1600px] mx-auto p-6 md:p-12">
        <div className="bg-[var(--bg-primary)] border border-structural p-8 md:p-12 shadow-sm">
          {children}
        </div>
      </main>
    </div>
  );
}
