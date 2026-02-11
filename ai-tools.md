# AI Tools - Configuration & Setup

> Generated: 2026-02-11 | macOS Darwin 25.2.0 | doguyilmaz

---

## Setup Guide — For AI Assistants

When this document is provided for setting up a new device or project, follow this workflow:

### Step 0 — Detect environment

1. Auto-detect the **project root** — the directory containing `package.json` or `.claude/`. Store this as `PROJECT_ROOT` for all path-scoped permissions.
2. Detect the **OS and platform** (macOS, Linux, etc.) for any platform-specific config.
3. Check if `~/.claude/` already exists — if so, ask the user if this is a fresh setup or an existing one they want to update.
4. Check if `.claude/settings.local.json` exists in the project — if so, review existing permissions before overwriting.
5. Tell the user what you detected and confirm before proceeding.

### Step 1 — Ask the user

1. **What type of project?** (mobile / web / fullstack / library / other)
2. **What framework?** (Expo/RN, Next.js, React Router/Remix, Vite, etc.)
3. **What component library?** (HeroUI, shadcn/ui, custom, none yet)
4. **Backend?** (Supabase, Firebase, custom API, none)
5. **Deployment target?** (EAS/App Store/Play Store, Vercel, self-hosted, etc.)
6. **Any extras?** (email templates, video/Remotion, design-to-code, CI/CD)

### Step 2 — Quick repo scan

Inspect the project directory for:
- `package.json` — framework, dependencies, component libraries
- `app.config.ts` / `next.config.ts` / `vite.config.ts` — framework detection
- `eas.json` — EAS/Expo project
- `vercel.json` — Vercel project
- `firebase.json` / `supabase/` — backend detection
- Existing `.claude/` config — what's already set up

### Step 3 — Recommend from this document

Based on answers + scan, suggest:
- **Marketplaces** to add (from Marketplaces section)
- **Plugins** to enable/disable (from Plugins section — match tags to project type)
- **Skills** to install (from Skills + Available Skills sections — match tags and conditions)

### Step 4 — Resolve duplicates

Some skills exist in multiple repos. Ask the user which source to use:

| Skill | Sources | Notes |
|-------|---------|-------|
| frontend-design | `anthropics/skills`, `vercel-labs/agent-eval` | Vercel version explicitly avoids "AI slop" aesthetics — may be more opinionated |
| remotion | `vercel-labs/agent-skills` (as remotion-best-practices), `google-labs-code/stitch-skills` (as remotion) | Same topic, pick one |
| React Native best practices | `callstackincubator/agent-skills`, `vercel-labs/agent-skills` (vercel-react-native-skills) | Different perspectives — can use both, or pick based on focus (Callstack = deep RN perf, Vercel = broader React patterns) |
| Expo skills | `expo/skills` (plugin, installs local copies), `bunx add-skill expo/skills` (installs symlinks) | Same content, different install method. Prefer symlinks via `bunx add-skill` for single source of truth |

### Step 5 — (Optional) Discover more skills

After installing the basics, use `/find-skills` to search for additional skills not listed in this document. Useful when:
- The project uses a framework/library not covered here
- You need a niche skill (e.g. specific testing framework, database, API)
- New skills have been published since this doc was last updated

Requires `vercel-labs/skills` to be installed first (`bunx add-skill vercel-labs/skills`).

### Step 6 — Install

Use the install commands from the Quick Reference section below. Install marketplaces first, then plugins, then skills.

> **Prefer project-scoped over global.** Install only what's universally needed globally (e.g. core plugins like code-review, typescript-lsp, context7). Everything else — framework skills, component lib skills, backend plugins — should be installed per project. This keeps each project's context clean and avoids loading irrelevant skills that slow down responses and pollute suggestions. Use `.claude/settings.local.json` per project to enable/disable plugins as needed.

### Step 7 — Set up project permissions

Copy the base permissions template from the **Project Permissions** section below into `.claude/settings.local.json`. Then:

1. **Replace `PROJECT_ROOT`** with the path detected in Step 0.
2. **Add project-specific domains** — APIs, S3 buckets, docs sites the project uses (see the commented placeholder section in the template).
3. **Add project-specific CLI tools** — if the project uses tools not in the base template (e.g. `bunx prisma:*`, `Bash(docker:*)`), add scoped permissions for those.
4. **Review with the user** before writing the file.

