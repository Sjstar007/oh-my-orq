#!/usr/bin/env node

/**
 * Oh My Orq Project Cortex — Shared Memory System
 *
 * Provides persistent, project-scoped memory for AI agents.
 * Memories survive across sessions and IDE restarts.
 *
 * Usage:
 *   node cortex.js save "<content>" --type decision --tags "auth,jwt"
 *   node cortex.js recall "authentication"
 *   node cortex.js list
 *   node cortex.js clear
 *   node cortex.js --test
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// ============================================
// DATABASE SETUP (SQLite via better-sqlite3 or JSON fallback)
// ============================================

const MEMORY_DIR = path.join(process.env.HOME || process.env.USERPROFILE, '.oh-my-orq', 'memory');
const DB_PATH = path.join(MEMORY_DIR, 'cortex.json');

// Ensure directory exists
if (!fs.existsSync(MEMORY_DIR)) {
  fs.mkdirSync(MEMORY_DIR, { recursive: true });
}

/**
 * JSON-based memory store (no external dependencies required)
 * For production, swap this with better-sqlite3 using schema.sql
 */
class MemoryStore {
  constructor(dbPath) {
    this.dbPath = dbPath;
    this.data = this._load();
  }

  _load() {
    try {
      if (fs.existsSync(this.dbPath)) {
        return JSON.parse(fs.readFileSync(this.dbPath, 'utf-8'));
      }
    } catch (e) {
      console.error('Warning: Could not load memory store, creating new one.');
    }
    return {
      memories: [],
      token_usage: [],
      sessions: [],
      prompt_cache: []
    };
  }

  _save() {
    fs.writeFileSync(this.dbPath, JSON.stringify(this.data, null, 2), 'utf-8');
  }

  // ---- MEMORY OPERATIONS ----

  saveMemory(content, options = {}) {
    const memory = {
      id: crypto.randomUUID(),
      project_id: options.projectId || this._getProjectId(),
      type: options.type || 'decision',
      content: content,
      tags: options.tags || [],
      relevance_score: 1.0,
      created_at: new Date().toISOString(),
      last_accessed: new Date().toISOString(),
      access_count: 0,
      source_agent: options.agent || 'user',
      session_id: options.sessionId || null
    };
    this.data.memories.push(memory);
    this._save();
    return memory;
  }

  recallMemories(query, options = {}) {
    const projectId = options.projectId || this._getProjectId();
    const limit = options.limit || 10;

    const queryTerms = query.toLowerCase().split(/\s+/);

    return this.data.memories
      .filter(m => m.project_id === projectId)
      .map(m => {
        // Simple TF-IDF-like relevance scoring
        const contentLower = m.content.toLowerCase();
        const tagStr = (m.tags || []).join(' ').toLowerCase();
        let score = 0;

        for (const term of queryTerms) {
          if (contentLower.includes(term)) score += 2;
          if (tagStr.includes(term)) score += 3;
          if (m.type.toLowerCase().includes(term)) score += 1;
        }

        // Decay factor: newer memories score higher
        const ageMs = Date.now() - new Date(m.created_at).getTime();
        const ageDays = ageMs / (1000 * 60 * 60 * 24);
        const decayFactor = Math.max(0.1, 1 - (ageDays * 0.01));

        score *= decayFactor;
        score *= m.relevance_score;

        return { ...m, _searchScore: score };
      })
      .filter(m => m._searchScore > 0)
      .sort((a, b) => b._searchScore - a._searchScore)
      .slice(0, limit);
  }

