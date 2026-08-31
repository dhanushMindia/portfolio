# Architecture Checkpoint — Personal Research Portfolio Platform

**Date:** 2026-08-31  
**Status:** Foundation complete, corrections applied, ready for admin UI and content seeding

---

## 1. Information Architecture ✅

**Content Model:**
- **Project** — research work, analysis, case studies (block-based content)
- **Article** — essays, long-form writing (block-based content)
- **JournalEntry** — weekly logs (structured fields + relations)
- **Topic** — research areas that aggregate work
- **Skill** — methods/tools with evidence-based usage tracking
- **Tag** — lightweight categorization
- **MediaAsset** — reusable files with visibility controls
- **Source** — citations and references

**Design Principle:** Permanent, extensible platform for years of diverse work — NOT tied to a single organization or internship. CSPR content is the first seed data, not the site's identity.

---

## 2. Database Entities ✅

**Core Models:**
- `User` (single owner)
- `Profile` (site identity — name, role, bio, current focus)
- `Project`, `Article`, `JournalEntry` (main content)
- `Topic`, `Skill`, `Tag` (taxonomy)
- `MediaAsset`, `Source` (supporting content)

**Relationship Tables:**
- `ProjectTopic`, `ProjectSkill`, `ProjectTag`
- `ArticleTopic`, `ArticleTag`
- `JournalEntryProject`, `JournalEntrySkill`
- `ProjectRelation` (related work links)

**Status System:** `DRAFT → PUBLISHED → ARCHIVED`  
**Visibility System:** `PRIVATE | UNLISTED | PUBLIC`

---

## 3. Relationship Model ✅

**Many-to-Many Relationships:**
- Projects ↔ Topics (organizing layer)
- Projects ↔ Skills (evidence-based tracking)
- Projects ↔ Tags (lightweight categorization)
- Articles ↔ Topics, Articles ↔ Tags
- JournalEntries ↔ Projects (weekly work documentation)
- JournalEntries ↔ Skills (skill usage evidence)
- Projects ↔ Projects (related work)

**Cascade Deletes:** Enabled on all join tables via `onDelete: Cascade`

---

## 4. Visibility Model ✅

**Privacy Defaults (CORRECTED):**
- `Project.visibility = PRIVATE` ✅
- `Article.visibility = PRIVATE` ✅
- `JournalEntry.visibility = PRIVATE` ✅ **FIXED** (was PUBLIC)
- `MediaAsset.visibility = PRIVATE` ✅

**Enforcement:**
- All public API routes filter by `status: PUBLISHED` AND `visibility: PUBLIC` for unauthenticated requests
- Authenticated requests see everything
- Filtering applied at query level (not post-query)
- Consistent across all endpoints: `/api/projects`, `/api/articles`, `/api/journal`, `/api/search`, `/api/media`

**Publishing Workflow:**
1. Create → Save (DRAFT, PRIVATE by default)
2. Review privately
3. Explicitly set `status: PUBLISHED` + `visibility: PUBLIC`
4. Nothing becomes public without intentional action

---

## 5. Authentication Model ✅

**Implementation:** NextAuth.js v5 (Auth.js)
- Single Credentials provider (email/password)
- Bcrypt password hashing
- JWT sessions (no database sessions)
- Middleware protects `/admin/*` routes
- Single owner model (no multi-user complexity)

**Files:**
- `src/lib/auth.ts` — NextAuth configuration
- `src/middleware.ts` — Route protection
- `src/app/login/page.tsx` — Login form

---

## 6. Media Storage Architecture ⚠️ **FIXED**

**Previous (WRONG):**
```typescript
// ❌ Used filesystem: writeFile to public/uploads/
await writeFile(join(process.cwd(), "public", "uploads", fileName), buffer);
```

**Current (CORRECT):**
```typescript
// ✅ Uses S3-compatible object storage
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
```

**Implementation:**
- `src/lib/storage.ts` — S3 client, upload/delete/signed URL generation
- `src/app/api/media/route.ts` — Rewritten to use object storage
- Works with AWS S3, Supabase Storage, Cloudflare R2, any S3-compatible service

**Required Environment Variables:**
```bash
S3_ENDPOINT="https://your-endpoint"
S3_REGION="auto"
S3_BUCKET="your-bucket"
S3_ACCESS_KEY="..."
S3_SECRET_KEY="..."
S3_PUBLIC_URL="..."  # Optional
```

**Visibility Handling:**
- Public assets: direct URL
- Private/Unlisted assets: signed URLs (expire in 1 hour)
- Enforced in `getMediaUrl()` utility

**Dependencies Added:**
- `@aws-sdk/client-s3@^3.705.0`
- `@aws-sdk/s3-request-presigner@^3.705.0`

---

## 7. Block Architecture ✅

**Content Storage:** JSON arrays in database (`Project.blocks`, `Article.content`)

**Block Types Defined (17+):**
- Text: `richText`, `heading`, `quote`
- Visual: `image`, `imageGallery`, `embed`
- Data: `chart`, `metric`, `table`, `timeline`
- Structural: `twoColumn`, `divider`, `callout`
- Research: `methodology`, `keyFinding`, `sourceList`, `relatedWork`
- Code: `code`

