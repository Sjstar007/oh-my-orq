# Contributing to Oh My Orq

Thank you for your interest in contributing to **Oh My Orq**! We welcome contributions of all kinds: new agent skills, token optimization strategies, themes, MCP server integrations, and bug fixes.

---

## 🏗️ Project Architecture Overview

Oh My Orq is built around modular, decoupled components:

- `skills/`: Specialized Agent definitions (`SKILL.md`)
- `workflows/`: Slash command workflows (`/ultrawork`, `/research`, `/ralph`, `/learn`)
- `delegation/`: Inter-agent delegation protocol and skill registry (`registry.json`)
- `memory/`: Shared Memory engine (`cortex.js`) & continuous learning scanner (`learning.js`)
- `token-optimization/`: 14 token optimization features (Delta Mode, Skeletons, Output Compressor, Archive Store, Loop Detector, Quality Coach)
- `hooks/`: Execution lifecycle hooks (`PreToolUse.js`, `PostToolUse.js`, `LearningHook.js`)
- `dashboard/`: Premium dark-mode HTML/CSS/JS dashboard
- `mcp/`: Model Context Protocol server configuration & tools
- `themes/`: Visual theme presets (`theme-engine.js`)
- `cli/`: Executable binaries (`orq.js`, `install.js`)

---

## 🤖 Adding a New Agent Skill

1. Create a directory under `skills/<agent-name>/`.
2. Add a `SKILL.md` file with YAML frontmatter:

```markdown
---
name: my-agent
description: Short one-line summary of what this agent does.
---

# Agent Persona & Guidelines
...
```

3. Register your agent in `delegation/registry.json` under `specialists`.
4. Run tests:
   ```bash
   node cli/orq.js list
   ```

---

## 🔌 Adding an MCP Server

1. Add your server configuration template to `mcp/mcp_config.json`:
```json
{
  "mcpServers": {
    "my-server": {
      "command": "npx",
      "args": ["-y", "my-mcp-package"]
    }
  }
}
```
2. Update `mcp/README.md` with instructions.

---

## 🎨 Adding a Theme Preset

1. Open `themes/theme-engine.js`.
2. Add your theme definition to `THEMES`:
```javascript
'my-theme': {
  name: 'My Theme Name',
  primary: '#ff0055',
  secondary: '#00ffff',
  background: '#0d0221',
  text: '#ffffff',
  accentGradient: 'linear-gradient(135deg, #ff0055, #00ffff)'
}
```
3. Test your theme:
   ```bash
   node cli/orq.js theme my-theme
   ```

---

## 🧪 Running Tests

Ensure all core tests pass before submitting a Pull Request:

```bash
# Run memory tests
npm run test:memory

# Run optimization tests
npm run test:optimizer

# Test CLI catalog
node cli/orq.js list

# Test continuous learning
node cli/orq.js learn
```

---

## 📜 Pull Request Guidelines

1. Fork the repository and create a feature branch (`feature/my-feature`).
2. Commit changes using Conventional Commits (`feat:`, `fix:`, `docs:`).
3. Ensure no hardcoded secrets or API keys are committed.
4. Submit your Pull Request for review!