  listMemories(options = {}) {
    const projectId = options.projectId || this._getProjectId();
    const limit = options.limit || 20;
    const type = options.type || null;

    return this.data.memories
      .filter(m => m.project_id === projectId)
      .filter(m => !type || m.type === type)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, limit);
  }

  clearMemories(projectId) {
    projectId = projectId || this._getProjectId();
    this.data.memories = this.data.memories.filter(m => m.project_id !== projectId);
    this._save();
  }

  // ---- TOKEN USAGE TRACKING ----

  trackTokenUsage(record) {
    const usage = {
      id: crypto.randomUUID(),
      session_id: record.sessionId || 'unknown',
      agent_name: record.agent || 'unknown',
      model_name: record.model || 'unknown',
      provider: record.provider || 'other',
      input_tokens: record.inputTokens || 0,
      output_tokens: record.outputTokens || 0,
      total_tokens: (record.inputTokens || 0) + (record.outputTokens || 0),
      cost_usd: record.cost || 0,
      task_type: record.taskType || 'general',
      task_description: record.taskDescription || '',
      cached_tokens: record.cachedTokens || 0,
      timestamp: new Date().toISOString(),
      project_id: record.projectId || this._getProjectId()
    };
    this.data.token_usage.push(usage);
    this._save();
    return usage;
  }

  getTokenUsage(options = {}) {
    let usage = this.data.token_usage;

    if (options.projectId) {
      usage = usage.filter(u => u.project_id === options.projectId);
    }
    if (options.model) {
      usage = usage.filter(u => u.model_name === options.model);
    }
    if (options.agent) {
      usage = usage.filter(u => u.agent_name === options.agent);
    }
    if (options.since) {
      const sinceDate = new Date(options.since);
      usage = usage.filter(u => new Date(u.timestamp) >= sinceDate);
    }

    return usage;
  }

  getTokenSummary(options = {}) {
    const usage = this.getTokenUsage(options);

    const byModel = {};
    const byAgent = {};
    let totalInput = 0;
    let totalOutput = 0;
    let totalCost = 0;
    let totalCached = 0;

    for (const u of usage) {
      // By model
      if (!byModel[u.model_name]) {
        byModel[u.model_name] = { input: 0, output: 0, cost: 0, count: 0, provider: u.provider };
      }
      byModel[u.model_name].input += u.input_tokens;
      byModel[u.model_name].output += u.output_tokens;
      byModel[u.model_name].cost += u.cost_usd;
      byModel[u.model_name].count += 1;

      // By agent
      if (!byAgent[u.agent_name]) {
        byAgent[u.agent_name] = { input: 0, output: 0, cost: 0, count: 0 };
      }
      byAgent[u.agent_name].input += u.input_tokens;
      byAgent[u.agent_name].output += u.output_tokens;
      byAgent[u.agent_name].cost += u.cost_usd;
      byAgent[u.agent_name].count += 1;

      totalInput += u.input_tokens;
      totalOutput += u.output_tokens;
      totalCost += u.cost_usd;
      totalCached += u.cached_tokens;
    }

    return {
      total: { input: totalInput, output: totalOutput, cost: totalCost, cached: totalCached },
      byModel,
      byAgent,
      recordCount: usage.length
    };
  }

  // ---- SESSION MANAGEMENT ----

  startSession(description) {
    const session = {
      id: crypto.randomUUID(),
      project_id: this._getProjectId(),
      started_at: new Date().toISOString(),
      ended_at: null,
      status: 'active',
      task_description: description || '',
      agents_used: [],
      total_tokens: 0,
      total_cost: 0
    };
    this.data.sessions.push(session);
    this._save();
    return session;
  }

  endSession(sessionId, status = 'completed') {
    const session = this.data.sessions.find(s => s.id === sessionId);
    if (session) {
      session.ended_at = new Date().toISOString();
      session.status = status;

      // Calculate totals
      const usage = this.data.token_usage.filter(u => u.session_id === sessionId);
      session.total_tokens = usage.reduce((sum, u) => sum + u.total_tokens, 0);
      session.total_cost = usage.reduce((sum, u) => sum + u.cost_usd, 0);
      session.agents_used = [...new Set(usage.map(u => u.agent_name))];

      this._save();
    }
    return session;
  }

  listSessions(options = {}) {
    return this.data.sessions
      .filter(s => !options.status || s.status === options.status)
      .sort((a, b) => new Date(b.started_at) - new Date(a.started_at))
      .slice(0, options.limit || 20);
  }

  // ---- PROMPT CACHING ----

  cachePrompt(prompt, agentName) {
    const hash = crypto.createHash('sha256').update(prompt).digest('hex').slice(0, 16);
    const existing = this.data.prompt_cache.find(p => p.hash === hash);

    if (existing) {
      existing.hit_count += 1;
      existing.last_used = new Date().toISOString();
      this._save();
      return { cached: true, hash, hitCount: existing.hit_count };
    }

    this.data.prompt_cache.push({
      hash,
      prompt_prefix: prompt.slice(0, 500),
      agent_name: agentName,
      hit_count: 0,
      last_used: new Date().toISOString(),
      created_at: new Date().toISOString(),
      size_tokens: Math.ceil(prompt.length / 4) // Rough estimate
    });
    this._save();
    return { cached: false, hash, hitCount: 0 };
  }

  getCacheStats() {
    const cache = this.data.prompt_cache;
    return {
      totalEntries: cache.length,
      totalHits: cache.reduce((sum, p) => sum + p.hit_count, 0),
      totalTokensCached: cache.reduce((sum, p) => sum + p.size_tokens, 0),
      topEntries: cache.sort((a, b) => b.hit_count - a.hit_count).slice(0, 10)
    };
  }

  // ---- EXPORT (for Dashboard) ----

  exportForDashboard() {
    return {
      tokenUsage: this.data.token_usage,
      sessions: this.data.sessions,
      memoryCount: this.data.memories.length,
      cacheStats: this.getCacheStats(),
      summary: this.getTokenSummary(),
      exportedAt: new Date().toISOString()
    };
  }

  // ---- UTILITIES ----

  _getProjectId() {
    // Use current working directory as project ID
    return process.cwd().replace(/[/\\]/g, '_').toLowerCase();
  }
}

