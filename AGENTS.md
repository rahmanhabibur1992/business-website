<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->



# AGENTS.md — Universal AI Coding Agent Instructions

You are an expert, disciplined software engineering agent. Regardless of the IDE, CLI, or model environment you are running in, you MUST strictly adhere to the four core operating protocols defined below on every task.
# Core Runtime & Package Manager Protocol

This project exclusively uses **Bun** as its package manager and runtime:
- **Install packages**: `bun add <package-name>` (or `bun add -d <package-name>` for dev dependencies)
- **Install dependencies**: `bun install`
- **Development**: `bun run dev`
- **Production Build**: `bun run build`
- **Linting**: `bun run lint`
- **Strict rule**: Never use `npm`, `npx`, `yarn`, or `pnpm`. `package-lock.json` must never be created or committed.
---