Key principles:
- **Read-only by default** — file search, grep, git reads are safe to auto-allow.
- **Scope write operations to project dir** — `cat`, `mkdir` should use `PROJECT_ROOT/` prefix, not global `*`.
- **No blanket shell access** — never allow `bunx:*`, `curl:*`, `python3:*`, `node -e:*`, `echo:*`, `tee:*`. These enable arbitrary code execution or file writes. Scope to specific tools (e.g. `bunx expo:*`) or approve manually.
- **Git reads only** — `git status`, `git diff`, `git log`, `git branch` (list only). Never auto-allow git write operations (`push`, `commit`, `reset`, `checkout`, `branch -D`).

---

## Claude Code

### Quick Reference — Install Commands

```bash
# Install Claude Code (native — recommended)
curl -fsSL https://claude.ai/install.sh | bash

# Add a marketplace (plugins)
/plugin marketplace add <repo>          # e.g. anthropics/claude-plugins-official

# Add skills
bunx add-skill <repo>                   # e.g. expo/skills, vercel-labs/agent-skills
bunx skills add <repo>                   # single skill: bunx skills add <repo> --skill <name>

# Discover new skills
/find-skills                            # uses the find-skills skill to search
```

---

### Marketplaces (3)

| Marketplace | Repo | Auto-Update | Notes |
|-------------|------|-------------|-------|
| claude-plugins-official | `anthropics/claude-plugins-official` | No | Primary marketplace — Anthropic core + LSPs + external plugins |
| expo-plugins | `expo/skills` | Yes | Expo-specific plugins |
| callstack-agent-skills | `callstackincubator/agent-skills` | Yes | React Native focused |

---

### Plugins

Tags: `mobile` `web` `backend` `all` `devtool`

#### Active (17 enabled)

##### `anthropics/claude-plugins-official`

| Plugin | What it does | Tags |
|--------|-------------|------|
| ralph-loop | Automated loop agent — keeps working until task is fully done | `all` |
| code-review | Reviews code for bugs, logic errors, security vulnerabilities and quality issues | `all` |
| explanatory-output-style | Adds educational explanations and insights while coding | `all` |
| feature-dev | Guided feature development — explores codebase, plans architecture, then implements | `all` |
| hookify | Analyzes conversations to find mistakes and creates hooks to prevent them | `all` |
| security-guidance | Reviews code for security vulnerabilities and provides secure coding guidance | `all` |
| typescript-lsp | TypeScript language server — real-time diagnostics and type checking | `all` |
| code-simplifier | Simplifies and refines recently modified code for clarity and maintainability | `all` |
| github | GitHub CLI integration — PRs, issues, code review, branching strategies | `all` |
| supabase | Manages Supabase projects — migrations, SQL, edge functions, branches, types | `backend` |
| firebase | Manages Firebase — auth, Firestore, RTDB, crashlytics, storage, hosting, remote config | `backend` |
| context7 | Fetches up-to-date library docs and code examples for any framework | `all` |

##### `expo/skills`

| Plugin | What it does | Tags |
|--------|-------------|------|
| expo-app-design | Comprehensive Expo dev — UI building, data fetching, DOM components, dev client, Tailwind | `mobile` |
| expo-deployment | Deploy Expo apps to App Store, Play Store, web hosting, API routes with EAS | `mobile` |
| upgrading-expo | Step-by-step Expo SDK upgrade guidelines and dependency conflict resolution | `mobile` |

##### `callstackincubator/agent-skills`

| Name | What it does | Type | Tags |
|------|-------------|------|------|
| react-native-best-practices | RN performance — FPS, TTI, bundle size, memory, re-renders, animations, Hermes | plugin + skill | `mobile` |
| github | GitHub patterns via gh CLI — PRs, stacked PRs, code review, branching, automation | plugin + skill | `all` |

#### Disabled (6 installed — enable per project)

