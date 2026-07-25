---
description: "Master oh-my-orq autonomous execution — orchestrates planning, implementation, review, and testing across subagents"
---

# /orq

Execute complete multi-agent orchestration for the user's prompt using **Apex-1** and specialized subagents.

> **IMPORTANT**: This workflow integrates shared memory, token tracking, token optimization, and agent harness. Follow EVERY step exactly — do NOT skip any harness commands.

## ⚙️ Mandatory Autonomous Framework Harness

During execution of this workflow, the following 3 core framework sub-systems **MUST automatically operate**:

1. 🗜️ **Token Optimization Engine (`token-optimization/`)**:
   - **Delta Mode (`delta-mode.js`)**: File re-reads automatically generate unified diffs (saving 85–95% tokens).
   - **Code Skeletons (`skeletons.js`)**: Large code files return AST-style structural summaries.
   - **Output Compression (`output-compressor.js`)**: Command & test logs are automatically condensed.
   - **Progressive Disclosure (`archive-store.js`)**: Outputs > 4KB are archived to disk with retrieval pointers.

2. 🧠 **Project Cortex Shared Memory (`memory/cortex.js`)**:
   - **Session Lifecycle**: `start-session` initializes tracking, `recall` retrieves past decisions, `save` records new learnings, and `end-session` closes tracking.

3. 🪝 **Hooks Engine (`hooks/`)**:
   - **PreToolUse**: Intercepts tool calls to inject recalled memories and apply prompt compression.
   - **PostToolUse**: Auto-captures token metrics per agent and updates the live web dashboard.

---

## Step 0 — Initialize Session & Recall Memory

Before doing ANY work, run these commands to activate the framework harness:

```bash
# Start a tracking session
node .oh-my-orq/memory/cortex.js start-session "Orq: <brief user prompt summary>"

# Recall relevant project memories
node .oh-my-orq/memory/cortex.js recall "<user prompt keywords>"
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
node .oh-my-orq/memory/cortex.js track-tokens --agent vector --input 3000 --output 2000 --saved 1500 --cost 0.05 --task planning
node .oh-my-orq/memory/cortex.js track-tokens --agent aura --input 2000 --output 1500 --saved 1000 --cost 0.03 --task planning
node .oh-my-orq/memory/cortex.js track-tokens --agent atlas --input 2500 --output 2000 --saved 1200 --cost 0.04 --task architecture
node .oh-my-orq/memory/cortex.js save "Plan: <brief plan summary>" --type decision
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
node .oh-my-orq/memory/cortex.js track-tokens --agent forge --input 5000 --output 4000 --saved 3000 --cost 0.10 --task backend
node .oh-my-orq/memory/cortex.js track-tokens --agent nova --input 4000 --output 3500 --saved 2500 --cost 0.08 --task frontend
node .oh-my-orq/memory/cortex.js save "Architecture: <key implementation decisions>" --type architecture
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
node .oh-my-orq/memory/cortex.js track-tokens --agent prism --input 3000 --output 2500 --saved 1800 --cost 0.05 --task refactoring
node .oh-my-orq/memory/cortex.js track-tokens --agent aegis --input 4000 --output 3000 --saved 2200 --cost 0.07 --task testing
node .oh-my-orq/memory/cortex.js save "Quality: <quality review findings>" --type lesson
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
Run these commands to finalize tracking and open your dashboard:
```bash
# End the session (auto-calculates totals)
node .oh-my-orq/memory/cortex.js end-session

# Show token usage summary
node memory/cortex.js tokens

# Export dashboard data & open live dashboard in browser
node cli/orq.js dashboard
```

### 4b. Final Delivery
Present the complete solution to the user with:
- Summary of what was built
- Which agents contributed and what they did
- Token usage summary (from the `tokens` command output above)
- Any recommendations for next steps
