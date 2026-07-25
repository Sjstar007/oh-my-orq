---
description: "Master oh-my-orq autonomous execution — orchestrates planning, implementation, review, and testing across subagents"
---

# /orq

Execute complete multi-agent orchestration for the user's prompt using **Apex-1** and specialized subagents.

> **IMPORTANT**: This workflow integrates shared memory, token tracking, and agent harness. Follow EVERY step exactly — do NOT skip the `run_command` steps.

## Step 0 — Initialize Session & Recall Memory

Before doing ANY work, run these commands to activate the framework harness:

```bash
# Start a tracking session
node memory/cortex.js start-session "Orq: <brief user prompt summary>"

# Recall relevant project memories
node memory/cortex.js recall "<user prompt keywords>"
```

Read the recalled memories output carefully. Use any past decisions, patterns, or architectural context to inform your work below.

---

## Step 1 — 🤖 Plan Stage

Print this banner before starting:
```
═══════════════════════════════════════════════════
🤖 [STAGE 1/4] PLANNING — Vector, Aura, Atlas, Nexus
═══════════════════════════════════════════════════
```

### 1a. Strategic Plan via Vector
Print: `🤖 [AGENT: Vector] Creating execution roadmap...`
- Read the `vector` skill instructions from `.agents/skills/vector/SKILL.md`
- Create a 3–7 stage execution breakdown with dependencies and complexity estimates

### 1b. Risk Review via Aura
Print: `🤖 [AGENT: Aura] Validating plan and identifying risks...`
- Read the `aura` skill instructions from `.agents/skills/aura/SKILL.md`
- Evaluate risks, edge cases, and bottlenecks in the plan

### 1c. Architecture via Atlas & Nexus
Print: `🤖 [AGENT: Atlas] Designing system architecture...`
Print: `🤖 [AGENT: Nexus] Designing database schemas and APIs...`
- Read `atlas` and `nexus` skill instructions
- Design system architecture, data models, and API contracts

### 1d. Track Planning Tokens
After completing the plan stage, run:
```bash
node memory/cortex.js track-tokens --agent vector --input 3000 --output 2000 --cost 0.05 --task planning
node memory/cortex.js track-tokens --agent aura --input 2000 --output 1500 --cost 0.03 --task planning
node memory/cortex.js track-tokens --agent atlas --input 2500 --output 2000 --cost 0.04 --task architecture
node memory/cortex.js save "Plan: <brief plan summary>" --type decision
```

---

## Step 2 — 🤖 Implement Stage

Print this banner before starting:
```
═══════════════════════════════════════════════════
🤖 [STAGE 2/4] IMPLEMENTATION — Forge, Nova, Link, Sync
═══════════════════════════════════════════════════
```

### 2a. Backend via Forge
Print: `🤖 [AGENT: Forge] Implementing backend logic...`
- Read the `forge` skill instructions from `.agents/skills/forge/SKILL.md`
- Write production-ready backend code with SOLID principles and error handling

### 2b. Frontend via Nova
Print: `🤖 [AGENT: Nova] Building UI components...`
- Read the `nova` skill instructions from `.agents/skills/nova/SKILL.md`
- Build responsive, accessible UI with modern CSS and micro-animations

### 2c. MCP & External Tools via Link
Print: `🤖 [AGENT: Link] Connecting external services via MCP...`
- Only if needed: database queries, GitHub operations, web searches

### 2d. Version Control via Sync
Print: `🤖 [AGENT: Sync] Managing git operations...`
- Create clean, atomic commits with descriptive messages

### 2e. Track Implementation Tokens
```bash
node memory/cortex.js track-tokens --agent forge --input 5000 --output 4000 --cost 0.10 --task backend
node memory/cortex.js track-tokens --agent nova --input 4000 --output 3500 --cost 0.08 --task frontend
node memory/cortex.js save "Architecture: <key implementation decisions>" --type architecture
```

---

## Step 3 — 🤖 Review & Audit Stage

Print this banner before starting:
```
═══════════════════════════════════════════════════
🤖 [STAGE 3/4] REVIEW & AUDIT — Prism, Pulse, Aegis, Cyber
═══════════════════════════════════════════════════
```

### 3a. Code Quality via Prism
Print: `🤖 [AGENT: Prism] Refactoring for quality...`
- Read `prism` skill — apply DRY, SOLID, clean code principles

### 3b. Performance via Pulse
Print: `🤖 [AGENT: Pulse] Profiling performance...`
- Read `pulse` skill — check for N+1 queries, memory leaks, slow operations

### 3c. Testing via Aegis
Print: `🤖 [AGENT: Aegis] Writing automated tests...`
- Read `aegis` skill — write unit/integration tests targeting ≥80% coverage

### 3d. Security via Cyber
Print: `🤖 [AGENT: Cyber] Running security audit...`
- Read `cyber` skill — check OWASP Top 10, input validation, auth

### 3e. Track Review Tokens
```bash
node memory/cortex.js track-tokens --agent prism --input 3000 --output 2500 --cost 0.05 --task refactoring
node memory/cortex.js track-tokens --agent aegis --input 4000 --output 3000 --cost 0.07 --task testing
node memory/cortex.js save "Quality: <quality review findings>" --type lesson
```

---

## Step 4 — 🤖 Finalize & Export Analytics

Print this banner:
```
═══════════════════════════════════════════════════
🤖 [STAGE 4/4] DELIVERY — Finalizing & Exporting Analytics
═══════════════════════════════════════════════════
```

### 4a. End Session & Export Dashboard
Run these commands to finalize tracking:
```bash
# End the session (auto-calculates totals)
node memory/cortex.js end-session

# Show token usage summary
node memory/cortex.js tokens

# Export dashboard data
node memory/cortex.js export
```

### 4b. Final Delivery
Present the complete solution to the user with:
- Summary of what was built
- Which agents contributed and what they did
- Token usage summary (from the `tokens` command output above)
- Any recommendations for next steps
