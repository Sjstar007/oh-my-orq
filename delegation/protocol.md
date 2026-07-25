# Oh My Orq Delegation Protocol

## Overview

This protocol defines how orchestrator agents delegate tasks to specialist agents for collaborative problem-solving. It ensures clear communication, context isolation, and quality integration.

## Architecture

```
Orchestrator (Sisyphus)
  ↓ analyzes task
  ↓ identifies specialists
  ↓
  ├─→ Oracle (architecture)
  ├─→ CodeSmith (implementation)
  ├─→ Pixel (UI/UX)
  ├─→ Tester (testing)
  └─→ Scribe (documentation)
  ↓
  ↓ integrates results
  ↓
Final Solution
```

## Delegation Syntax

### Format
```
[DELEGATE TO: <skill-name>]
TASK: <clear, focused task description>
CONTEXT: <relevant background information>
REQUIREMENTS: <specific deliverables>
OUTPUT: <expected format>
[END DELEGATION]
```

### Example
```
[DELEGATE TO: atlas]
TASK: Design authentication system architecture
CONTEXT:
- E-commerce platform
- 100k users expected
- Need JWT-based auth
REQUIREMENTS:
- Secure password storage
- Token expiration strategy
- Refresh token handling
OUTPUT: Architecture diagram + technology choices with rationale
[END DELEGATION]
```

## Result Format

```
[RESULT FROM: <skill-name>]
STATUS: Complete|Partial|Failed
DELIVERABLE:
<actual deliverable content>
RATIONALE:
<explanation of decisions made>
NEXT STEPS:
<suggested follow-up tasks>
[END RESULT]
```

## Context Isolation Rules

Each specialist receives ONLY:
- ✅ Task description
- ✅ Relevant context
- ✅ Required inputs
- ✅ Output format specification

Each specialist does NOT receive:
- ❌ Full conversation history
- ❌ Other specialists' tasks
- ❌ Unrelated user messages
- ❌ General chat

## Delegation Patterns

### Sequential Delegation
```
Round 1: [DELEGATE TO: atlas] → Architecture
Round 2: [DELEGATE TO: nexus] → Schema (uses architecture)
Round 3: [DELEGATE TO: forge] → Implementation (uses architecture + schema)
Round 4: [DELEGATE TO: aegis] → Tests (uses implementation)
Round 5: [DELEGATE TO: quill] → Docs (uses all)
```

### Parallel Delegation
```
[PARALLEL START]
  ├─→ nova: Build frontend UI
  ├─→ forge: Build backend API
  └─→ nexus: Design database schema
[PARALLEL END]
Wait for all → Integrate → Deliver
```

### Escalation Pattern
```
IF specialist reports insufficient capability:
  ESCALATE to higher-tier model
  Example: forge (Sonnet) → forge-complex (Opus)
```
