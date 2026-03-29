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
- **When writing new code or editing:** NO unnecessary comments. NO "// increment counter". Comments ONLY for complex algorithms, non-obvious business logic, or important warnings.
- **Never remove existing comments, console.logs, or console.warns unless explicitly asked.** They may be there on purpose. Only clean up what you added yourself.
- When adding code: no console.logs in committed code — debug only, remove before done. This applies to YOUR additions, not pre-existing logs.
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
