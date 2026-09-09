# SYSTEM DIRECTIVE: STRICT AI OPERATING PROCEDURES

**CRITICAL INSTRUCTION FOR ALL AI AGENTS:** You are operating in a production-grade codebase. The architecture and dependency graph are highly specific and meticulously configured. **DO NOT deviate from these rules, guess configurations, or implement "standard" scaffolding unless explicitly told to do so.** Breakages caused by ignoring this document will result in deployment failure. 

Read every section below before taking action.

---

## 1. PROJECT DIRECTION & TONE (ABSOLUTE BOUNDARIES)
- **Primary Domain:** Quantitative Finance, Public Economics, and State Policy Research.
- **Tone & Voice:** Professional, precise, data-driven, minimalist, and analytical.
- **FORBIDDEN PATTERNS:** 
  - **No Pseudo-Academic Jargon:** Do NOT generate text involving "blockchain verification", "Evidentiary Architecture", "Live Canvas", "UUID tracking", or generic sci-fi aesthetic overlays.
  - **No Decorative Overlays:** Removing random UI badges (like "Visual evidence / Data overview") is preferred over adding them back. Keep the interface clean and focused solely on the actual work, howvwer great UI, fluid animations and polished designs are always encouraged.

---

## 2. STRUCTURAmy pL CACHING & PERFORMANCE (ZERO TOLERANCE)
The portfolio uses Incremental Static Regeneration (ISR) to achieve sub-millisecond edge load speeds.
- **PUBLIC PAGES (`src/app/page.tsx`, `src/app/work/...`, `src/app/research/...`, etc.):** 
  - **MANDATORY:** You MUST use `export const revalidate = 60;` (or similar).
  - **BANNED:** Never use `export const dynamic = "force-dynamic";` on public pages. Doing so bypasses Vercel’s edge caching, causing unacceptably high latency (3+ seconds per page load).
- **ADMIN PAGES (`src/app/admin/...`):**
  - **MANDATORY:** You MUST use `export const dynamic = "force-dynamic";` because they require real-time authentication and DB verification.

---

## 3. DEPENDENCY & BUILD SYSTEM
- **NPM Package Management:** 
  - **STRICT RULE:** You MUST execute all installations with the `--legacy-peer-deps` flag (`npm install <package> --legacy-peer-deps`).
  - **WHY:** The project uses `@blocknote/shadcn` which has an unresolvable peer dependency conflict with `tailwindcss@3.x`. 
  - Do NOT attempt to "fix" `package.json` by upgrading Tailwind to `v4`.
  - Do NOT remove or alter `.npmrc` (`legacy-peer-deps=true`) or the `vercel.json` build commands. They exist specifically to prevent Vercel build failures.

---

## 4. DATABASE & ORM ARCHITECTURE (SUPABASE + PRISMA)
- **Connections:**
  - `DATABASE_URL`: Must connect via **Port 6543** (Transaction Pooler / PgBouncer). Append `?pgbouncer=true`. Used for the actual app query runtime.
  - `DIRECT_URL`: Must connect via **Port 5432** (Session Pooler / Direct). Used EXCLUSIVELY for Prisma schema migrations (`npx prisma migrate deploy`).
  - *URL Encoding:* Passwords with special characters (`@`, `!`) must be URL-encoded (`%40`, `%21`) inside connection strings.
- **Prisma Rules:**
  - **DO NOT** run `npx prisma init`.
  - **DO NOT** use `npx prisma db push` if valid migration history exists in `prisma/migrations/`. Use `npx prisma migrate dev` locally and `npx prisma migrate deploy` for production.
  - **DO NOT** attempt to recreate the database or drop existing tables unless strictly commanded by the user with confirmation.

---

## 5. DESIGN SYSTEM & STYLING (NO `dark:` UTILITIES)
The UI heavily relies on a custom CSS Variable implementation for theming.
- **BANNED:** Do NOT use standard Tailwind `dark:` prefixed classes (e.g., `dark:bg-black`).
- **MANDATORY:** Always use the defined CSS Variables for theming:
  - **Backgrounds:** `bg-[var(--bg-primary)]`, `bg-[var(--bg-secondary)]`.
  - **Text:** `text-[var(--text-main)]`, `text-[var(--text-muted)]`, `text-[var(--text-faint)]`, `text-[var(--accent)]`.
  - **Borders:** `border-[var(--border-structural)]`, `border-[var(--border-subtle)]`, `border-[var(--border-structural-strong)]`.
- **Typography:** Classes like `type-metadata`, `type-body`, `type-heading-1`, and `type-ui` are strictly enforced across the site. Do not apply arbitrary font scaling (`text-4xl text-gray-800`) without respecting the existing type scale hierarchy.
- **Contrast Check:** When refactoring components, ensure you verify that elements like search inputs are visible on both light and dark themes (use explicit background and text variables, do NOT rely on `bg-transparent` if the parent overlaps incorrectly).

---