| Plugin | What it does | Tags | When to enable |
|--------|-------------|------|----------------|
| frontend-design | Production-grade web frontend interfaces with high design quality | `web` | Web/frontend projects |
| vercel | Deploy to Vercel, set up CLI, view deployment logs | `web` | Vercel-hosted projects |
| learning-output-style | Interactive mode — asks you to write key code sections yourself | `all` | When you want learning/pairing mode |
| plugin-dev | End-to-end plugin creation — scaffolding, agents, skills, hooks, MCP, validation | `devtool` | When building Claude plugins |
| pr-review-toolkit | Multi-agent PR review — silent failures, type design, test coverage, comments | `all` | Larger team projects, strict PR review |
| agent-sdk-dev | Tools and guidance for building custom agents with the Claude Agent SDK | `devtool` | When building custom Claude agents |

#### Available (not installed)

**Official:** clangd-lsp, claude-code-setup, claude-md-management, csharp-lsp, gopls-lsp, jdtls-lsp, kotlin-lsp, lua-lsp, php-lsp, rust-analyzer-lsp, swift-lsp

**External:** asana, gitlab, greptile, laravel-boost, linear, playwright, serena, slack, stripe

#### Callstack (skill only — not installable as plugins)

| Name | What it does | Tags |
|------|-------------|------|
| upgrading-react-native | RN upgrade workflow — templates, dependencies, common pitfalls | `mobile` |
| validate-skills | Validates skills against agentskills.io spec | `devtool` |

---

### Skills

Tags: `mobile` `web` `design` `all` `devtool`

#### `expo/skills` — Expo

> Install: `bunx add-skill expo/skills` (installs as symlinks → `~/.agents/skills/`)

| Skill | What it does | Tags |
|-------|-------------|------|
| building-native-ui | Complete guide for building Expo Router apps — styling, components, navigation, animations, native tabs | `mobile` |
| native-data-fetching | Network requests, API calls, data fetching — fetch, axios, React Query, SWR, caching, offline | `mobile` |
| upgrading-expo | Step-by-step Expo SDK upgrade guide and dependency conflict resolution | `mobile` |
| expo-dev-client | Build and distribute Expo development clients locally or via TestFlight | `mobile` |
| expo-tailwind-setup | Set up Tailwind CSS v4 in Expo with react-native-css and NativeWind v5 | `mobile` |
| expo-deployment | Deploy Expo apps to App Store, Play Store, web hosting, API routes | `mobile` |
| expo-api-routes | Create API routes in Expo Router with EAS Hosting | `mobile` |
| expo-cicd-workflows | Write and understand EAS workflow YAML files for CI/CD | `mobile` |
| use-dom | Run web code in webview on native via Expo DOM components | `mobile` |

#### `vercel-labs/agent-skills` — Vercel (8 skills, 265.2K installs)

| Skill | What it does | Source | Tags |
|-------|-------------|--------|------|
| vercel-react-best-practices | React/Next.js performance optimization guidelines from Vercel Engineering | symlink → .agents | `all` |
| vercel-react-native-skills | React Native + Expo best practices for performant mobile apps | symlink → .agents | `mobile` |
| vercel-composition-patterns | React composition patterns that scale — avoids boolean prop proliferation | symlink → .agents | `web` |
| web-design-guidelines | Reviews UI code against Web Interface Guidelines for accessibility and UX | symlink → .agents | `web` |
| remotion-best-practices | Best practices for creating videos programmatically in React using Remotion | symlink → .agents | `web` |

> 8 skills total — 5 listed above, `vercel-deploy` in available section, 2 unlisted.
> Install all: `bunx add-skill vercel-labs/agent-skills`

#### `vercel-labs/next-skills` — Vercel Next.js (14 skills, 14.9K installs)

| Skill | What it does | Source | Tags |
|-------|-------------|--------|------|
| next-best-practices | File conventions, RSC, data patterns, async APIs, metadata, error handling, bundling | symlink → .agents | `web` |
| next-cache-components | Next.js 16 cache — PPR, `use cache` directive, cacheLife, cacheTag, updateTag | symlink → .agents | `web` |
| next-upgrade | Upgrade Next.js to latest version following official migration guides | symlink → .agents | `web` |

> 14 skills total — 3 core listed above, rest is deep Next.js. Install all: `bunx add-skill vercel-labs/next-skills`

#### `vercel-labs/skills` — Vercel (2 skills, 183.1K installs)

| Skill | What it does | Source | Tags |
|-------|-------------|--------|------|
| find-skills | Discover and install new agent skills | symlink → .agents | `devtool` |

