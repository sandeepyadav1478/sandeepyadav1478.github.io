# Plan 4c: Clone Wiring Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire the personal site clone with the full sora content aggregator infra, enable 6 real source handles, fix profile links, and harden CI/CD workflows.

**Architecture:** Surgical file copy from the sora template (`/Users/sandeep.yadav/tmp/sora`) into the clone (`/Users/sandeep.yadav/tmp/personal-site`). No full merge — repos share no git history. Personal content in `config.ts` is never overwritten. Each task is independently testable and committable.

**Tech Stack:** Node 22 ESM, Astro v5, pnpm 10.11.1, GitHub Actions, Tabler SVG icons.

## Global Constraints

- **Template source:** `/Users/sandeep.yadav/tmp/sora`
- **Clone target:** `/Users/sandeep.yadav/tmp/personal-site`
- **Never touch personal content** in `src/config.ts` (bio, works, experience, skills, awards)
- **Never commit secrets** — `WAKATIME_API_KEY` goes in GitHub Actions encrypted secrets only
- **No Co-Authored-By** lines in any commit
- **Git identity** must be `sandeepyadav1478 <sandeepyadav1478@gmail.com>` — verify before each commit
- `sync-report.json` must be in `.gitignore` (never committed)
- All sources disabled by default except the 6 explicitly enabled below

---

### Task 1: Copy scripts infra + add `test:sync` to package.json

**Files:**
- Create: `scripts/` (entire directory from template)
- Create: `src/data/sources-cache.json`
- Modify: `package.json`
- Modify: `.gitignore`

**Interfaces:**
- Produces: `npm run test:sync` command; `scripts/sync-sources.mjs` CLI

- [ ] **Step 1: Verify git identity**

```bash
git -C /Users/sandeep.yadav/tmp/personal-site config user.name
git -C /Users/sandeep.yadav/tmp/personal-site config user.email
```

Expected: `sandeepyadav1478` and `sandeepyadav1478@gmail.com`. If wrong, set them:
```bash
git -C /Users/sandeep.yadav/tmp/personal-site config user.name "sandeepyadav1478"
git -C /Users/sandeep.yadav/tmp/personal-site config user.email "sandeepyadav1478@gmail.com"
```

- [ ] **Step 2: Copy the entire scripts directory**

```bash
cp -r /Users/sandeep.yadav/tmp/sora/scripts /Users/sandeep.yadav/tmp/personal-site/scripts
```

- [ ] **Step 3: Copy the empty sources-cache skeleton**

```bash
mkdir -p /Users/sandeep.yadav/tmp/personal-site/src/data
cp /Users/sandeep.yadav/tmp/sora/src/data/sources-cache.json /Users/sandeep.yadav/tmp/personal-site/src/data/sources-cache.json
```

- [ ] **Step 4: Add `test:sync` and `sync:sources` scripts to `package.json`**

Open `/Users/sandeep.yadav/tmp/personal-site/package.json` and add two entries to the `"scripts"` block:

```json
"test:sync": "node --test 'scripts/__tests__/*.test.mjs'",
"sync:sources": "node scripts/sync-sources.mjs"
```

The full scripts block becomes:
```json
"scripts": {
  "dev": "astro dev",
  "build": "astro check && astro build && pagefind --site dist && cp -r dist/pagefind public/",
  "preview": "astro preview",
  "sync": "astro sync",
  "astro": "astro",
  "format:check": "prettier --check .",
  "format": "prettier --write .",
  "lint": "eslint .",
  "test:sync": "node --test 'scripts/__tests__/*.test.mjs'",
  "sync:sources": "node scripts/sync-sources.mjs"
}
```

- [ ] **Step 5: Add `sync-report.json` to `.gitignore`**

Open `/Users/sandeep.yadav/tmp/personal-site/.gitignore` and add at the end:

```
sync-report.json
```

- [ ] **Step 6: Run the test suite to confirm 103 tests pass**

```bash
cd /Users/sandeep.yadav/tmp/personal-site && npm run test:sync
```

Expected: `# pass 103 # fail 0`

- [ ] **Step 7: Commit**

```bash
git -C /Users/sandeep.yadav/tmp/personal-site add scripts/ src/data/sources-cache.json package.json .gitignore
git -C /Users/sandeep.yadav/tmp/personal-site commit -m "feat(sync): add content aggregator scripts + test:sync script"
```