## 6. PROJECT DIRECTORY ARCHITECTURE
If tasked to build new features, adhere to the established folder structures:
- `src/app/(public)/`: Client-facing web routes.
- `src/app/admin/`: Protected admin control panel routes.
- `src/components/ui/`: Dumb, reusable visual components (Buttons, Modals, Forms).
- `src/components/blocks/`: Rich-text and BlockNote specific rendering components.
- `src/components/admin/`: Forms and management specifically tied to CMS mutations.
- `src/lib/`: Universal access for `prisma.ts`, `auth.ts`, `s3.ts`.

---

## 7. PRIVATE NOTES SYSTEM (`/notes/*`)
The portfolio includes a **fully functional Notion Pro clone** for private personal notes, accessible only to the authenticated user.

- **Authentication & Access:**
  - Entry point: Footer version text (`VER MM/YY`) links to `/notes/login`
  - Uses **JWT authentication via `jose`** (independent from NextAuth)
  - Token stored in `notes-auth` httpOnly cookie (30-day expiry)
  - Middleware protects `/notes/*` routes (excluding `/notes/login`)
  - Auth utilities: `src/lib/notes/jwt.ts`

- **Database Models:**
  - **Note**: `title`, `content` (Json/BlockNote blocks), `icon`, `coverImage`, `folderId`, `userId`, `isFavorite`, `isArchived`, `order`, timestamps
  - **Folder**: Hierarchical self-relations (`parentId`), `name`, `icon`, `color`, `userId`, `order`, timestamps
  - Both enforce cascade deletion when `User` is deleted
  - Migration: `20260908074729_add_notes_and_folders`

- **Core Components:**
  - **`NotesEditor`** (`src/components/notes/NotesEditor.tsx`): BlockNote editor with `@blocknote/react`, `@blocknote/shadcn`, `@blocknote/core` v0.54.0
  - **`NotesSidebar`** (`src/components/notes/NotesSidebar.tsx`): Collapsible sidebar with folders, favorites, archived notes, search trigger
  - **`NotesSearch`**: Cmd/Ctrl+K search modal with fuzzy matching
  - **`NotesGallery`**: Card-based gallery view with cover images and content previews
  - **`NotesTable`**: Sortable database-style table view
  - **`PageHeader`**: Icon picker, cover image uploader, inline title editor
  - **`PageProperties`**: Folder assignment, favorites toggle, archive status, timestamps

- **API Routes:**
  - `/api/notes/auth/login` (POST): Bcrypt password verification, JWT generation
  - `/api/notes/auth/verify` (GET): Validate current JWT
  - `/api/notes/auth/logout` (POST): Clear auth cookie
  - `/api/notes/pages` (GET/POST): List/create notes
  - `/api/notes/pages/[id]` (GET/PATCH/DELETE): Single note CRUD
  - `/api/notes/folders` (GET/POST): List/create folders
  - All routes use `getCurrentNotesUser()` for auth validation

- **Layout & Navigation:**
  - `src/app/notes/layout.tsx`: Main workspace layout with sidebar, manages auth state
  - `src/app/notes/page.tsx`: Landing page with "Your Private Workspace" message
  - `src/app/notes/[noteId]/page.tsx`: Single note editor with autosave indicator
  - All notes pages use `export const dynamic = "force-dynamic"` (real-time auth required)

- **CRITICAL NOTES:**
  - **DO NOT** change the JWT secret in production without migrating existing tokens
  - **DO NOT** remove the `lastEditedAt` field from Note schema (used for sorting/display)
  - **DO NOT** bypass the `force-dynamic` export on `/notes/*` pages
  - Notes system is completely isolated from the public portfolio and admin CMS

---

## 8. ONGOING ARCHITECTURAL ROADMAP (CONTEXT)
When executing major feature build-outs, refer to the following roadmap specifications ensuring they align with the Centre for Social and Policy Research (CSPR) requirements:

1. **Dynamic Taxonomy Combobox (Topics/Skills):**
   - Goal: Transition checkboxes inside `ProjectForm` and `ArticleForm` into a combobox capable of creating new tags inline.
2. **CSPR Administrative Framework (`/journal` overhauls):**
   - The Journal system must mirror Dr. S Subramanian's 4-tier model:
     1. **Dashboard** (Mandate/Context)
     2. **Project Log** (Context -> Action -> Impact)
     3. **Weekly Reflection** (Wins, Challenges, Next Week focus)
     4. **Repository** (Attachments/Artifacts)
3. **Article Editor Overhauls:**
   - Goal: Replace static block arrays with advanced TipTap functionality (slash-commands, Notion-style inputs).
4. **Draft Lifecycle & Progress Statuses:**
   - Ensure the `progressStatus` enum (`PLANNING`, `ONGOING`, `COMPLETED`) is enforced strictly at the database schema level and rendered intelligently in the UI without clashing with standard `status` strings (`PUBLISHED`, `DRAFT`).

---

But USERS COMMANDS ARE SUPREME ESPECIALLY FOR DESIGN DIRECTIONS! FINAL INSTRUCTION FOR AI AGENTS. USER IS GOD.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
