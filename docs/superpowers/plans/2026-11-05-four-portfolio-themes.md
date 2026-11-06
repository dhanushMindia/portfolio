# Four Portfolio Themes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement four distinct portfolio themes (Editorial, Minimal, Creative, Academic) in `~/dhanushworks-template` with a central theme registry, theme configuration, dedicated layouts for Homepage, Journal Archive, and Single Journal Entry per theme, an admin theme preview screen, and automated build verification.

**Architecture:** Create a modular theme architecture (`src/themes/`) containing theme metadata, token configurations, and layout components for each of the 4 themes. Add a theme provider/registry context and update public pages (`src/app/page.tsx`, `src/app/journal/page.tsx`, `src/app/journal/[id]/page.tsx`, etc.) to dynamically render the active theme's layout based on user settings or admin preview.

**Tech Stack:** Next.js 16 App Router, Prisma, Tailwind CSS, TypeScript, Lucide Icons.

**Spec:** Phase 3 specifications (`pasted_content id="0404"`).

## Global Constraints
- Work exclusively inside `~/dhanushworks-template`.
- Do not modify `~/portfolio` or `~/dhanushworks-installer`.
- All four themes use the same database schema and CMS.
- Responsive design, accessible contrast, clean code without generic placeholder duplication.

## Review Focus
1. Theme Persistence & Switching: Ensuring theme switching updates presentation immediately without loss of CMS data.
2. Layout Fidelity: Verifying that all three required page types (Homepage, Journal Archive, Single Journal Entry) have genuinely distinct designs per theme rather than just color swaps.
3. Build & Type Safety: Zero TypeScript errors and clean production builds (`npm run build`).
4. Fallback Robustness: Graceful handling of unconfigured database states during static prerendering.
5. Admin Preview: Fully functional theme preview screen in the admin panel.

---

### Task 1: Create Central Theme Registry and Types

**Files:**
- Create: `src/themes/types.ts`
- Create: `src/themes/registry.ts`
- Test: `src/themes/__tests__/registry.test.ts` (or verify via build/typecheck)

**Interfaces:**
- Produces: Theme interface, ThemeConfig, and themes array (editorial, minimal, creative, academic).

- [ ] **Step 1: Write `src/themes/types.ts` with theme definition types**

```typescript
export type ThemeId = 'editorial' | 'minimal' | 'creative' | 'academic';

export interface ThemeDefinition {
  id: ThemeId;
  name: string;
  description: string;
  badge: string;
  colors: {
    bgPrimary: string;
    bgSecondary: string;
    textMain: string;
    textMuted: string;
    accent: string;
    border: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
  };
}
```

- [ ] **Step 2: Create `src/themes/registry.ts` registering all 4 themes**

- [ ] **Step 3: Commit changes**

```bash
git add src/themes/types.ts src/themes/registry.ts
git commit -m "feat: add central theme types and registry"
```

---

### Task 2: Implement Theme Layout Components for Editorial Theme

**Files:**
- Create: `src/themes/editorial/EditorialHome.tsx`
- Create: `src/themes/editorial/EditorialJournalArchive.tsx`
- Create: `src/themes/editorial/EditorialJournalDetail.tsx`

**Interfaces:**
- Consumes: ThemeDefinition, Prisma data models.
- Produces: Editorial theme views.

- [ ] **Step 1: Build Editorial Homepage with serif magazine aesthetic, ivory backgrounds, and generous whitespace**
- [ ] **Step 2: Build Editorial Journal Archive & Detail views**
- [ ] **Step 3: Commit**

```bash
git add src/themes/editorial/
git commit -m "feat: add editorial theme layouts"
```

---

### Task 3: Implement Theme Layout Components for Minimal Theme

**Files:**
- Create: `src/themes/minimal/MinimalHome.tsx`
- Create: `src/themes/minimal/MinimalJournalArchive.tsx`
- Create: `src/themes/minimal/MinimalJournalDetail.tsx`

**Interfaces:**
- Consumes: ThemeDefinition, Prisma data models.
- Produces: Minimal theme views.

- [ ] **Step 1: Build Minimal Homepage with clean sans-serif typography, monochromatic palette, and crisp cards**
- [ ] **Step 2: Build Minimal Journal Archive & Detail views**
- [ ] **Step 3: Commit**

```bash
git add src/themes/minimal/
git commit -m "feat: add minimal theme layouts"
```

---

### Task 4: Implement Theme Layout Components for Creative Theme

**Files:**
- Create: `src/themes/creative/CreativeHome.tsx`
- Create: `src/themes/creative/CreativeJournalArchive.tsx`
- Create: `src/themes/creative/CreativeJournalDetail.tsx`

**Interfaces:**
- Consumes: ThemeDefinition, Prisma data models.
- Produces: Creative theme views.

- [ ] **Step 1: Build Creative Homepage with expressive typography, bold accent colors, and asymmetric layouts**
- [ ] **Step 2: Build Creative Journal Archive & Detail views**
- [ ] **Step 3: Commit**

```bash
git add src/themes/creative/
git commit -m "feat: add creative theme layouts"
```

---

### Task 5: Implement Theme Layout Components for Academic Theme

**Files:**
- Create: `src/themes/academic/AcademicHome.tsx`
- Create: `src/themes/academic/AcademicJournalArchive.tsx`
- Create: `src/themes/academic/AcademicJournalDetail.tsx`

**Interfaces:**
- Consumes: ThemeDefinition, Prisma data models.
- Produces: Academic theme views.

- [ ] **Step 1: Build Academic Homepage with structured information hierarchy, research-oriented presentation, and formal styling**
- [ ] **Step 2: Build Academic Journal Archive & Detail views**
- [ ] **Step 3: Commit**

```bash
git add src/themes/academic/
git commit -m "feat: add academic theme layouts"
```

---

### Task 6: Implement Theme Dispatcher / Router & Admin Preview Screen

**Files:**
- Create: `src/components/themes/ThemeWrapper.tsx`
- Create: `src/app/admin/appearance/page.tsx`
- Modify: `src/app/page.tsx`, `src/app/journal/page.tsx`

**Interfaces:**
- Consumes: Theme registry and theme layouts.
- Produces: Dynamic theme switching and admin appearance preview.

- [ ] **Step 1: Create `ThemeWrapper` to dynamically select and render the correct theme layout**
- [ ] **Step 2: Build Admin Appearance & Theme Preview screen (`src/app/admin/appearance/page.tsx`)**
- [ ] **Step 3: Update public pages to use theme layouts**
- [ ] **Step 4: Verify build with `npm run build`**
- [ ] **Step 5: Commit**

```bash
git add src/themes/ src/components/themes/ src/app/admin/appearance/
git commit -m "feat: implement theme dispatcher and admin appearance preview"
```

---

### Task 7: Documentation & GitHub Publication

**Files:**
- Create: `THEME_GUIDE.md`

- [ ] **Step 1: Write comprehensive `THEME_GUIDE.md` documenting themes and architecture**
- [ ] **Step 2: Run final build verification (`npm run build`)**
- [ ] **Step 3: Final commit**

```bash
git add THEME_GUIDE.md
git commit -m "docs: add comprehensive theme guide"
```