> 2 skills total — `find-skills` listed above. Install all: `bunx add-skill vercel-labs/skills`

#### `vercel-labs/agent-eval` — Vercel

| Skill | What it does | Source | Tags |
|-------|-------------|--------|------|
| frontend-design | Production-grade frontend interfaces — avoids generic "AI slop" aesthetics | alternative source | `web` `design` |

> Also available from `anthropics/skills`. Alternative source — may differ in content.
> Install: `bunx skills add vercel-labs/agent-eval --skill frontend-design`

#### `anthropics/skills` — Anthropic

| Skill | What it does | Source | Tags |
|-------|-------------|--------|------|
| frontend-design | Production-grade frontend interfaces with high design quality | symlink → .agents | `web` `design` |
| doc-coauthoring | Structured workflow for co-authoring documentation, proposals, and specs | symlink → .agents | `all` |
| algorithmic-art | Generative art using p5.js with seeded randomness and interactive parameters | symlink → .agents | `design` |
| brand-guidelines | Anthropic brand colors and typography for artifacts | symlink → .agents | `design` |
| canvas-design | Visual art in .png and .pdf using design philosophy for posters/designs | symlink → .agents | `design` |
| theme-factory | 10 pre-set themes with colors/fonts for slides, docs, reports, landing pages | symlink → .agents | `design` |
| ui-ux-pro-max | 50 styles, 21 palettes, 50 font pairings, 20 charts across 9 framework stacks | symlink → .agents | `design` |
| web-artifacts-builder | Multi-component HTML artifacts with React, Tailwind, shadcn/ui | symlink → .agents | `web` `design` |

#### `callstackincubator/agent-skills` — Callstack

> Listed above under their plugin marketplace (plugin + skill combined)

#### `ui-skills.com`

| Skill | What it does | Source | Tags |
|-------|-------------|--------|------|
| ui-skills | Opinionated constraints for building better interfaces with AI agents | local (`curl -fsSL https://ui-skills.com/install \| bash`) | `all` |

#### Available skills — install per project need

> When setting up a new device/project, match your needs below and install accordingly.
> Install: `bunx skills add <repo> --skill <name>` or `bunx add-skill <repo>` (all skills from repo)

##### Always install (any project)

| Condition | Skill | Repo | Install |
|-----------|-------|------|---------|
| Always — improves prompts, CLAUDE.md, agent instructions | enhance-prompt | `google-labs-code/stitch-skills` | `bunx skills add google-labs-code/stitch-skills --skill enhance-prompt` |

##### If mobile (Expo / React Native)

> Covered by `expo/skills` + `callstackincubator/agent-skills` + `vercel-labs/agent-skills`. Install all three repos first.

| Condition | Skill | Repo | Install |
|-----------|-------|------|---------|
| If using HeroUI Native as component lib | heroui-native | `heroui-inc/heroui` | `bunx skills add heroui-inc/heroui --skill heroui-native` |

##### If web (Next.js)

| Condition | Skill | Repo | Install |
|-----------|-------|------|---------|
| If Next.js project (full suite — 14 skills) | all next-skills | `vercel-labs/next-skills` | `bunx add-skill vercel-labs/next-skills` |
| If deploying to Vercel | vercel-deploy | `vercel-labs/agent-skills` | `bunx skills add vercel-labs/agent-skills --skill vercel-deploy` |
| If using shadcn/ui components | shadcn-ui | `google-labs-code/stitch-skills` | `bunx skills add google-labs-code/stitch-skills --skill shadcn-ui` |
| If using HeroUI for web | heroui-react | `heroui-inc/heroui` | `bunx skills add heroui-inc/heroui --skill heroui-react` |

##### If web (React Router / Remix)

| Condition | Skill | Repo | Install |
|-----------|-------|------|---------|
| If using React Router framework mode (Vite plugin) | react-router-framework-mode | `remix-run/agent-skills` | `bunx skills add remix-run/agent-skills --skill react-router-framework-mode` |
| If using React Router data mode (createBrowserRouter) | react-router-data-mode | `remix-run/agent-skills` | `bunx skills add remix-run/agent-skills --skill react-router-data-mode` |
| If using React Router declarative mode (BrowserRouter) | react-router-declarative-mode | `remix-run/agent-skills` | `bunx skills add remix-run/agent-skills --skill react-router-declarative-mode` |

