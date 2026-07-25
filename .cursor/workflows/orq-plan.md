---
description: "Orchestrate planning and architecture — Apex-1 delegates to Vector, Aura, Atlas, and Nexus"
---

# /orq-plan

Run strategic planning and system architecture design for the user's prompt.

> **IMPORTANT**: Follow EVERY step including `run_command` steps for memory and analytics.

## Step 0 — Initialize

```bash
node memory/cortex.js start-session "Plan: <brief prompt summary>"
node memory/cortex.js recall "<prompt keywords>"
```

Read recalled memories. Apply any past decisions to the planning below.

---

## Step 1 — 🤖 Vector: Strategic Planning

Print: `🤖 [AGENT: Vector] Creating 3–7 stage execution roadmap...`

- Read skill instructions from `.agents/skills/vector/SKILL.md`
- Create a detailed execution breakdown with:
  - Stage dependencies (sequential vs parallel)
  - Resource and complexity estimates per stage
  - Risk factors and mitigation strategies

```bash
node memory/cortex.js track-tokens --agent vector --input 3000 --output 2000 --cost 0.05 --task planning
```

---

## Step 2 — 🤖 Aura: Plan Review & Risk Assessment

Print: `🤖 [AGENT: Aura] Reviewing plan and identifying risks...`

- Read skill instructions from `.agents/skills/aura/SKILL.md`
- Evaluate the plan for:
  - Dependency conflicts or circular dependencies
  - Edge cases and failure modes
  - Bottlenecks and optimization opportunities
  - Missing requirements

```bash
node memory/cortex.js track-tokens --agent aura --input 2000 --output 1500 --cost 0.03 --task review
```

---

## Step 3 — 🤖 Atlas & Nexus: System Architecture

Print: `🤖 [AGENT: Atlas] Designing system architecture...`
Print: `🤖 [AGENT: Nexus] Designing database schemas and API contracts...`

- Read skill instructions from `.agents/skills/atlas/SKILL.md` and `.agents/skills/nexus/SKILL.md`
- Produce:
  - High-level component/service architecture (Mermaid diagram)
  - Database schema design (SQL or document model)
  - API specification (REST/GraphQL endpoints)
  - Technology stack selection with rationale

```bash
node memory/cortex.js track-tokens --agent atlas --input 2500 --output 2000 --cost 0.04 --task architecture
node memory/cortex.js track-tokens --agent nexus --input 2000 --output 1800 --cost 0.035 --task architecture
```

---

## Step 4 — Save & Finalize

```bash
node memory/cortex.js save "Plan complete: <one-line summary of architecture decisions>" --type decision
node memory/cortex.js end-session
node memory/cortex.js tokens
```

Present the validated technical plan to the user for review and approval.
