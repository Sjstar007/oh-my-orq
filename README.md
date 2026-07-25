# ⚡ Oh My Orq

**Multi-Agent Orchestration Framework for AI-Powered Application Generation**

> 30 specialized AI agents that work together to build any application from scratch — with shared memory, continuous learning, advanced token optimization, Model Context Protocol (MCP) support, Hermes notification agent, visual themes, and a live web dashboard.

![Status](https://img.shields.io/badge/status-beta-yellow)
![Agents](https://img.shields.io/badge/agents-30-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## ✨ Features

- 🧠 **30 Specialized Agents** — Sisyphus, Oracle, CodeSmith, Pixel, Tester, Git Master, MCP Master, **Hermes**, and more
- 🎭 **Smart AI Routing** — Auto-selects best AI backend (GPT/Claude/Gemini) per task
- ⚡ **Delegation Protocol** — Clear syntax for agent collaboration
- 🧠 **Shared Memory (Project Cortex)** — Persistent, project-scoped memory across sessions
- 🧠 **Continuous Learning Engine** — Auto-detects project coding conventions (`ES6`/`CommonJS`, `camelCase`/`snake_case`, async & error patterns)
- ☤ **Hermes Autonomous Messaging** — Desktop notifications, webhooks (Slack/Discord/Teams), and inter-agent transport
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

## 🚀 Quick Start

```bash
npx oh-my-orq
```

## 📋 CLI Commands

```bash
# Agent Management
orq list                         # List all 30 agents
orq install <agent> [--project]  # Install an agent
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

Oh My Orq includes native MCP support via the **`mcp-master`** agent and `mcp/mcp_config.json`:
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