**Editing System:**
- TipTap for rich text blocks
- @dnd-kit for drag-and-drop reordering
- Block toolbar for insertion
- Individual block controls (edit/delete)

**Files:**
- `src/types/blocks.ts` — TypeScript definitions
- `src/lib/blocks.ts` — Utilities (createBlock, reorderBlocks, getBlockPlainText)
- `src/components/blocks/BlockRenderer.tsx` — Public rendering (created)
- `src/components/admin/Editor/` — Admin editing (NOT YET CREATED)

---

## 8. Publishing Workflow ✅

**Content Lifecycle:**
```
CREATE → DRAFT + PRIVATE (default)
       ↓
    REVIEW privately (authenticated access only)
       ↓
    EXPLICITLY PUBLISH (set status=PUBLISHED, visibility=PUBLIC)
       ↓
    PUBLIC (visible to world)
```

**API Enforcement:**
- POST endpoints create with `status: DRAFT`, `visibility: PRIVATE` by default
- PUT endpoints allow status/visibility changes
- GET endpoints filter unauthenticated requests
- `publishedAt` timestamp set automatically on first publish

**Admin UI Indicators (TO BE BUILT):**
- Visual badges for DRAFT/PUBLISHED/ARCHIVED status
- Color coding for PRIVATE/UNLISTED/PUBLIC visibility
- Clear warning when publishing private → public

---

## 9. Future Extensibility Strategy ✅

**Design Decisions for Long-Term Use:**

1. **Content Model Independence**
   - Not tied to any single organization
   - Profile system supports role changes over time
   - Topics and tags accommodate diverse work

2. **Block System Flexibility**
   - New block types can be added without schema changes
   - JSON storage allows block evolution
   - Renderer handles unknown blocks gracefully

3. **Relationship Scalability**
   - Many-to-many relationships support complex cross-referencing
   - ProjectRelation enables project networks
   - Journal ↔ Project links preserve work context

4. **Media Architecture**
   - Object storage supports large files
   - Visibility system protects sensitive materials
   - Asset reuse across multiple projects

5. **Navigation Permanence**
   - `/work` not `/projects` (broader than just internship)
   - `/research` for topic-based organization
   - `/journal` for continuous documentation
   - `/writing` for essays and analysis

6. **Skill Evidence Model**
   - Skills link to actual projects/journals
   - Automatic usage counting
   - Category system for organization

---

## Critical Fixes Applied

### 1. Privacy Default Bug ✅
**File:** `prisma/schema.prisma:94`
```diff
- visibility     Visibility            @default(PUBLIC)
+ visibility     Visibility            @default(PRIVATE)
```

### 2. Media Storage Architecture ✅
**Files Created:**
- `src/lib/storage.ts` — S3 client utilities
- `src/app/api/media/route.ts` — Rewritten for object storage

**Files Updated:**
- `package.json` — Added AWS SDK dependencies
- `.env.example` — Added S3 configuration

---

## Remaining Work

### Immediate (Before Seed Data):
1. **Admin Dashboard** — Overview, stats, quick actions
2. **Admin Editors:**
   - Project editor with block system
   - Article editor with block system
   - Journal entry creator (fast workflow)
   - Media library with upload/browse
   - Topic/skill/tag management
3. **Block Editor Components:**
   - BlockEditor container
   - Individual block editors (RichTextBlock, ImageBlock, ChartBlock, etc.)
   - Block toolbar for insertion
   - Drag-and-drop implementation

### Before Production:
4. **Seed Data** — CSPR internship content (projects, journal, skills, topics)
5. **Responsive Polish** — Mobile optimization, touch interactions
6. **Accessibility Audit** — ARIA labels, keyboard nav, screen reader testing
7. **Production Checklist:**
   - Database migration on production PostgreSQL
   - S3 bucket setup and configuration
   - Environment variables verified
   - Initial user creation
   - Profile seeding

---

## Technology Stack Summary

**Framework:** Next.js 15 (App Router, Server Components)  
**Database:** PostgreSQL + Prisma ORM  
**Auth:** NextAuth.js v5  
**Storage:** S3-compatible object storage  
**Styling:** Tailwind CSS + custom design system  
**Fonts:** Crimson Pro (serif), Inter (sans), JetBrains Mono (mono)  
**Charts:** Recharts  
**Editor:** TipTap (rich text), @dnd-kit (drag-and-drop)  
**Deployment:** Vercel (frontend) + managed PostgreSQL

---

## Security Model

**Threat Model:**
- Public visitors must NOT access private content by guessing URLs/IDs
- Visibility is enforced at database query level (not post-filter)
- Media uses signed URLs for private access
- Authentication required for all admin operations
- Single owner (no permission complexity)

**Conservative Confidentiality:**
- Default to PRIVATE everywhere
- Explicit publish action required
- Clear visual indicators in admin UI
- Separate visibility for project vs attached evidence

---

**Status:** Architecture validated, critical bugs fixed, ready to continue implementation.
