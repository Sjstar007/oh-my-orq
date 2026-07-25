---
description: "Orchestrate code implementation — Apex-1 delegates to Forge, Nova, Link, and Sync"
---

# /orq-implement

Execute code implementation across backend, frontend, database, and version control.

> **IMPORTANT**: Follow EVERY step including `run_command` steps for memory and analytics.

## Step 0 — Initialize

```bash
node memory/cortex.js start-session "Implement: <brief prompt summary>"
node memory/cortex.js recall "<prompt keywords>"
```

Read recalled memories. Apply any past architectural decisions and patterns.

---

## Step 1 — 🤖 Forge: Backend Implementation

Print: `🤖 [AGENT: Forge] Implementing backend logic, APIs, and business rules...`

- Read skill instructions from `.agents/skills/forge/SKILL.md`
- Write production-ready code following:
  - SOLID principles and clean architecture
  - Proper error handling with custom error classes
  - Type safety and input validation
  - Database integration with proper connection pooling

```bash
node memory/cortex.js track-tokens --agent forge --input 5000 --output 4000 --cost 0.10 --task backend
node memory/cortex.js save "Backend: <key backend implementation decisions>" --type architecture
```

---

## Step 2 — 🤖 Nova: Frontend UI/UX

Print: `🤖 [AGENT: Nova] Building responsive UI components and styling...`

- Read skill instructions from `.agents/skills/nova/SKILL.md`
- Build modern interfaces with:
  - Responsive layouts using CSS Grid/Flexbox
  - Accessible HTML (semantic elements, ARIA labels)
  - Micro-animations and smooth transitions
  - Dark mode support where appropriate

```bash
node memory/cortex.js track-tokens --agent nova --input 4000 --output 3500 --cost 0.08 --task frontend
```

---

## Step 3 — 🤖 Link: MCP & External Tools (if needed)

Print: `🤖 [AGENT: Link] Connecting external services via MCP...`

- Read skill instructions from `.agents/skills/link/SKILL.md`
- Only execute if the task requires:
  - Database queries via Postgres MCP
  - GitHub operations via GitHub MCP
  - Web searches for documentation or examples

```bash
node memory/cortex.js track-tokens --agent link --input 1500 --output 1000 --cost 0.02 --task mcp
```

---

## Step 4 — 🤖 Sync: Version Control

Print: `🤖 [AGENT: Sync] Creating clean, atomic git commits...`

- Read skill instructions from `.agents/skills/sync/SKILL.md`
- Create meaningful commit messages following conventional commits
- Stage only relevant files

```bash
node memory/cortex.js track-tokens --agent sync --input 1000 --output 500 --cost 0.01 --task git
```

---

## Step 5 — Finalize

```bash
node memory/cortex.js save "Implementation complete: <one-line summary>" --type decision
node memory/cortex.js end-session
node memory/cortex.js tokens
```

Present the implementation to the user with a summary of what was built.
