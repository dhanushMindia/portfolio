export const dynamic = 'force-dynamic';
import { redirect } from 'next/navigation'
import { auth, signIn } from '@/lib/auth'

export default async function LoginPage() {
  const session = await auth()

  if (session?.user) {
    redirect('/admin')
  }

  async function handleLogin(formData: FormData) {
    'use server'

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
      await signIn('credentials', {
        email,
        password,
        redirect: true,
        redirectTo: '/admin',
      })
    } catch (error) {
      // Error handling will be managed by next-auth
      throw error
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] px-4 py-20">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <p className="type-metadata text-[var(--text-muted)] mb-3">Private Console</p>
          <h1 className="text-4xl font-serif font-semibold text-[var(--text-main)] mb-3">
            Sign In
          </h1>
          <p className="text-[var(--text-muted)]">
            Sign in to your research platform
          </p>
        </div>

        <div className="bg-[var(--bg-secondary)]/20 border border-structural p-8 shadow-sm">
          <form action={handleLogin} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block type-metadata text-[var(--text-muted)] mb-2"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full px-4 py-2.5 bg-[var(--bg-primary)] border border-structural text-[var(--text-main)] placeholder:text-[var(--text-faint)] focus:outline-none focus:border-[var(--accent)] transition-all"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block type-metadata text-[var(--text-muted)] mb-2"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full px-4 py-2.5 bg-[var(--bg-primary)] border border-structural text-[var(--text-main)] placeholder:text-[var(--text-faint)] focus:outline-none focus:border-[var(--accent)] transition-all"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[var(--text-main)] hover:bg-[var(--accent)] text-[var(--bg-primary)] font-mono text-xs uppercase tracking-wider py-3 px-4 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2"
            >
              Sign in
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-structural">
            <p className="type-metadata text-center text-[var(--text-faint)]">
              This is a private research platform.
              <br />
              Access is restricted to authorized users only.
            </p>
          </div>
        </div>

        <p className="mt-8 text-center type-metadata text-[var(--text-faint)]">
          Protected by enterprise-grade authentication
        </p>
      </div>
    </div>
  )
}
