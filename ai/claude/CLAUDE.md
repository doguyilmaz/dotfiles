## Customize Your Setup

- Document essentials: commands, utilities, style, testing, repo etiquette, environment, caveats.
- Keep concise and human-readable.
- Refine and emphasize important rules regularly.

## General Principles

- Always use Bun and Bun tools like bunx, cli for development as priority.
- Prioritize simplicity.
- Focus on clean, readable code and maintain consistency in naming, formatting, and file structure.
- Avoid spaghetti code or inconsistent structures.
- Keep implementations straightforward and avoid unnecessary or extreme approaches.
- Don't add unnecessary layers of abstraction; avoid over-engineering.
- Prefer readable solutions over clever but confusing ones.
- Approach problems logically and context-aware.

## Architecture & Code Style

- Avoid bloated components and files.
- Split responsibilities → never put everything into a single component.
- Create utility/reusable components for common functionality.
- Separate concerns: data, state, and UI.
- Reuse existing functionality if it fits, but don't stay locked to old patterns; propose improvements with reasoning.
- Ensure no loss of functionality when rewriting, but refine design and simplify where beneficial.
- Focus on clean code principles.
- Maintain consistent naming conventions across the codebase.

## State & Data Management

- Use `useState` sparingly and only when needed.
- Never manage multi-step flows entirely with local state.
- For complex state or prop drilling, use Zustand or Jotai.
- Use TanStack Query for server state, not local state.
- Do not fetch any data in useEffect, use useQuery instead.
- Keep state as close to where it's used as possible.
- Prefer derived state over duplicated state.

## Dependencies & Tools

- Respect the existing stack (e.g., Drizzle ≠ Prisma, Expo ≠ bare RN).
- Add libraries only if stable, maintained, and necessary.
- Check performance impact first (render cost, memory, bundle size).
- Use TypeScript strict mode by default.
- Regularly audit dependencies for security and updates.
- Prefer built-in solutions over external dependencies when reasonable.

## Testing & Quality

- Write tests for critical business logic.
- Use TDD when explicitly requested, otherwise where applicable.
- Ensure error boundaries are in place for React components.
- Test edge cases and error scenarios.
- Keep test code clean and readable.

## Performance

- Lazy load components and routes when appropriate.
- Optimize images and assets before use.
- Use React.memo, useMemo, and useCallback judiciously.
- Monitor bundle size impact when adding features.
- Profile before optimizing - don't guess performance issues.

## Collaboration & Interaction

- Don't jump into code if asked a question → clarify first.
- Provide detailed reasoning only if asked ("explain"), otherwise keep short/direct.
- Consult before big rewrites or features; confirm reasoning before action.
- Propose alternatives with reasoning before implementing.
- Differentiate between consultation and coding: discuss first, code after alignment.
- Ensure functional parity in rewrites but improve design if needed.
- Communicate blockers and concerns proactively.

## Workflows

- Explore → Plan → Code → Review.
- Use TDD when requested, otherwise where applicable (tests first, then code).
- For UI, iterate from mocks/screenshots if provided, otherwise from the code.
- For large tasks, use checklists or scratchpads, always keep the code clean and readable and track/update processes.
- Apply disciplined error handling in workflows (catch errors, user-facing messages simple, logs detailed).
- Explain concerns and decisions during collaboration.
- Commit frequently with clear, descriptive messages.
- Review your own code before requesting review.

## Error Handling & Debugging

- Always handle errors gracefully with user-friendly messages.
- Log errors with sufficient context for debugging.
- Use proper error boundaries in React applications.
- Validate inputs and handle edge cases.
- Provide meaningful error states in UI.
- Remove all console.logs and debug comments before finalizing code.
- Console logs are only acceptable during active debugging, must be removed when done.

## Security & Privacy

- Never log or expose sensitive information (passwords, tokens, API keys, PII).
- Validate environment variables with schema (e.g., using zod).
- Follow least privilege principle for permissions and access.
- Sanitize user inputs before processing or displaying.
- Store secrets in environment variables, never in code.
- Use secure communication protocols (HTTPS, WSS).
- Implement proper authentication and authorization checks.
- Regularly update dependencies to patch security vulnerabilities.

## Documentation & Comments

- Write self-documenting code (clear variable/function names).
- Add comments only for complex logic or non-obvious decisions.
- NO unnecessary comments - code should be readable without them.
- NO obvious comments like "// increment counter" for `counter++`.
- NO commented-out code blocks - use version control instead.
- Comments allowed ONLY for: complex algorithms, non-obvious business logic, important warnings.
- Remove ALL console.logs and debug comments before marking code as complete.
- Keep README files updated with setup and development instructions.
- Document API contracts and data structures.
- Maintain a changelog for significant updates.