---

### Task 2: Add `src/config.sources.mjs` with real handles

**Files:**
- Create: `src/config.sources.mjs`

**Interfaces:**
- Produces: `SOURCES` export consumed by `scripts/sync-sources.mjs`

- [ ] **Step 1: Copy from template**

```bash
cp /Users/sandeep.yadav/tmp/sora/src/config.sources.mjs /Users/sandeep.yadav/tmp/personal-site/src/config.sources.mjs
```

- [ ] **Step 2: Enable real sources**

Replace the entire content of `/Users/sandeep.yadav/tmp/personal-site/src/config.sources.mjs` with:

```js
// SOURCES — single source of truth for the content aggregator.
// Plain JS so BOTH the Node orchestrator (scripts/) and Astro (via config.ts) can import it.
// SECURITY: this repo is public. Never put secrets here — only public handles.
export const SOURCES = {
  github: {
    enabled: true,
    handle: "sandeepyadav1478",
    maxCommits: 25,
  },
  codeforces: {
    enabled: true,
    handle: "sandeepyadav1478",
    maxRatings: 50,
  },
  pypi: {
    enabled: true,
    handle: "sqloutbox",
    maxPackages: 25,
  },
  npm: {
    enabled: false,
    packages: [],
    maxPackages: 25,
  },
  rss: {
    enabled: false,
    feeds: [],
    maxPosts: 50,
  },
  youtube: {
    enabled: false,
    handle: "",
    maxVideos: 15,
  },
  stackoverflow: {
    enabled: false,
    handle: "",
    maxPosts: 25,
  },
  bluesky: {
    enabled: false,
    handle: "",
    maxPosts: 25,
  },
  mastodon: {
    enabled: false,
    instance: "",
    user: "",
    maxPosts: 25,
  },
  huggingface: {
    enabled: true,
    handle: "sandeepyadav1478",
    maxBadges: 50,
  },
  wakatime: {
    enabled: true,
    handle: "sandeepyadav1478",
    profileUrl: "https://wakatime.com/@sandeepyadav1478",
    range: "last_7_days",
  },
  leetcode: {
    enabled: true,
    handle: "sandeepyadav1478",
  },
};
```

- [ ] **Step 3: Verify the config is importable and test suite still passes**

```bash
cd /Users/sandeep.yadav/tmp/personal-site && node -e "import('./src/config.sources.mjs').then(m => console.log('sources:', Object.keys(m.SOURCES).length))"
```

Expected: `sources: 12`

```bash
npm run test:sync
```

Expected: `# pass 103 # fail 0`

- [ ] **Step 4: Commit**

```bash
git -C /Users/sandeep.yadav/tmp/personal-site add src/config.sources.mjs
git -C /Users/sandeep.yadav/tmp/personal-site commit -m "feat(config): enable real source handles (github, pypi, codeforces, hf, wakatime, leetcode)"
```

---

### Task 3: Add `ACTIVITY_DISPLAY` + `showActivity` to `src/config.ts`

**Files:**
- Modify: `src/config.ts`

**Interfaces:**
- Produces: `ACTIVITY_DISPLAY` export consumed by `ActivityCard.astro`

- [ ] **Step 1: Add `showActivity` to `SECTIONS`**

In `/Users/sandeep.yadav/tmp/personal-site/src/config.ts`, find the `SECTIONS` block (around line 94). The block currently ends with:

```ts
  showContact: false,
} as const;
```

Add `showActivity` before the closing:

```ts
  showContact: false,
  showActivity: true, // GitHub/social activity feed (content aggregator)
} as const;
```

- [ ] **Step 2: Insert `ACTIVITY_DISPLAY` block after `SECTIONS`**

After the `} as const;` that closes `SECTIONS` (around line 111), insert:

```ts
// ============================================================================
// ACTIVITY_DISPLAY — Controls which payload fields appear as badges/tooltips
// on ActivityCard items. Each field is opt-in. All false = no badges shown.
// ============================================================================
export const ACTIVITY_DISPLAY = {
  // commit
  commit_branch:     true,  // ⎇ branch name badge
  commit_tooltip:    true,  // hover: commit message

  // release
  release_version:   true,  // 🏷 version tag badge
  release_tooltip:   true,  // hover: repo name

  // package (npm + pypi)
  package_version:   true,  // 📦 version badge
  package_downloads: false, // ⬇ download count badge (omitted if absent)
  package_tooltip:   true,  // hover: registry name (npm / pypi)

  // post (rss, bluesky, mastodon, stackoverflow)
  post_feed:         true,  // 📰 feed/platform name badge
  post_tooltip:      true,  // hover: excerpt (first 120 chars)

  // video (youtube)
  video_views:       true,  // ▶ view count badge (omitted if 0)
  video_tooltip:     true,  // hover: channel name

  // rating — codeforces
  cf_rating:         true,  // ★ rating badge
  cf_rank:           true,  // # rank badge
  cf_tooltip:        true,  // hover: Contest #<id>

  // rating — wakatime
  waka_time:         true,  // ⏱ total coding time badge
  waka_avg:          true,  // avg/day badge (omitted if absent)
  waka_tooltip:      true,  // hover: top languages

  // rating — leetcode
  lc_solved:         true,  // ✓ solved count badge
  lc_rank:           true,  // # global rank badge (formatted)
  lc_tooltip:        true,  // hover: Easy X · Medium Y · Hard Z

  // badge — huggingface
  hf_downloads:      true,  // ⬇ download count badge
  hf_likes:          true,  // ♥ likes badge (omitted if 0)
  hf_tooltip:        true,  // hover: label + top 3 tags
} as const;
```

Note: Personal site ships with all display flags `true` (unlike the template which ships `false`). This is intentional — you want the full payload visible on your site.

- [ ] **Step 3: Build to confirm TypeScript accepts it**

```bash
cd /Users/sandeep.yadav/tmp/personal-site && pnpm run build 2>&1 | grep -c "error TS"
```

Expected: `0`

- [ ] **Step 4: Commit**

```bash
git -C /Users/sandeep.yadav/tmp/personal-site add src/config.ts
git -C /Users/sandeep.yadav/tmp/personal-site commit -m "feat(config): add ACTIVITY_DISPLAY flags (all true) + showActivity to SECTIONS"
```

---

### Task 4: Copy new icons + ActivityCard + add Topmate icon

**Files:**
- Create: `src/assets/icons/IconDownload.svg`
- Create: `src/assets/icons/IconHeart.svg`
- Create: `src/assets/icons/IconClock.svg`
- Create: `src/assets/icons/IconCode.svg`
- Create: `src/assets/icons/IconTrophy.svg`
- Create: `src/assets/icons/IconTopmate.svg`
- Create: `src/components/ActivityCard.astro`
- Modify: `src/constants.ts`

**Interfaces:**
- Consumes: `ACTIVITY_DISPLAY` from Task 3
- Produces: `ActivityCard` component; `Topmate` entry in `ICON_MAP`

- [ ] **Step 1: Copy the 5 payload icons from template**

```bash
for icon in IconDownload IconHeart IconClock IconCode IconTrophy; do
  cp /Users/sandeep.yadav/tmp/sora/src/assets/icons/${icon}.svg \
     /Users/sandeep.yadav/tmp/personal-site/src/assets/icons/${icon}.svg
done
```

- [ ] **Step 2: Create `IconTopmate.svg`**

Create `/Users/sandeep.yadav/tmp/personal-site/src/assets/icons/IconTopmate.svg`:

```svg
<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-external-link"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 6h-6a2 2 0 0 0 -2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-6" /><path d="M11 13l9 -9" /><path d="M15 4h5v5" /></svg>
```

- [ ] **Step 3: Copy `ActivityCard.astro` from template**

```bash
cp /Users/sandeep.yadav/tmp/sora/src/components/ActivityCard.astro \
   /Users/sandeep.yadav/tmp/personal-site/src/components/ActivityCard.astro
```

- [ ] **Step 4: Add Topmate to `ICON_MAP` in `src/constants.ts`**

In `/Users/sandeep.yadav/tmp/personal-site/src/constants.ts`:

Add the import after the last existing icon import (after `IconCalendar`):
```ts
import IconTopmate from "@/assets/icons/IconTopmate.svg";
```

Add `Topmate` entry to `ICON_MAP`:
```ts
  Topmate: IconTopmate,
```

