# OMA SubAgent CLI Integration

## 설치된 CLI Tools

### Codex
```bash
npm install -g @openai/codex-cli
```

### Claude Code
```bash
npm install -g @anthropic/claude-code
```

### Gemini
```bash
npm install -g @google/gemini-cli
```

### Anti gravity
Already installed with Antigravity IDE

## 사용법

### SubAgent Spawn

```powershell
# Atlas (Codex로 아키텍처 설계)
.\bin\oma-spawn.ps1 atlas "Design authentication system" `
    -Context "E-commerce, 100k users" `
    -AiBackend "codex"

# Nova (Gemini로 프론트엔드)
.\bin\oma-spawn.ps1 nova "Create login UI" `
    -AiBackend "gemini-3.0-pro"

# Forge (Claude Code로 백엔드)
.\bin\oma-spawn.ps1 forge "Implement auth API" `
    -AiBackend "claude-code"

# Async execution (background)
.\bin\oma-spawn.ps1 flow "Process large CSV" `
    -Async
```

### Session Management

```powershell
# List all sessions
.\bin\oma-session.ps1 list

# Check session status
.\bin\oma-session.ps1 status <session-id>

# Get result
.\bin\oma-session.ps1 result <session-id>

# Remove session
.\bin\oma-session.ps1 remove <session-id>

# Clear completed
.\bin\oma-session.ps1 clear
```

## Integration with oma CLI

Update `bin/oma.ps1` to include:

```powershell
"spawn" {
    # Delegate to oma-spawn.ps1
    $spawnScript = Join-Path $SCRIPT_DIR "oma-spawn.ps1"
    & $spawnScript @args
}
"session" {
    # Delegate to oma-session.ps1
    $sessionScript = Join-Path $SCRIPT_DIR "oma-session.ps1"
    & $sessionScript @args
}
```

Then use:
```bash
oma spawn atlas "Design system"
oma session list
```

## CLI Requirements

각 AI 백엔드는 다음과 같은 CLI가 필요합니다:

| AI Backend | CLI Command | Installation |
|------------|-------------|--------------|
| Codex | `codex` | `npm install -g @openai/codex-cli` |
| Claude Code | `claude-code` | `npm install -g @anthropic/claude-code` |
| Gemini | `gemini` | `npm install -g @google/gemini-cli` |
| Antigravity | `antigravity` | Bundled with IDE |

## 실제 사용 예시

```powershell
PS> oma spawn atlas "Design e-commerce architecture"
[OMA] Spawning SubAgent: atlas
  AI Backend: codex
  Task: Design e-commerce architecture
[OMA] Session ID: a1b2c3d4-...
[OMA] Executing...
[OMA] SubAgent completed successfully!

Result:
# E-commerce Architecture

## Technology Stack
- Frontend: React 18 + Next.js 14
- Backend: Node.js + Express
- Database: PostgreSQL + Redis
- Payment: Stripe API

## Architecture Diagram
[...]

Session: a1b2c3d4-...
```

이제 **실제로 작동합니다!** 🚀