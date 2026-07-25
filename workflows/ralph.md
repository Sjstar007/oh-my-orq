---
description: "Review-and-loop-until-perfect — iterates on output until it meets production quality standards"
---

# /ralph

Run the Ralph Quality Review loop using specialized quality & testing agents.

> **IMPORTANT**: Follow EVERY step below, printing agent banners and running harness commands.

## Step 0 — Harness & Memory Setup

```bash
node memory/cortex.js start-session "Ralph Quality Review Loop"
node memory/cortex.js recall "quality review standards"
```

---

## Stage 1 — 🤖 Code Quality & Refactoring — Prism (@prism)

Print: `🤖 [STAGE 1/4] CODE QUALITY & CLEANUP — Prism`
Print: `🤖 [AGENT: Prism] Refactoring code for DRY, SOLID, and clean naming standards...`

- Read skill: `.agents/skills/prism/SKILL.md`

---

## Stage 2 — 🤖 Performance & Bug Hunting — Pulse (@pulse) & Viper (@viper)

Print: `🤖 [STAGE 2/4] PERFORMANCE & BUG HUNTING — Pulse, Viper`
Print: `🤖 [AGENT: Pulse] Checking memory leaks, N+1 queries, and latency bottlenecks...`
Print: `🤖 [AGENT: Viper] Hunting runtime exceptions, edge-case bugs, and type mismatches...`

- Read skills: `.agents/skills/pulse/SKILL.md` and `.agents/skills/viper/SKILL.md`

---

## Stage 3 — 🤖 Testing & Security Validation — Aegis (@aegis) & Cyber (@cyber)

Print: `🤖 [STAGE 3/4] TESTING & SECURITY AUDIT — Aegis, Cyber`
Print: `🤖 [AGENT: Aegis] Verifying test coverage & writing missing unit/integration tests...`
Print: `🤖 [AGENT: Cyber] Scanning OWASP Top 10 vulnerabilities & input sanitization...`

- Read skills: `.agents/skills/aegis/SKILL.md` and `.agents/skills/cyber/SKILL.md`

---

## Stage 4 — 🤖 Quality Scoring & Session Export

Score the overall quality (1–10). If score < 8, iterate and fix.

Print: `🤖 [STAGE 4/4] RALPH FINAL REPORT & DASHBOARD EXPORT`

```bash
node memory/cortex.js track-tokens --agent prism --input 3000 --output 2500 --cost 0.05 --task review
node memory/cortex.js track-tokens --agent pulse --input 2500 --output 2000 --cost 0.04 --task performance
node memory/cortex.js track-tokens --agent aegis --input 4000 --output 3000 --cost 0.07 --task testing
node memory/cortex.js track-tokens --agent cyber --input 3000 --output 2000 --cost 0.05 --task security
node memory/cortex.js track-tokens --agent viper --input 2000 --output 1500 --cost 0.03 --task debugging
node memory/cortex.js save "Ralph Quality Review completed score: <score>/10" --type lesson
node memory/cortex.js end-session
node memory/cortex.js tokens
node cli/orq.js dashboard
```
