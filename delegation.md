# OMA Delegation Protocol

## 🎯 Purpose

Defines how OMA skills delegate tasks to each other for collaborative problem-solving.

## 🏗️ Architecture

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

## 📋 Delegation Syntax

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

## 🎭 Specialist Registry

### Orchestrators

| Skill | Role | Can Delegate To |
|-------|------|-----------------|
| **apex-1** | Master Orchestrator | All specialists |
| **vector** | Strategic Planner | aura, all specialists |
| **aura** | Plan Validator | None (reviewonly) |

### Specialists by Domain

#### **Architecture & Design**
- **atlas** - System architecture, design patterns
  - Accepts: `design`, `architecture`, `review`, `strategy`
  - Model: Claude Opus 4
  
- **nexus** - Database/API schema
  - Accepts: `schema`, `api-design`, `database`
  - Model: Claude Sonnet 3.5

- **lexicon** - Technical decisions
  - Accepts: `decision`, `comparison`, `evaluation`
  - Model: Claude Sonnet 3.5

#### **Vision & Design**
- **stitch** - UI/UX Design & Prototyping
  - Accepts: `design`, `ui-creation`, `screen-generation`, `prototype`
  - Model: Gemini 3.0 Pro + Stitch Extension

#### **Development**
- **forge** - Backend implementation
  - Accepts: `implement`, `code`, `backend`
  - Model: Claude Sonnet 3.5

- **nova** - UI/UX development
  - Accepts: `ui`, `component`, `frontend`, `design`
  - Model: Claude Sonnet 3.5

- **prism** - Code improvement
  - Accepts: `refactor`, `cleanup`, `improve`
  - Model: Claude Sonnet 3.5

#### **Testing & Quality**
- **aegis** - Automated testing
  - Accepts: `test`, `unit`, `integration`
  - Model: Claude Sonnet 3.5

- **echo** - Manual testing
  - Accepts: `manual-test`, `test-plan`
  - Model: Claude Haiku

- **cyber** - Security audit
  - Accepts: `security`, `audit`, `vulnerability`
  - Model: Claude Opus 4

#### **Research & Documentation**
- **veritas** - Research & examples
  - Accepts: `research`, `example`, `documentation`
  - Model: Claude Haiku

- **tracker** - Code navigation
  - Accepts: `find`, `search`, `locate`
  - Model: Claude Haiku

- **quill** - Technical writing
  - Accepts: `document`, `readme`, `guide`
  - Model: Claude Sonnet 3.5

- **intel** - Multi-repo analysis
  - Accepts: `analyze`, `compare`, `research`
  - Model: Claude Sonnet 3.5

#### **Data & Analysis**
- **spark** - Quick data exploration
  - Accepts: `data-explore`, `stats`
  - Model: Claude Haiku

- **sigma** - Standard analysis
  - Accepts: `analyze-data`, `statistics`
  - Model: Claude Sonnet 3.5

- **orion** - Advanced research
  - Accepts: `ml`, `research`, `complex-analysis`
  - Model: Claude Opus 4

- **flow** - ETL pipelines
  - Accepts: `etl`, `pipeline`, `transform`
  - Model: Claude Sonnet 3.5

- **query** - Database queries
  - Accepts: `query`, `optimize-sql`
  - Model: Claude Sonnet 3.5

#### **Specialized Tools**
- **viper** - Bug fixing
  - Accepts: `debug`, `fix`, `troubleshoot`
  - Model: Claude Sonnet 3.5

- **sync** - Version control
  - Accepts: `commit`, `branch`, `git`
  - Model: Claude Haiku

- **matrix** - Deployment
  - Accepts: `deploy`, `cicd`, `infrastructure`
  - Model: Claude Opus 4

- **pulse** - Optimization
  - Accepts: `optimize`, `performance`, `profile`
  - Model: Claude Opus 4

- **automata** - E2E testing
  - Accepts: `e2e`, `browser-test`, `automation`
  - Model: Claude Sonnet 3.5

- **vision** - Visual analysis
  - Accepts: `analyze-image`, `screenshot`, `diagram`
  - Model: Claude Opus 4 (Vision)

## 🔄 Delegation Workflow

### 1. Task Analysis (Orchestrator)

```markdown
User Request: "Build user authentication system"

Sisyphus analyzes:
- Complexity: High (requires multiple specialists)
- Domains: Architecture, Security, Implementation, Testing, Docs
- Specialists needed: 6
```

### 2. Specialist Selection

```markdown
Based on task domains:
✓ atlas (architecture design)
✓ cyber (security requirements)
✓ nexus (database schema)
✓ forge (implementation)
✓ aegis (test suite)
✓ quill (documentation)
```

### 3. Sequential Delegation

```markdown
Round 1 (Design):
[DELEGATE TO: atlas]
TASK: Design authentication system architecture
→ Returns: Architecture diagram

Round 2 (Security):
[DELEGATE TO: cyber]
TASK: Define security requirements
CONTEXT: Architecture from Round 1
→ Returns: Security checklist

Round 3 (Schema):
[DELEGATE TO: nexus]
TASK: Design user database schema
CONTEXT: Architecture + Security requirements
→ Returns: SQL schema

Round 4 (Implementation):
[DELEGATE TO: forge]
TASK: Implement auth endpoints
CONTEXT: All previous outputs
→ Returns: Working code

Round 5 (Testing):
[DELEGATE TO: aegis]
TASK: Write comprehensive tests
CONTEXT: Implementation
→ Returns: Test suite

Round 6 (Documentation):
[DELEGATE TO: quill]
TASK: Document API
CONTEXT: Implementation + Tests
→ Returns: API docs
```

### 4. Result Integration

```markdown
Sisyphus combines all results:
- Architecture (from atlas)
- Security checklist (from cyber)
- Database schema (from nexus)
- Implementation (from forge)
- Tests (from aegis)
- Documentation (from quill)

→ Delivers complete authentication system
```

## 📊 Parallel Delegation

For independent tasks:

```markdown
User: "Optimize application performance"

Sisyphus delegates in parallel:

[PARALLEL START]
  ├─→ pulse: Profile CPU/memory
  ├─→ query: Optimize database queries
  └─→ nova: Optimize frontend assets
[PARALLEL END]

Wait for all results → Integrate → Report
```

## 🎯 Context Isolation

Each specialist receives ONLY:

✅ **Included:**
- Task description
- Relevant context
- Required inputs
- Output format

❌ **Excluded:**
- Full conversation history
- Other specialists' tasks
- Unrelated user messages
- General chat

This ensures **focused execution** without distraction.

## 📝 Result Format

```markdown
[RESULT FROM: atlas]
STATUS: Complete
DELIVERABLE:
# Authentication System Architecture

## Technology Stack
- JWT for stateless auth
- bcrypt for password hashing (cost: 12)
- Redis for token blacklist

## Components
1. Auth Service (Node.js + Express)
2. User Database (PostgreSQL)
3. Token Cache (Redis)

## Flow
[Diagram]

RATIONALE:
- JWT chosen for scalability
- bcrypt for security
- Redis for fast token invalidation

NEXT STEPS:
- Implement schema (→ nexus)
- Define security policies (→ cyber)
[END RESULT]
```

## 🔧 Implementation in SKILL.md

Each orchestrator's SKILL.md should include:

```markdown
## Available Specialists

(List from registry above)

## How to Delegate

Use [DELEGATE TO: skill-name] syntax.

## Delegation Examples

(Show common patterns)
```

---

**This protocol enables OMA skills to work together seamlessly!** 🎯