> Note: Expo Router ≠ React Router. These are for web projects only.

##### If email templates needed

| Condition | Skill | Repo | Install |
|-----------|-------|------|---------|
| If building transactional/marketing emails with React | react-email | `resend/react-email` | `bunx skills add resend/react-email --skill react-email` |

##### If using Google Stitch for design-to-code

| Condition | Skill | Repo | Install |
|-----------|-------|------|---------|
| If converting Stitch designs to React components | react:components | `google-labs-code/stitch-skills` | `bunx skills add google-labs-code/stitch-skills --skill react:components` |
| If generating DESIGN.md from Stitch projects | design-md | `google-labs-code/stitch-skills` | `bunx skills add google-labs-code/stitch-skills --skill design-md` |
| If using Stitch autonomous build loop | stitch-loop | `google-labs-code/stitch-skills` | `bunx skills add google-labs-code/stitch-skills --skill stitch-loop` |

##### If video / Remotion

| Condition | Skill | Repo | Install |
|-----------|-------|------|---------|
| If creating programmatic videos with React | remotion-best-practices | `vercel-labs/agent-skills` | `bunx skills add vercel-labs/agent-skills --skill remotion-best-practices` |

> Alternative exists in `google-labs-code/stitch-skills` as `remotion` — same topic, pick one.

---

### Config Files

| File | What it stores |
|------|---------------|
| `~/.claude/CLAUDE.md` | Global coding instructions |
| `~/.claude/settings.json` | Which plugins are enabled/disabled |
| `~/.claude/plugins/installed_plugins.json` | Full plugin manifest with versions, install paths, timestamps |
| `~/.claude/plugins/known_marketplaces.json` | Marketplace registry — repos, update tracking, auto-update flags |
| `~/.claude/skills/` | Global skills directory (local folders + symlinks to `~/.agents/skills/`) |
| `~/.agents/skills/` | Source skills — 30 skills shared between Claude Code and Continue via symlinks |

---

### Global CLAUDE.md — `~/.claude/CLAUDE.md`

> **Status:** PROPOSED — review below, then apply to `~/.claude/CLAUDE.md`

