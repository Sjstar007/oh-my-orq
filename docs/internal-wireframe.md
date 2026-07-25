# 📐 oh-my-orq Internal Wireframe & Interaction Architecture

This document provides a detailed technical wireframe and interaction map showing how **Agents**, **Hooks**, **Shared Storage (Cortex)**, **MCP Gateway**, **Token Optimization Engine**, and **Hermes Messaging Harness** interact internally.

---

## 🏛️ 1. Complete Internal Wireframe & Component Map

```mermaid
graph TB
    %% Level 1: User & Interface
    subgraph L1["1. ENTRY & TRIGGER LAYER"]
        UserPrompt["User Input / Prompt / @Mention"]
        SlashCmd["Slash Commands (/ultrawork, /research, /ralph, /learn)"]
        IDEInterface["Antigravity / VS Code / Cursor Extension / CLI"]
    end

    %% Level 2: Agent Harness & Delegation
    subgraph L2["2. AGENT HARNESS & ORCHESTRATION ENGINE"]
        HarnessCore["Agent Harness Controller (cli/orq.js)"]
        Apex1["Apex-1: Master Orchestrator"]
        Vector["Vector: 3-7 Stage Planner"]
        Aura["Aura: Plan Validator & Risk Check"]

        subgraph SpecialistPool["30 Specialized Subagents Pool"]
            Atlas["Atlas (Architecture)"]
            Forge["Forge (Backend Code)"]
            Nova["Nova (UI/UX Design)"]
            Aegis["Aegis (Automated Testing)"]
            Link["Link (MCP Gateway)"]
            Sync["Sync (Git & PR Master)"]
            HermesNode["Hermes (Messenger Node)"]
        end
    end

    %% Level 3: Execution Hooks Interceptor
    subgraph L3["3. HOOKS INTERCEPTION PIPELINE"]
        PreHook["PreToolUse Hook (hooks/PreToolUse.js)"]
        PostHook["PostToolUse Hook (hooks/PostToolUse.js)"]
        LearnHook["LearningHook Scanner (hooks/LearningHook.js)"]
    end

    %% Level 4: Token Optimization Subsystems
    subgraph L4["4. TOKEN OPTIMIZATION SUBSYSTEMS"]
        LoopDet["Loop Detector (>0.7 confidence)"]
        DeltaEngine["Delta Mode (Unified Git Diffs)"]
        SkelEngine["Code Skeletons (AST Signatures)"]
        Compressor["Output Compressor (pytest, npm, grep)"]
        ArchiveStore["Progressive Disclosure Store (>4KB)"]
        KeepWarm["Keep-Warm Cache Pinger (4min TTL)"]
        CoachEngine["Quality Coach (S-F Health Grade)"]
    end

    %% Level 5: Shared Storage (Cortex) & Memory
    subgraph L5["5. PERSISTENT SHARED STORAGE (PROJECT CORTEX)"]
        CortexMemory[("Project Cortex DB<br/>.oh-my-orq/memory/cortex.json")]
        PatternStore[("Codebase Patterns<br/>.oh-my-orq/patterns.json")]
        ArchiveFiles[("Archive Disk Storage<br/>.oh-my-orq/archives/*.txt")]
        Checkpoints[("Pre-Compaction Store<br/>.oh-my-orq/checkpoints/*.json")]
        TFIDFEngine["TF-IDF Relevance & Recency Decay Engine"]
    end

    %% Level 6: External Integrations & Telemetry
    subgraph L6["6. EXTERNAL INTEGRATIONS & HARNESS"]
        MCPGateway["MCP Gateway Server (GitHub, Postgres, Search)"]
        HermesEngine["Hermes Engine (Desktop Alerts & Webhooks)"]
        DashboardUI["Web Usage & Pricing Dashboard (Chart.js)"]
        AIBackends["AI LLM API Routers (Opus / Sonnet / Gemini / GPT)"]
    end

    %% Flow Relationships
    UserPrompt --> IDEInterface
    SlashCmd --> IDEInterface
    IDEInterface --> HarnessCore

    HarnessCore --> Apex1
    Apex1 --> Vector
    Vector --> Aura
    Aura -->|DELEGATE TO| SpecialistPool

    SpecialistPool --> PreHook
    PreHook --> LoopDet
    PreHook --> DeltaEngine
    PreHook --> SkelEngine
    PreHook --> Compressor
    PreHook --> ArchiveStore
    PreHook --> TFIDFEngine

    TFIDFEngine <--> CortexMemory
    LearnHook <--> PatternStore
    ArchiveStore <--> ArchiveFiles
    CoachEngine <--> Checkpoints

    PreHook --> AIBackends
    AIBackends --> PostHook

    PostHook --> CortexMemory
    PostHook --> PatternStore
    PostHook --> DashboardUI
    PostHook --> HermesEngine

    Link -->|Protocol Bridge| MCPGateway
    HermesNode -->|Notification Dispatch| HermesEngine
```

---

## 🔄 2. Internal Subsystem Interaction Flow

