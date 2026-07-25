# ⚡ oh-my-orq

**Multi-Agent Orchestration Framework for AI-Powered Application Generation**

> 30 specialized AI agents working together to build any application from scratch — featuring shared project memory, continuous codebase learning, 14-feature token optimization, Model Context Protocol (MCP) support, Hermes notification agent, visual themes, and a live web dashboard.

![Status](https://img.shields.io/badge/status-beta-yellow)
![Agents](https://img.shields.io/badge/agents-30-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## ✨ Features

- 🧠 **30 Specialized Agents** — Sisyphus, Oracle, CodeSmith, Pixel, Tester, Git Master, MCP Master, Hermes, and more
- 🎭 **Smart AI Backend Routing** — Auto-selects best AI model (GPT/Claude/Gemini) per task & complexity
- ⚡ **Delegation Protocol** — Structured `[DELEGATE TO: <agent>]` inter-agent communication syntax
- 🧠 **Shared Memory (Project Cortex)** — Persistent, project-scoped SQLite/JSON memory surviving IDE restarts
- 🧠 **Continuous Learning Engine** — Auto-detects codebase conventions (`ES6`/`CommonJS`, `camelCase`/`snake_case`, async & error patterns)
- ☤ **Hermes Autonomous Messaging** — Desktop notifications, Slack/Discord webhooks, and inter-agent message logs
- 🗜️ **14-Feature Token Optimization**:
  - **Delta Mode** — Re-reads send unified diffs instead of full files (saves 85-95%)
  - **Code Skeletons** — Large file re-reads return AST-style signatures & imports
  - **Output Compressor** — Condenses `pytest`, `npm test`, `git log`, `grep` output
  - **Progressive Disclosure (`expand`)** — Tool outputs > 4KB are archived to disk with retrieval pointers
  - **Compaction Checkpoints & Intel Digest** — Auto-restores state after IDE context compaction
  - **Loop Detector** — Alerts when agents get stuck in failing tool retry loops
  - **Keep-Warm Cache Pinger** — Keeps API prompt caches alive
  - **Quality Scoring & Coach Mode (`orq coach`)** — Real-time S–F context health grades and 30-day token waste audits
- 🔌 **Model Context Protocol (MCP) Support** — Pre-configured MCP integration for GitHub, PostgreSQL, Filesystem, and Web Search
- 🎨 **Visual Theme Engine** — Presets for `default-dark`, `cyberpunk`, `dracula`, `nord`
- 📊 **Token Usage Dashboard** — Beautiful web dashboard showing usage per model with pricing & budget monitor
- 🔧 **Cross-Platform CLI** — Works on Windows, macOS, Linux
- 📦 **One-Command Install** — `npx oh-my-orq`

---

## 🤖 Full Agent Catalog (30 Specialized Agents)

### 🏔️ 1. Orchestration & Planning (3 Agents)
| Agent Name | Role / Title | Assigned Model | Primary Specialty |
| :--- | :--- | :--- | :--- |
| **Sisyphus** | Master Orchestrator | `Claude Opus 4.8` | Project decomposition, delegation, integration & quality loops |
| **Prometheus** | Strategic Planner | `Claude Sonnet 5` | 3–7 stage task breakdown, resource & token estimation |
| **Metis** | Plan Consultant | `Claude Sonnet 5` | Plan validation, risk detection, and optimization review |

### 🏛️ 2. Architecture & Technical Strategy (3 Agents)
| Agent Name | Role / Title | Assigned Model | Primary Specialty |
| :--- | :--- | :--- | :--- |
| **Oracle** | System Architect | `GPT-5.6 Sol` / `Opus` | System design, tech stack selection, Mermaid diagrams |
| **Architect** | Database & API Designer | `Claude Sonnet 5` | SQL schemas, OpenAPI specs, REST/GraphQL design |
| **Strategist** | Technical Decision Maker | `Claude Sonnet 5` | Build vs. buy analysis, trade-off matrices, ROI evaluation |

### ⚒️ 3. Software Development & Engineering (4 Agents)
| Agent Name | Role / Title | Assigned Model | Primary Specialty |
| :--- | :--- | :--- | :--- |
| **CodeSmith** | Backend Implementation Expert | `Claude Sonnet 5` | Production backend code, SOLID principles, API endpoints |
| **Pixel** | UI/UX & Frontend Specialist | `Gemini 2.5 Pro` | Modern responsive UI, CSS grid/glassmorphism, Google Fonts |
| **Refactorer** | Code Quality Improver | `Claude Sonnet 5` | Code smell detection, DRY enforcement, function extraction |
| **Performance Expert** | Optimization Specialist | `Claude Opus 4.8` | Profiling, database indexing, caching, Core Web Vitals |

### 🧪 4. Testing, QA & Security (3 Agents)
| Agent Name | Role / Title | Assigned Model | Primary Specialty |
| :--- | :--- | :--- | :--- |
| **Tester** | Automated Testing Expert | `GPT-5.6 Sol` | Unit & integration tests, Jest/pytest, 80%+ coverage target |
| **QA Engineer** | Manual Testing Specialist | `Claude Haiku 4.5` | Test case creation, exploratory testing plans, bug filing |
| **Security Guard** | Security Auditor | `Claude Opus 4.8` | OWASP Top 10 audits, input sanitization, secret detection |

### 📚 5. Research & Documentation (4 Agents)
| Agent Name | Role / Title | Assigned Model | Primary Specialty |
| :--- | :--- | :--- | :--- |
| **Librarian** | Research Specialist | `Claude Haiku 4.5` | Documentation finding, code examples, library research |
| **Explorer** | Code Navigator | `Claude Haiku 4.5` | High-speed ripgrep/grep search, symbol lookup |
| **Scribe** | Technical Writer | `Claude Sonnet 5` | README generation, JSDoc, API docs, visual guides |
| **Researcher** | Multi-Repo Analyst | `Claude Sonnet 5` | Cross-repository pattern extraction & industry benchmarking |

### 📊 6. Data & Analytics (5 Agents)
| Agent Name | Role / Title | Assigned Model | Primary Specialty |
| :--- | :--- | :--- | :--- |
| **Scientist-Low** | Fast Data Explorer | `Claude Haiku 4.5` | Quick data loading, descriptive stats, basic cleaning |
| **Scientist** | Standard Statistical Analyst | `Claude Sonnet 5` | Hypothesis testing, regression analysis, quality gates |
| **Scientist-High** | Advanced Research Specialist | `Claude Opus 4.8` | Machine learning, causal inference, time-series forecasting |
| **Data Wizard** | ETL Pipeline Expert | `Claude Sonnet 5` | Data validation, transform pipelines, ETL automation |
| **SQL Master** | Database Query Specialist | `Claude Sonnet 5` | Complex SQL, EXPLAIN ANALYZE, window functions |

### 🛠️ 7. Tools, Messaging, MCP & DevOps (8 Agents)
| Agent Name | Role / Title | Assigned Model | Primary Specialty |
| :--- | :--- | :--- | :--- |
| **Debugger** | Bug Hunter | `GPT-5.6 Sol` | Error log analysis, stack trace reading, targeted quick fixes |
| **Git Master** | Version Control & GitHub Expert | `Claude Haiku 4.5` | Atomic commits, branch rebase, `git pull/push`, PR creation |
| **MCP Master** | Model Context Protocol Specialist | `Claude Sonnet 5` | Interfacing with GitHub, PostgreSQL, Web Search MCP servers |
| **Hermes** | Autonomous Messenger | `Claude Haiku 4.5` | System notifications, Slack/Discord webhooks, message logs |
| **DevOps Engineer** | Deployment Specialist | `Claude Opus 4.8` | Docker containerization, CI/CD pipelines, cloud deployment |
| **Playwright Master** | Browser Automation Expert | `Claude Sonnet 5` | E2E browser testing, page object models, web scraping |
| **Multimodal Looker** | Visual Analysis Expert | `Claude Opus 4.8` | UI screenshot reviews, diagram parsing, OCR text extraction |
| **Hello Orq** | Framework Demo Agent | `Claude Haiku 4.5` | Framework tutorials, installation verification & examples |

---

## 🚀 Quick Start

```bash
npx oh-my-orq
```

## 📋 CLI Commands

```bash
# Agent Catalog
orq list                         # List all 30 agents and their specialties

# Agent Management
orq install <agent> [--project]  # Install an agent globally or project-scoped
orq remove <agent>               # Remove an agent

# Messaging & Notifications (Hermes)
orq notify "<message>"           # Send desktop / system notification via Hermes

# Learning & Optimization
orq learn                        # Scan codebase & extract continuous learning patterns
orq coach                        # Run Token Coach audit & context health grade
orq expand [id]                  # Retrieve or list archived progressive disclosure outputs
orq compact-restore [session]    # Generate post-compaction Context Intel Digest
orq theme [name]                 # List or switch visual themes (cyberpunk, dracula, nord)

# Memory & Dashboard
orq memory save "..."            # Save a project memory
orq memory recall "..."          # Search memories
orq tokens                       # Show token usage summary
orq dashboard                    # Open web dashboard
```

## 🔌 Model Context Protocol (MCP)

AgentForge includes native MCP support via the **`mcp-master`** agent and `mcp/mcp_config.json`:
- **GitHub MCP**: Pull requests, issue management, code tree search
- **Postgres MCP**: Schema inspection and parameterized database queries
- **Filesystem MCP**: Local storage navigation
- **Web Search MCP**: Real-time documentation search

```bash
cp mcp/mcp_config.json ~/.gemini/antigravity/mcp_config.json
```

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on adding Agent Skills, MCP Servers, Themes, and Workflows.

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.