```markdown
## Developer Profile

- Senior JS/TS engineer. Performance-sensitive, mobile-first.
- Prefers minimalism over abstraction. Strong opinions on architecture hygiene.
- Direct, concise communication. Dislikes unnecessary verbosity and generic AI tone.

## How I Work

These are non-negotiable. They override everything else.

- **Eliminate before adding.** Remove what's unnecessary before introducing anything new. Less code, fewer deps, simpler architecture — always.
- **Single source of truth.** One place for config, one place for state, one place for logic. No duplication. No drift.
- **Question everything.** Don't accept defaults. Challenge existing patterns. Propose better ones with reasoning.
- **Document first, apply after.** For non-trivial changes — plan it, show it, get alignment, then do it.
- **Project-scoped by default.** Install and configure per-project unless it's truly universal. Keep contexts clean.
- **Don't assume intent.** If I ask a question, answer it. If I ask for a plan, don't write code. Read what I'm actually asking. If I ask a narrow question, answer narrowly — don't escalate scope or rewrite unrelated parts.
- **Be direct.** Short responses. No fluff. No filler. No "Great question!" — just answer.
- **No AI boilerplate.** Never introduce generic AI patterns — over-abstracted hooks, unnecessary folder reshuffles, "enterprise" scaffolding — unless explicitly requested.
- **Track progress.** For large or multi-step tasks, create TODOs, use checklists, and keep them updated as you go. Don't lose track of what's done vs what's pending.

## Tools & Runtime

- **Always use Bun** — `bun`, `bunx`, `bun run`, `bun add`, `bun test`. Never npm/npx unless forced. If npm/npx is required, explain why Bun cannot be used.
- TypeScript strict mode by default.
- Respect the existing stack — don't swap frameworks, ORMs, or paradigms without asking. (Drizzle ≠ Prisma, Expo ≠ bare RN, etc.)
- Add libraries only if stable, maintained, and genuinely necessary. Check bundle size + render cost first.
- Prefer built-in solutions over external deps when reasonable.
- Regularly audit dependencies for security vulnerabilities and outdated versions.
- Leverage available skills and plugins for quality — use code-review, security-guidance, and relevant framework skills to validate work, not just your own judgment.

## Architecture

- Split responsibilities — no god components, no god files.
- Separate concerns: data fetching, state management, and UI rendering are different jobs.
- Create reusable utility components for genuinely repeated patterns — but don't abstract prematurely. Three similar lines > a premature helper.
- Reuse existing patterns if they work. If they don't, propose improvements with reasoning — don't silently rewrite.
- Maintain consistent naming conventions across the codebase.
- If rewriting, ensure functional parity. Improve design, don't break behavior.
- Lazy load components and routes when appropriate — especially critical on mobile for startup performance.

## State & Data

- `useState` sparingly — only for truly local UI state.
- Never manage multi-step flows with local state alone.
- Complex state or prop drilling → Zustand or Jotai.
- Server state → TanStack Query. Never fetch in useEffect.
- Keep state as close to usage as possible.
- Prefer derived state over duplicated state.

## Testing

- Write tests for critical business logic — not everything, but the parts that matter.
- Use TDD when explicitly requested, otherwise where applicable.
- Test edge cases and error scenarios, not just the happy path.
- Keep test code clean and readable — tests are documentation too.

## Performance & Optimization

- Profile before optimizing — don't guess performance problems.
- Use React.memo, useMemo, useCallback judiciously — not by default. If React Compiler is enabled in the project, skip manual memoization entirely — the compiler handles it. Check `babel.config.js` or `app.config.ts` for `react-compiler` plugin before adding any manual memoization.
- Lazy load routes and heavy components. Optimize images and assets before use.
- Monitor bundle size impact when adding features or dependencies.
- On mobile: startup time, FPS, memory usage are first-class concerns. Use react-native-best-practices and platform profiling tools.

## Code Quality

- Self-documenting code — clear names over clever tricks.
- NO unnecessary comments. NO commented-out code. NO "// increment counter".
- Comments ONLY for: complex algorithms, non-obvious business logic, important warnings.
- NO console.logs in committed code — debug only, remove before done.
- Validate inputs at system boundaries (user input, external APIs). Trust internal code.
- Provide meaningful error states in UI — loading, empty, error should all be handled visually, not just in code.
- Review your own code before requesting review. Re-read diffs, check for leftovers.
- Document API contracts and data structures. Keep README current when setup changes.

## Error Handling

- Handle errors gracefully — user-facing messages should be simple and helpful.
- Log errors with sufficient context for debugging (what failed, where, with what input) — simple for users, detailed for devs.
- Error boundaries for React components. Every screen should have one.
- Provide meaningful error/empty/loading states in UI.

## Collaboration

- **Explore → Plan → Code → Review.** That's the workflow.
- Don't jump into code if I asked a question — clarify first.
- Consult before big rewrites or features. Confirm reasoning before action.
- Propose alternatives with reasoning, not just a solution.
- Keep responses short unless I ask for detail.
- Communicate blockers and concerns proactively — don't silently work around issues.
- For UI work, iterate from mocks/screenshots if provided, otherwise from existing code.
- Don't commit unless explicitly asked. When a logical chunk of work is done, suggest a commit with a clear, descriptive message — but wait for confirmation.

## Security

Security is not optional and not a phase — it applies at every stage, every platform (mobile, web, backend).

- Never log or expose passwords, tokens, API keys, or PII.
- Validate env vars with schema (zod).
- Secrets in env vars only, never in code.
- Sanitize user inputs. Least privilege for permissions.
- HTTPS/WSS only. Proper authentication and authorization checks on every endpoint.
- Audit dependencies for known vulnerabilities. Don't ship with outdated, insecure packages.
- Use security-guidance skill/plugin to review code for vulnerabilities — don't rely only on manual checks.

## CI & Build Integrity

- Never introduce build steps or config changes without considering CI impact.
- If modifying dependencies, mention lockfile implications and verify EAS/CI compatibility.
- Prefer deterministic builds — pin versions, avoid floating ranges for critical deps.
- Never break reproducibility. If a build worked before your change, it should work after.

## API Contracts

- Never change API request/response shape silently — define schema explicitly when suggesting changes.
- Keep mobile and backend contracts aligned. If one changes, flag the other.
- For auth-related code, always consider token refresh, race conditions, and secure storage.
```

---