```mermaid
sequenceDiagram
    autonumber
    actor Developer as Developer / IDE Chat
    participant Harness as Agent Harness (Apex-1)
    participant PreHook as PreToolUse Interceptor
    participant Optim as Token Optimizer Engine
    participant Cortex as Shared Storage (Cortex)
    participant Model as AI Backend (LLM)
    participant PostHook as PostToolUse Interceptor
    participant Hermes as Hermes Messenger

    Developer->>Harness: Submit Goal / Task Prompt
    Harness->>Harness: Decompose Task & Delegate to Specialist (e.g. @forge)
    
    Harness->>PreHook: Invoke Tool / Task Request
    PreHook->>Optim: Check Loop Detector & Compress Prompt
    Optim-->>PreHook: Return Clean Prompt & Loop Status
    
    PreHook->>Cortex: Query TF-IDF Relevant Memories & Style Patterns
    Cortex-->>PreHook: Return Top 3 Memories & Code Conventions
    
    alt File Read Operation
        PreHook->>Optim: Check File Hash for Delta Mode / AST Skeleton
        Optim-->>PreHook: Return Diffs or AST Skeleton
    else Output > 4KB
        PreHook->>Optim: Archive Output to .oh-my-orq/archives/
        Optim-->>PreHook: Return Progressive Disclosure Pointer
    end

    PreHook->>Model: Dispatch Enriched & Optimized Prompt to AI Backend
    Model-->>Harness: Generate Code / Solution Output
    
    Harness->>PostHook: Forward Execution Results
    PostHook->>Cortex: Record Token Count, Costs & Decision Artifacts
    PostHook->>Hermes: Trigger Notification (if task completes or budget alert)
    Hermes-->>Developer: Desktop Alert / Webhook Notification
    PostHook-->>Developer: Render Final Solution Artifact
```

---

## 🛠️ 3. Detailed Component Interaction Specifications

### A. Agent Harness & Delegation Layer (`cli/orq.js` & `skills/`)
- **Agent Coordinator**: Manages active agent instances (`Apex-1`, `Vector`, `Atlas`, `Forge`, `Nova`, `Aegis`, `Link`, `Sync`, `Hermes`, etc.).
- **Delegation Protocol**: When `Apex-1` processes a prompt, it emits `[DELEGATE TO: <agent>]`. The harness intercepts this directive, isolates prompt context for that specialist, and executes the target agent persona.

---

### B. PreToolUse & PostToolUse Hooks Pipeline (`hooks/`)
- **`PreToolUse.js`**:
  1. **Loop Detection**: Calculates MD5 signature hashes of recent tool calls. If identical calls repeat with confidence $> 0.7$, it injects a warning alert to break infinite retry loops.
  2. **Delta Mode**: Compares file SHA-256 hashes against prior reads. Re-reads return unified git diffs instead of full files (saving 85-95% tokens).
  3. **Code Skeletons**: Replaces large first-time or re-read code files with structural AST skeletons (imports, exports, class & method signatures).
  4. **Progressive Disclosure**: Tool outputs $> 4\text{ KB}$ are written to `.oh-my-orq/archives/<id>.txt`. Context receives a 100-token preview + `orq expand <id>` command.
  5. **Cortex Memory Recall**: Executes TF-IDF keyword matching with exponential recency decay ($e^{-\lambda t}$) against `.oh-my-orq/memory/cortex.json`.
  6. **Style Injection**: Fetches codebase conventions (`ES6`/`CommonJS`, `camelCase`/`snake_case`, `async/await`) from `.oh-my-orq/patterns.json`.
- **`PostToolUse.js`**:
  1. Records input/output tokens, cache hits, and estimated cost (USD) into the local SQLite/JSON usage database.
  2. Auto-captures bug fixes and architecture decisions to Cortex memory.
  3. Triggers system desktop alerts and webhooks via **Hermes Messenger**.

---

### C. Shared Storage Architecture (`memory/`)
- **Project Cortex (`cortex.js` & `schema.sql`)**:
  - Main persistent database located at `.oh-my-orq/memory/cortex.json` (SQLite schema ready).
  - Isolates memory per project workspace URI.
  - Stores memories (`type`, `content`, `tags`, `score`, `timestamp`) and usage metrics (`input_tokens`, `output_tokens`, `cost_usd`, `cached_tokens`).
- **Codebase Pattern Store (`learning.js`)**:
  - Scans target project directories and maintains `.oh-my-orq/patterns.json` detailing project-specific coding conventions.

---

### D. Model Context Protocol (MCP Gateway) (`mcp/`)
- **Managed by Agent `link`**:
  - Bridges `oh-my-orq` agents with external tools via standard MCP JSON-RPC protocol.
  - Pre-configured MCP servers in `mcp/mcp_config.json`:
    - **GitHub MCP**: PR creation, code reviews, issue searches.
    - **PostgreSQL MCP**: Live database schema inspection and queries.
    - **Filesystem MCP**: High-speed local filesystem operations.
    - **Web Search MCP**: Real-time documentation retrieval.

---

### E. Hermes Autonomous Messaging Harness (`hermes/`)
- **Managed by Agent `hermes`**:
  - Dispatches desktop system notifications (macOS `osascript`, Linux `notify-send`, Windows).
  - Posts JSON payloads to Slack, Discord, or Microsoft Teams webhooks.
  - Logs notification events in `.oh-my-orq/messages.json`.
