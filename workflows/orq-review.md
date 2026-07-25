---
description: "Orchestrate quality review, testing, & security audit — Apex-1 delegates to Prism, Pulse, Aegis, and Cyber"
---

# /orq-review

Run comprehensive quality review, testing, and security audit on the codebase.

> **IMPORTANT**: Follow EVERY step including `run_command` steps for memory and analytics.

## Step 0 — Initialize

```bash
node .oh-my-orq/memory/cortex.js start-session "Review: <brief prompt summary>"
node .oh-my-orq/memory/cortex.js recall "<prompt keywords>"
```

Read recalled memories. Apply any past bug patterns or quality lessons.

---

## Step 1 — 🤖 Prism: Code Quality Refactoring

Print: `🤖 [AGENT: Prism] Refactoring code for clarity and quality...`

- Read skill instructions from `.agents/skills/prism/SKILL.md`
- Apply:
  - DRY principle — eliminate code duplication
  - SOLID principles — single responsibility, dependency inversion
  - Clean naming — descriptive variables and functions
  - Design pattern opportunities — factory, strategy, observer where appropriate

```bash
node .oh-my-orq/memory/cortex.js track-tokens --agent prism --input 3000 --output 2500 --cost 0.05 --task refactoring
```

---

## Step 2 — 🤖 Pulse: Performance Optimization

Print: `🤖 [AGENT: Pulse] Profiling for performance bottlenecks...`

- Read skill instructions from `.agents/skills/pulse/SKILL.md`
- Check for:
  - N+1 database queries
  - Missing indexes on frequently queried columns
  - Memory leaks (unclosed connections, listeners)
  - Slow operations that could be parallelized
  - Frontend: unnecessary re-renders, large bundle sizes, CWV issues

```bash
node .oh-my-orq/memory/cortex.js track-tokens --agent pulse --input 2500 --output 2000 --cost 0.04 --task performance
```

---

## Step 3 — 🤖 Aegis: Automated Testing

Print: `🤖 [AGENT: Aegis] Writing unit and integration tests...`

- Read skill instructions from `.agents/skills/aegis/SKILL.md`
- Write tests following AAA pattern (Arrange, Act, Assert):
  - Unit tests for business logic and utilities
  - Integration tests for API endpoints and database operations
  - Target ≥ 80% code coverage
  - Include edge cases and error scenarios

```bash
node .oh-my-orq/memory/cortex.js track-tokens --agent aegis --input 4000 --output 3000 --cost 0.07 --task testing
```

---

## Step 4 — 🤖 Cyber: Security Audit

Print: `🤖 [AGENT: Cyber] Running OWASP Top 10 security audit...`

- Read skill instructions from `.agents/skills/cyber/SKILL.md`
- Audit for:
  - SQL injection, XSS, CSRF vulnerabilities
  - Authentication and authorization gaps
  - Insecure direct object references
  - Sensitive data exposure
  - Input validation and sanitization
  - Dependency vulnerabilities

```bash
node .oh-my-orq/memory/cortex.js track-tokens --agent cyber --input 3000 --output 2000 --cost 0.05 --task security
```

---

## Step 5 — Finalize

```bash
node .oh-my-orq/memory/cortex.js save "Review: <key findings and fixes applied>" --type lesson
node .oh-my-orq/memory/cortex.js end-session
node .oh-my-orq/memory/cortex.js tokens
```

Present the review results to the user with:
- Quality improvements made
- Test coverage achieved
- Security issues found and fixed
- Performance optimizations applied
