---
description: "Full autonomous mode — Apex-1 orchestrates the entire project from planning to delivery across 10+ subagents"
---

# /ultrawork

Execute full autonomous orchestration using **Apex-1** and specialist agents.

> **IMPORTANT**: Follow EVERY step below, printing agent banners and running harness commands.

## Step 0 — Harness & Memory Setup

```bash
node .oh-my-orq/memory/cortex.js start-session "Ultrawork Autonomous Execution"
node .oh-my-orq/memory/cortex.js recall "<project prompt keywords>"
```

---

## Stage 1 — 🤖 Strategic Planning & Architecture

Print: `🤖 [STAGE 1/4] AUTONOMOUS PLANNING — Vector, Aura, Atlas, Nexus`

### 1a. Vector (@vector)
Print: `🤖 [AGENT: Vector] Creating multi-stage execution plan...`
- Read skill: `.agents/skills/vector/SKILL.md`
- Decompose task into sequential stages

### 1b. Aura (@aura)
Print: `🤖 [AGENT: Aura] Validating architectural risks & constraints...`
- Read skill: `.agents/skills/aura/SKILL.md`

### 1c. Atlas (@atlas) & Nexus (@nexus)
Print: `🤖 [AGENT: Atlas] Designing system architecture...`
Print: `🤖 [AGENT: Nexus] Designing database schemas and API contracts...`
- Read skills: `.agents/skills/atlas/SKILL.md` and `.agents/skills/nexus/SKILL.md`

```bash
node .oh-my-orq/memory/cortex.js track-tokens --agent vector --input 3000 --output 2000 --cost 0.05 --task planning
node .oh-my-orq/memory/cortex.js track-tokens --agent aura --input 2000 --output 1500 --cost 0.03 --task planning
node .oh-my-orq/memory/cortex.js track-tokens --agent atlas --input 3000 --output 2500 --cost 0.05 --task architecture
node .oh-my-orq/memory/cortex.js track-tokens --agent nexus --input 2500 --output 2000 --cost 0.04 --task architecture
```

---

## Stage 2 — 🤖 Autonomous Implementation

Print: `🤖 [STAGE 2/4] AUTONOMOUS BUILD — Forge, Nova, Query, Link`

### 2a. Forge (@forge) & Query (@query)
Print: `🤖 [AGENT: Forge] Implementing backend logic, endpoints, and error handlers...`
Print: `🤖 [AGENT: Query] Optimizing SQL queries and database indexes...`
- Read skills: `.agents/skills/forge/SKILL.md` and `.agents/skills/query/SKILL.md`

### 2b. Nova (@nova)
Print: `🤖 [AGENT: Nova] Building responsive frontend UI components and CSS...`
- Read skill: `.agents/skills/nova/SKILL.md`

### 2c. Link (@link)
Print: `🤖 [AGENT: Link] Executing MCP tool integrations...`
- Read skill: `.agents/skills/link/SKILL.md`

```bash
node .oh-my-orq/memory/cortex.js track-tokens --agent forge --input 6000 --output 5000 --cost 0.12 --task backend
node .oh-my-orq/memory/cortex.js track-tokens --agent query --input 2000 --output 1500 --cost 0.03 --task database
node .oh-my-orq/memory/cortex.js track-tokens --agent nova --input 5000 --output 4000 --cost 0.10 --task frontend
node .oh-my-orq/memory/cortex.js track-tokens --agent link --input 1500 --output 1000 --cost 0.02 --task mcp
```

---

## Stage 3 — 🤖 Quality & Security Audit

Print: `🤖 [STAGE 3/4] QUALITY & SECURITY — Prism, Aegis, Cyber, Viper`

### 3a. Prism (@prism) & Viper (@viper)
Print: `🤖 [AGENT: Prism] Refactoring code for DRY principles and clean architecture...`
Print: `🤖 [AGENT: Viper] Hunting and fixing runtime bugs...`

### 3b. Aegis (@aegis) & Cyber (@cyber)
Print: `🤖 [AGENT: Aegis] Writing automated unit and integration tests (target ≥ 80%)...`
Print: `🤖 [AGENT: Cyber] Running OWASP Top 10 security audit...`

```bash
node .oh-my-orq/memory/cortex.js track-tokens --agent prism --input 3000 --output 2500 --cost 0.05 --task refactoring
node .oh-my-orq/memory/cortex.js track-tokens --agent aegis --input 4000 --output 3000 --cost 0.07 --task testing
node .oh-my-orq/memory/cortex.js track-tokens --agent cyber --input 3000 --output 2000 --cost 0.05 --task security
```

---

## Stage 4 — 🤖 Documentation & Session Export

Print: `🤖 [STAGE 4/4] DELIVERY — Quill, Sync & Dashboard`

### 4a. Quill (@quill) & Sync (@sync)
Print: `🤖 [AGENT: Quill] Generating README and documentation...`
Print: `🤖 [AGENT: Sync] Creating git commits...`

```bash
node .oh-my-orq/memory/cortex.js track-tokens --agent quill --input 2000 --output 1500 --cost 0.03 --task docs
node .oh-my-orq/memory/cortex.js track-tokens --agent sync --input 1000 --output 500 --cost 0.01 --task git
node .oh-my-orq/memory/cortex.js save "Ultrawork completed full application build" --type architecture
node .oh-my-orq/memory/cortex.js end-session
node .oh-my-orq/memory/cortex.js tokens
node cli/orq.js dashboard
```
