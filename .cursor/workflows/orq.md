---
description: "Master oh-my-orq autonomous execution — orchestrates planning, implementation, review, and testing across subagents"
---

# /orq

Execute complete multi-agent orchestration for the user's prompt using **Apex-1** and specialized subagents.

## Workflow Execution Pipeline

1. **Plan Stage (`/orq-plan`)**:
   - Delegate to **Vector** to create a 3–7 stage execution breakdown.
   - Delegate to **Aura** to evaluate architectural risks and validate constraints.
   - Delegate to **Atlas** / **Nexus** to design high-level system architecture and API schemas.

2. **Implement Stage (`/orq-implement`)**:
   - Delegate to **Forge** for backend logic, endpoints, and database models.
   - Delegate to **Nova** for frontend UI components, responsive layout, and styling.
   - Delegate to **Link** for any required MCP tool interactions (GitHub, Postgres, Web Search).
   - Delegate to **Sync** for git commits and branch management.

3. **Review & Audit Stage (`/orq-review`)**:
   - Delegate to **Prism** to refactor code for cleanliness, DRY principles, and quality.
   - Delegate to **Pulse** to profile speed, Core Web Vitals, and performance bottlenecks.
   - Delegate to **Aegis** to write automated unit and integration tests (target ≥ 80% coverage).
   - Delegate to **Cyber** to audit OWASP Top 10 security vulnerabilities and input sanitization.

4. **Token Analytics & Memory Logging**:
   - Log token metrics for each active subagent into Project Cortex DB:
     `node ~/.oh-my-orq/app/memory/cortex.js track-tokens --agent apex-1 --model claude-opus-4.8 --input 4200 --output 2800 --cost 0.08`
   - Save task key decisions and learnings into Project Cortex DB:
     `node ~/.oh-my-orq/app/memory/cortex.js save "Completed task: <task_summary>" --type decision`

5. **Delivery**:
   - Synthesize all outputs into a final deliverable and present code artifacts to the user.