The full `ICON_MAP` becomes:
```ts
const ICON_MAP: Record<string, (_props: Props) => Element> = {
  GitHub: IconGitHub,
  X: IconBrandX,
  LinkedIn: IconLinkedin,
  Mail: IconMail,
  WhatsApp: IconWhatsapp,
  Facebook: IconFacebook,
  Telegram: IconTelegram,
  Pinterest: IconPinterest,
  Calendly: IconCalendar,
  Topmate: IconTopmate,
};
```

- [ ] **Step 5: Add Topmate + fix calendlyUrl in `src/config.ts`**

In `/Users/sandeep.yadav/tmp/personal-site/src/config.ts`:

**A. Fix `CONNECT.calendlyUrl`** — find the placeholder and replace:
```ts
calendlyUrl: "https://calendly.com/sandeepyadav1478",
```

**B. Add Topmate to `SOCIALS_CONFIG`**:
```ts
export const SOCIALS_CONFIG = [
  { name: "GitHub", url: "https://github.com/sandeepyadav1478" },
  { name: "X", url: "https://x.com/sandeepyadav148" },
  { name: "LinkedIn", url: "https://www.linkedin.com/in/sandeepyadav1478/" },
  { name: "Topmate", url: "https://topmate.io/sandeepyadav1478" },
] as const;
```

- [ ] **Step 6: Build to confirm no errors**

```bash
cd /Users/sandeep.yadav/tmp/personal-site && pnpm run build 2>&1 | grep -E "^.*error" | head -5
```

Expected: no TypeScript or build errors.

- [ ] **Step 7: Commit**

```bash
git -C /Users/sandeep.yadav/tmp/personal-site add \
  src/assets/icons/IconDownload.svg \
  src/assets/icons/IconHeart.svg \
  src/assets/icons/IconClock.svg \
  src/assets/icons/IconCode.svg \
  src/assets/icons/IconTrophy.svg \
  src/assets/icons/IconTopmate.svg \
  src/components/ActivityCard.astro \
  src/constants.ts \
  src/config.ts
git -C /Users/sandeep.yadav/tmp/personal-site commit -m "feat(ui): add payload icons, ActivityCard with badges/tooltips, Topmate social link"
```

---

### Task 5: Add `sync-sources.yml` workflow

**Files:**
- Create: `.github/workflows/sync-sources.yml`

**Interfaces:**
- Consumes: `WAKATIME_API_KEY` GitHub Actions secret (set manually after merge)
- Produces: daily automated sync + failure issue management

- [ ] **Step 1: Copy from template**

```bash
cp /Users/sandeep.yadav/tmp/sora/.github/workflows/sync-sources.yml \
   /Users/sandeep.yadav/tmp/personal-site/.github/workflows/sync-sources.yml
```

- [ ] **Step 2: Verify the file is syntactically readable**

```bash
node -e "require('fs').readFileSync('/Users/sandeep.yadav/tmp/personal-site/.github/workflows/sync-sources.yml','utf8'); console.log('ok')"
```

Expected: `ok`

- [ ] **Step 3: Commit**

```bash
git -C /Users/sandeep.yadav/tmp/personal-site add .github/workflows/sync-sources.yml
git -C /Users/sandeep.yadav/tmp/personal-site commit -m "feat(ci): add daily sync-sources workflow"
```

---

### Task 6: Harden existing workflows

**Files:**
- Modify: `.github/workflows/ci.yml`
- Modify: `.github/workflows/deploy.yml`
- Modify: `.github/workflows/sync-upstream.yml`

**Interfaces:**
- Produces: Node 22 CI, frozen lockfile, test:sync in CI, concurrency guards

- [ ] **Step 1: Update `ci.yml`**

Apply these three changes to `/Users/sandeep.yadav/tmp/personal-site/.github/workflows/ci.yml`:

**A. Node version** — change `node-version: [20]` to `node-version: [22]`

**B. Frozen lockfile** — change `run: pnpm install` to `run: pnpm install --frozen-lockfile`

**C. Add test:sync step** — insert between the format:check step and the build step:

```yaml
      - name: "🧪 Run sync tests"
        run: pnpm run test:sync
```

The final `ci.yml`:

```yaml
name: CI

permissions:
  contents: read

on:
  pull_request:
    types:
      - opened
      - edited
      - synchronize
      - reopened
  workflow_call:

jobs:
  build:
    name: Code standards & build
    runs-on: ubuntu-latest
    timeout-minutes: 10

    strategy:
      matrix:
        node-version: [22]

    steps:
      - name: "☁️ Checkout repository"
        uses: actions/checkout@v4

      - name: "📦 Install pnpm"
        uses: pnpm/action-setup@v4
        with:
          version: 10.11.1

      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: "pnpm"

      - name: "📦 Install dependencies"
        run: pnpm install --frozen-lockfile

      - name: "🔎 Lint code"
        run: pnpm run lint

      - name: "📝 Checking code format"
        run: pnpm run format:check

      - name: "🧪 Run sync tests"
        run: pnpm run test:sync

      - name: "🚀 Build the project"
        run: pnpm run build
```

Note: timeout bumped to 10 minutes (was 3) to accommodate the test:sync step.

- [ ] **Step 2: Update `deploy.yml`**

Apply two changes to `/Users/sandeep.yadav/tmp/personal-site/.github/workflows/deploy.yml`:

**A. pnpm version** — change `version: 10` to `version: 10.11.1`

**B. Frozen lockfile** — change `run: pnpm install` to `run: pnpm install --frozen-lockfile`

- [ ] **Step 3: Update `sync-upstream.yml`**

Apply three changes to `/Users/sandeep.yadav/tmp/personal-site/.github/workflows/sync-upstream.yml`:

**A. Add concurrency block** — after `permissions:` block, add:

```yaml
concurrency:
  group: sync-upstream
  cancel-in-progress: true
```

**B. Add timeout** — add `timeout-minutes: 10` to the `sync:` job.

**C. Conflict-marker guard** — in the merge conflict path, after `git merge upstream/main --no-edit --allow-unrelated-histories || true`, add:

```yaml
            git diff --check || { echo "::error::Unresolved conflicts after retry — manual fix required"; exit 1; }
```

- [ ] **Step 4: Verify all three workflow files are readable**

```bash
for f in ci.yml deploy.yml sync-upstream.yml; do
  node -e "require('fs').readFileSync('/Users/sandeep.yadav/tmp/personal-site/.github/workflows/$f','utf8'); console.log('$f ok')"
done
```

Expected: 3 `ok` lines.

- [ ] **Step 5: Run full test suite to confirm nothing broken**

```bash
cd /Users/sandeep.yadav/tmp/personal-site && npm run test:sync
```

Expected: `# pass 103 # fail 0`

- [ ] **Step 6: Commit**

```bash
git -C /Users/sandeep.yadav/tmp/personal-site add \
  .github/workflows/ci.yml \
  .github/workflows/deploy.yml \
  .github/workflows/sync-upstream.yml
git -C /Users/sandeep.yadav/tmp/personal-site commit -m "fix(ci): Node 22, frozen-lockfile, test:sync in CI, concurrency guards on upstream sync"
```

---

### Task 7: Push + set WAKATIME_API_KEY secret

**Files:** None (push + manual secret setup)

- [ ] **Step 1: Verify git identity one final time**

```bash
git -C /Users/sandeep.yadav/tmp/personal-site config user.name
git -C /Users/sandeep.yadav/tmp/personal-site config user.email
```

Expected: `sandeepyadav1478` / `sandeepyadav1478@gmail.com`

- [ ] **Step 2: Run full build to confirm everything is green**

```bash
cd /Users/sandeep.yadav/tmp/personal-site && pnpm run build 2>&1 | grep -E "error|Error" | grep -v "0 errors" | head -5
```

Expected: no errors.

- [ ] **Step 3: Push to origin**

```bash
git -C /Users/sandeep.yadav/tmp/personal-site push origin main
```

- [ ] **Step 4: Add WAKATIME_API_KEY secret (manual)**

After push:
1. Go to `https://github.com/sandeepyadav1478/sandeepyadav1478.github.io/settings/secrets/actions`
2. Click **New repository secret**
3. Name: `WAKATIME_API_KEY`
4. Value: your WakaTime API key from `https://wakatime.com/settings/account` (copy the "Secret API Key")
5. Click **Add secret**

- [ ] **Step 5: Trigger a manual sync run to verify end-to-end**

After adding the secret:
1. Go to `https://github.com/sandeepyadav1478/sandeepyadav1478.github.io/actions/workflows/sync-sources.yml`
2. Click **Run workflow** → **Run workflow**
3. Wait for it to complete (~2-3 minutes)
4. Verify: the run should show green, `src/data/sources-cache.json` should have items committed, no `[Sora] Sync failures` issue opened