## Project: EaaS.Mobile.Trugo

No project-level plugins or skills installed.

### Project Permissions — `.claude/settings.local.json`

> **Base template.** Replace `PROJECT_ROOT` with the actual project directory path when applying to `.claude/settings.local.json`.

```json
{
  "permissions": {
    "allow": [
      "// --- File search & inspection (read-only) ---",
      "Bash(find:*)",
      "Bash(grep:*)",
      "Bash(rg:*)",
      "Bash(ls:*)",
      "Bash(wc:*)",
      "Bash(test:*)",
      "Bash(basename:*)",
      "Bash(fc-query:*)",
      "Bash(otfinfo:*)",
      "Bash(cat PROJECT_ROOT/:*)",
      "Read(//PROJECT_ROOT/**)",

      "// --- Git (read-only) ---",
      "Bash(git status)",
      "Bash(git diff:*)",
      "Bash(git log:*)",
      "Bash(git show:*)",
      "Bash(git branch)",
      "Bash(git branch -a)",
      "Bash(git branch -r)",
      "Bash(git stash list)",
      "Bash(git remote:*)",
      "Bash(git-crypt status:*)",

      "// --- Bun / package management ---",
      "Bash(bun run:*)",
      "Bash(bun test:*)",
      "Bash(bun add:*)",
      "Bash(bun install:*)",
      "Bash(bun remove:*)",
      "Bash(bun patch:*)",
      "Bash(bun pm:*)",
      "Bash(bun why:*)",
      "Bash(bun ts:check:*)",
      "Bash(bun tsc:*)",
      "Bash(bun prepare:config:*)",
      "Bash(bun expo export:embed:*)",
      "Bash(npx tsc:*)",
      "Bash(npx patch-package:*)",
      "Bash(npx eas update:list:*)",
      "Bash(npm view:*)",
      "Bash(npm why:*)",
      "Bash(npm search:*)",

      "// --- Expo / EAS (scoped) ---",
      "Bash(bunx expo:*)",
      "Bash(bunx eas-cli:*)",
      "Bash(bunx eas-cli@latest workflow:run:*)",
      "Bash(EXPO_DEBUG=1 bunx expo prebuild:*)",

      "// --- Build tools ---",
      "Bash(./gradlew:*)",
      "Bash(pod install)",
      "Bash(mkdir PROJECT_ROOT/:*)",

      "// --- Environment ---",
      "Bash(unset NODE_ENV)",
      "Bash(true)",
      "Bash(/dev/null)",

      "// --- MCP & Skills ---",
      "mcp__ide__getDiagnostics",
      "mcp__plugin_context7_context7__resolve-library-id",
      "mcp__plugin_context7_context7__query-docs",
      "mcp__expo-mcp__search_documentation",
      "Skill(expo-app-design:building-ui)",
      "Skill(vercel-react-best-practices)",

      "// --- Web (read-only, domain-scoped) ---",
      "WebSearch",
      "WebFetch(domain:docs.expo.dev)",
      "WebFetch(domain:expo.dev)",
      "WebFetch(domain:developer.android.com)",
      "WebFetch(domain:raw.githubusercontent.com)",
      "WebFetch(domain:github.com)",
      "WebFetch(domain:gist.github.com)",
      "WebFetch(domain:docs.swmansion.com)",
      "WebFetch(domain:nitro.margelo.com)",
      "WebFetch(domain:www.unistyl.es)",
      "WebFetch(domain:gorhom.dev)",
      "WebFetch(domain:www.reddit.com)",
      "WebFetch(domain:apktool.org)"

      "// --- Project-specific (add per project) ---",
      "// WebFetch(domain:your-api.example.com)",
      "// WebFetch(domain:your-s3-bucket.s3.region.amazonaws.com)"
    ],
    "deny": [],
    "defaultMode": "acceptEdits"
  }
}
```

> **Customize per project:** Add project-specific domains, build tools, or CLI commands as needed. See Step 7 in the Setup Guide for principles on what to allow vs what to approve manually.

---

## Cursor

| File | What it stores |
|------|---------------|
| `~/.cursor/mcp.json` | MCP server configuration |

**MCP Servers:** context7 — fetches library docs via `@upstash/context7-mcp@latest` (bunx)

No `.cursorrules` or custom AI rules found.

---