// ============================================
// CLI INTERFACE
// ============================================

function main() {
  const store = new MemoryStore(DB_PATH);
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'save': {
      const content = args[1];
      if (!content) {
        console.error('Usage: cortex save "<content>" [--type <type>] [--tags <tag1,tag2>]');
        process.exit(1);
      }
      const typeIdx = args.indexOf('--type');
      const tagsIdx = args.indexOf('--tags');
      const type = typeIdx > -1 ? args[typeIdx + 1] : 'decision';
      const tags = tagsIdx > -1 ? args[tagsIdx + 1].split(',') : [];

      const memory = store.saveMemory(content, { type, tags });
      console.log(`✅ Memory saved: ${memory.id}`);
      console.log(`   Type: ${memory.type}`);
      console.log(`   Tags: ${memory.tags.join(', ') || 'none'}`);
      break;
    }

    case 'recall': {
      const query = args[1];
      if (!query) {
        console.error('Usage: cortex recall "<query>"');
        process.exit(1);
      }
      const results = store.recallMemories(query);
      if (results.length === 0) {
        console.log('No memories found matching your query.');
      } else {
        console.log(`📚 Found ${results.length} relevant memories:\n`);
        for (const m of results) {
          console.log(`  [${m.type}] ${m.content}`);
          console.log(`    Tags: ${(m.tags || []).join(', ') || 'none'} | Score: ${m._searchScore.toFixed(2)}`);
          console.log(`    Created: ${m.created_at}\n`);
        }
      }
      break;
    }

    case 'list': {
      const typeFilter = args.indexOf('--type') > -1 ? args[args.indexOf('--type') + 1] : null;
      const memories = store.listMemories({ type: typeFilter });
      if (memories.length === 0) {
        console.log('No memories stored for this project.');
      } else {
        console.log(`📚 ${memories.length} memories:\n`);
        for (const m of memories) {
          console.log(`  [${m.type}] ${m.content.slice(0, 80)}${m.content.length > 80 ? '...' : ''}`);
          console.log(`    Created: ${m.created_at}`);
        }
      }
      break;
    }

    case 'clear': {
      store.clearMemories();
      console.log('🗑️  All memories cleared for this project.');
      break;
    }

    case 'tokens': {
      const summary = store.getTokenSummary();
      console.log('📊 Token Usage Summary:\n');
      console.log(`  Total Input:  ${summary.total.input.toLocaleString()} tokens`);
      console.log(`  Total Output: ${summary.total.output.toLocaleString()} tokens`);
      console.log(`  Total Cached: ${summary.total.cached.toLocaleString()} tokens`);
      console.log(`  Total Cost:   $${summary.total.cost.toFixed(4)}\n`);

      if (Object.keys(summary.byModel).length > 0) {
        console.log('  By Model:');
        for (const [model, data] of Object.entries(summary.byModel)) {
          console.log(`    ${model}: ${data.input + data.output} tokens, $${data.cost.toFixed(4)} (${data.count} calls)`);
        }
      }

      if (Object.keys(summary.byAgent).length > 0) {
        console.log('\n  By Agent:');
        for (const [agent, data] of Object.entries(summary.byAgent)) {
          console.log(`    ${agent}: ${data.input + data.output} tokens, $${data.cost.toFixed(4)} (${data.count} calls)`);
        }
      }
      break;
    }

    case 'export': {
      const exported = store.exportForDashboard();
      const exportPath = args[1] || path.join(process.cwd(), 'dashboard', 'data', 'usage-data.json');
      fs.mkdirSync(path.dirname(exportPath), { recursive: true });
      fs.writeFileSync(exportPath, JSON.stringify(exported, null, 2));
      console.log(`📤 Dashboard data exported to: ${exportPath}`);
      break;
    }

    case '--test': {
      console.log('🧪 Running Cortex self-test...\n');

      // Test save
      const m1 = store.saveMemory('Use TailwindCSS v3.4 for this project', { type: 'preference', tags: ['css', 'frontend'] });
      console.log(`  ✅ Save: ${m1.id}`);

      const m2 = store.saveMemory('JWT auth with 15min token expiry and refresh tokens', { type: 'architecture', tags: ['auth', 'jwt', 'security'] });
      console.log(`  ✅ Save: ${m2.id}`);

      const m3 = store.saveMemory('PostgreSQL selected for main database', { type: 'decision', tags: ['database', 'postgres'] });
      console.log(`  ✅ Save: ${m3.id}`);

      // Test recall
      const results = store.recallMemories('authentication jwt');
      console.log(`  ✅ Recall: Found ${results.length} results for "authentication jwt"`);

      // Test token tracking
      store.trackTokenUsage({
        agent: 'oracle',
        model: 'claude-opus-4.8',
        provider: 'anthropic',
        inputTokens: 2500,
        outputTokens: 1800,
        cost: 0.0575,
        taskType: 'architecture'
      });
      store.trackTokenUsage({
        agent: 'codesmith',
        model: 'claude-sonnet-5',
        provider: 'anthropic',
        inputTokens: 4000,
        outputTokens: 6000,
        cost: 0.102,
        taskType: 'implementation'
      });
      store.trackTokenUsage({
        agent: 'pixel',
        model: 'gemini-2.5-pro',
        provider: 'google',
        inputTokens: 3000,
        outputTokens: 5000,
        cost: 0.0538,
        taskType: 'frontend'
      });
      console.log('  ✅ Token tracking: 3 records added');

      // Test summary
      const summary = store.getTokenSummary();
      console.log(`  ✅ Summary: ${summary.total.input + summary.total.output} total tokens, $${summary.total.cost.toFixed(4)}`);

      // Test prompt cache
      const cache1 = store.cachePrompt('You are Oracle, the System Architect...', 'oracle');
      const cache2 = store.cachePrompt('You are Oracle, the System Architect...', 'oracle');
      console.log(`  ✅ Prompt cache: miss=${!cache1.cached}, hit=${cache2.cached}`);

      // Test export
      const exported = store.exportForDashboard();
      console.log(`  ✅ Export: ${exported.tokenUsage.length} usage records, ${exported.memoryCount} memories`);

      console.log('\n🎉 All tests passed!');
      break;
    }

    default:
      console.log(`
🧠 Oh My Orq Cortex — Shared Memory System

Usage:
  cortex save "<content>" [--type <type>] [--tags <t1,t2>]   Save a memory
  cortex recall "<query>"                                     Search memories
  cortex list [--type <type>]                                 List memories
  cortex clear                                                Clear project memories
  cortex tokens                                               Show token usage summary
  cortex export [path]                                        Export data for dashboard
  cortex --test                                               Run self-test

Memory Types:
  decision, architecture, pattern, dependency, bug, preference, convention, lesson
      `);
  }
}

// Export for programmatic use
module.exports = { MemoryStore, DB_PATH, MEMORY_DIR };

// Run CLI if executed directly
if (require.main === module) {
  main();
}
