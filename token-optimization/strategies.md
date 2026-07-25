# Oh My Orq Token Optimization Strategies

## Overview

Token optimization reduces AI API costs by 40-70% without sacrificing output quality. These 8 strategies work together to minimize waste.

## Strategy 1: Smart Model Routing

**Savings: 30-60%**

Route tasks to the cheapest model that can handle the complexity:

| Complexity | Models | Cost/1M Tokens |
|------------|--------|----------------|
| Low | Haiku, Flash, Flash-Lite, Nano | $0.10 - $1.00 |
| Mid | Sonnet, Gemini Pro, Terra | $1.25 - $3.00 |
| High | Opus, GPT Sol | $5.00+ |

**Rule**: Never use Opus for a task that Haiku can handle.

## Strategy 2: Automatic Complexity Detection

**Savings: 15-25%**

Auto-detect task complexity from the description:
- **High signals**: "complex", "algorithm", "concurrent", "security audit", "machine learning"
- **Low signals**: "simple", "rename", "typo", "git commit", "update dependency"

This prevents over-routing simple tasks to expensive models.

## Strategy 3: Prompt Compression

**Savings: 5-15%**

Reduce prompt size before sending:
- Remove excessive whitespace and blank lines
- Strip HTML/markdown comments
- Trim unnecessary formatting
- Collapse repeated separators

## Strategy 4: Context Pruning

**Savings: 20-40%**

Each specialist gets ONLY relevant context:
- Backend agent → API docs, schema, server code
- Frontend agent → UI specs, component docs, CSS
- Security agent → Auth flows, permission rules

**Never** send the full project context to every agent.

## Strategy 5: Response Caching

**Savings: 10-30% (for repeated tasks)**

Cache common responses:
- Architecture templates
- Boilerplate code patterns
- Standard configurations
- Common error resolutions

Cache key = hash(agent_name + prompt). TTL = 24 hours default.

## Strategy 6: Token Budget Enforcement

**Savings: Prevents overruns**

Set per-agent token budgets:
```json
{
  "sisyphus": 50000,
  "oracle": 30000,
  "codesmith": 100000,
  "pixel": 80000,
  "tester": 40000,
  "librarian": 10000,
  "git-master": 5000
}
```

Soft limit (80%) → warning. Hard limit (100%) → switch to cheaper model.

## Strategy 7: Cost Estimation (Pre-flight)

**Savings: Awareness-driven**

Before running a task, estimate the cost:
```
Task: "Design authentication system"
Model: claude-opus-4.8
Est. Input: 5,000 tokens → $0.025
Est. Output: 3,000 tokens → $0.075
Total: $0.10
```

If estimated cost exceeds threshold, suggest cheaper alternative.

## Strategy 8: Batch Processing

**Savings: 10-20%**

Group small independent tasks and process them in a single API call:
- Multiple file renames
- Several small documentation updates
- Batch git commit messages

## Combined Impact

| Scenario | Without Optimization | With Optimization | Savings |
|----------|---------------------|-------------------|---------|
| Small project (10 tasks) | $2.50 | $0.80 | 68% |
| Medium project (50 tasks) | $15.00 | $5.50 | 63% |
| Large project (200 tasks) | $75.00 | $28.00 | 63% |

## Best Practices

1. **Start with routing** — it gives the biggest savings
2. **Always prune context** — agents work better with focused context anyway
3. **Cache aggressively** — architecture patterns repeat across projects
4. **Set budgets early** — prevents surprise bills
5. **Review reports** — run `orq tokens` regularly to spot waste
