---
description: "Multi-tier research pipeline — escalates through Spark → Sigma → Orion → Veritas for comprehensive analysis"
---

# /research

Run multi-tier research and competitive analysis using specialized data & research agents.

> **IMPORTANT**: Follow EVERY step below, printing agent banners and running harness commands.

## Step 0 — Harness & Memory Setup

```bash
node .oh-my-orq/memory/cortex.js start-session "Multi-Tier Research Pipeline"
node .oh-my-orq/memory/cortex.js recall "<research topic keywords>"
```

---

## Tier 1 — 🤖 Spark (@spark): Fast Data Tracking & Exploration

Print: `🤖 [TIER 1/3] FAST DATA EXPLORATION — Spark`
Print: `🤖 [AGENT: Spark] Gathering baseline data, metrics, and initial facts...`

- Read skill: `.agents/skills/spark/SKILL.md`
- Collect initial statistics, raw facts, and data points

```bash
node .oh-my-orq/memory/cortex.js track-tokens --agent spark --input 2000 --output 1500 --cost 0.02 --task research
```

---

## Tier 2 — 🤖 Sigma (@sigma) & Intel (@intel): Deep Analysis & Benchmarking

Print: `🤖 [TIER 2/3] STATISTICAL & COMPETITIVE ANALYSIS — Sigma, Intel`
Print: `🤖 [AGENT: Sigma] Conducting statistical analysis & hypothesis testing...`
Print: `🤖 [AGENT: Intel] Analyzing market standards & competitor multi-repo patterns...`

- Read skills: `.agents/skills/sigma/SKILL.md` and `.agents/skills/intel/SKILL.md`
- Compare alternatives, evaluate trade-offs, and synthesize quantitative insights

```bash
node .oh-my-orq/memory/cortex.js track-tokens --agent sigma --input 4000 --output 3000 --cost 0.06 --task research
node .oh-my-orq/memory/cortex.js track-tokens --agent intel --input 3000 --output 2000 --cost 0.04 --task research
```

---

## Tier 3 — 🤖 Orion (@orion) & Veritas (@veritas): Advanced Synthesis & Report

Print: `🤖 [TIER 3/3] ADVANCED RESEARCH & FINAL REPORT — Orion, Veritas`
Print: `🤖 [AGENT: Orion] Performing advanced causal inference & predictive modeling...`
Print: `🤖 [AGENT: Veritas] Verifying documentation, technical references & citation sources...`

- Read skills: `.agents/skills/orion/SKILL.md` and `.agents/skills/veritas/SKILL.md`
- Produce a comprehensive research report with:
  - Executive Summary
  - Key Findings & Visual Data Tables
  - Strategic Recommendations
  - References & Citations

```bash
node .oh-my-orq/memory/cortex.js track-tokens --agent orion --input 6000 --output 5000 --cost 0.12 --task research
node .oh-my-orq/memory/cortex.js track-tokens --agent veritas --input 2500 --output 1800 --cost 0.035 --task research
node .oh-my-orq/memory/cortex.js save "Research report completed: <topic>" --type pattern
node .oh-my-orq/memory/cortex.js end-session
node .oh-my-orq/memory/cortex.js tokens
node cli/orq.js dashboard
```
