# Oh My Orq MCP (Model Context Protocol) Integration Guide

Oh My Orq natively supports the Model Context Protocol (MCP) to connect AI agents to external tools, databases, and APIs.

## 🔌 Installed MCP Servers

Oh My Orq includes pre-configured settings for standard MCP servers in `mcp/mcp_config.json`:

| MCP Server | Domain | Features |
|------------|--------|----------|
| **GitHub MCP** | Version Control & PRs | Pull Requests, Issues, Repository Trees, Commits |
| **Postgres MCP** | Database | Schema Inspection, Table Reads, Parameterized Queries |
| **Filesystem MCP** | Local Storage | High-speed local file navigation & operations |
| **Web Search MCP** | Research | Up-to-date documentation search & web retrieval |

## 🚀 Setting Up MCP

1. Copy `mcp/mcp_config.json` to your global Antigravity config:
   ```bash
   cp mcp/mcp_config.json ~/.gemini/antigravity/mcp_config.json
   ```

2. Add your API tokens (e.g. `GITHUB_PERSONAL_ACCESS_TOKEN` or `BRAVE_API_KEY`).

3. Use **`link`** agent to orchestrate MCP calls:
   ```bash
   orq spawn link "Create Pull Request on GitHub repo myorg/myapp"
   ```

## 🛠️ Adding Custom MCP Servers

Add your server to `~/.gemini/antigravity/mcp_config.json`:

```json
{
  "mcpServers": {
    "my-custom-mcp": {
      "command": "node",
      "args": ["/path/to/server.js"],
      "env": { "KEY": "VALUE" }
    }
  }
}
```
