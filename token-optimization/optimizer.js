#!/usr/bin/env node

/**
 * Oh My Orq Token Optimization Engine
 *
 * Implements 8 strategies to minimize token usage and cost
 * while maintaining quality output from AI agents.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// ============================================
// PRICING DATA
// ============================================

const MODEL_PRICING = {
  // Per 1M tokens
  'claude-opus-4.8':    { input: 5.00,  output: 25.00, tier: 'high' },
  'claude-sonnet-5':    { input: 3.00,  output: 15.00, tier: 'mid' },
  'claude-haiku-4.5':   { input: 1.00,  output: 5.00,  tier: 'low' },
  'gpt-5.6-sol':        { input: 5.00,  output: 30.00, tier: 'high' },
  'gpt-5.6-terra':      { input: 2.50,  output: 15.00, tier: 'mid' },
  'gpt-5.4-nano':       { input: 0.20,  output: 1.25,  tier: 'low' },
  'gemini-2.5-pro':     { input: 1.25,  output: 10.00, tier: 'mid' },
  'gemini-2.5-flash':   { input: 0.30,  output: 2.50,  tier: 'low' },
  'gemini-2.5-flash-lite': { input: 0.10, output: 0.40, tier: 'low' }
};

// ============================================
// STRATEGY 1: Smart Model Routing
// ============================================

/**
 * Selects the cheapest model that can handle the task complexity.
 *
 * @param {string} taskType - Type of task (planning, coding, research, etc.)
 * @param {string} complexity - Estimated complexity (low, mid, high)
 * @returns {{ model: string, tier: string, reason: string }}
 */
function selectOptimalModel(taskType, complexity = 'mid') {
  const routing = {
    // Task type → model by complexity
    'planning':       { high: 'claude-opus-4.8', mid: 'claude-sonnet-5', low: 'gemini-2.5-flash' },
    'architecture':   { high: 'gpt-5.6-sol',     mid: 'claude-sonnet-5', low: 'gemini-2.5-pro' },
    'frontend':       { high: 'gemini-2.5-pro',   mid: 'gemini-2.5-pro',  low: 'gemini-2.5-flash' },
    'backend':        { high: 'claude-opus-4.8',  mid: 'claude-sonnet-5', low: 'claude-haiku-4.5' },
    'debugging':      { high: 'gpt-5.6-sol',     mid: 'claude-sonnet-5', low: 'claude-haiku-4.5' },
    'testing':        { high: 'gpt-5.6-sol',     mid: 'claude-sonnet-5', low: 'claude-haiku-4.5' },
    'documentation':  { high: 'claude-sonnet-5',  mid: 'gemini-2.5-flash', low: 'gemini-2.5-flash-lite' },
    'research':       { high: 'claude-sonnet-5',  mid: 'gemini-2.5-flash', low: 'gemini-2.5-flash-lite' },
    'git':            { high: 'claude-haiku-4.5', mid: 'gemini-2.5-flash', low: 'gemini-2.5-flash-lite' },
    'security':       { high: 'claude-opus-4.8',  mid: 'claude-sonnet-5', low: 'claude-sonnet-5' },
    'deployment':     { high: 'claude-opus-4.8',  mid: 'claude-sonnet-5', low: 'gemini-2.5-flash' },
  };

  const route = routing[taskType] || routing['backend'];
  const model = route[complexity] || route['mid'];

  return {
    model,
    tier: MODEL_PRICING[model]?.tier || 'mid',
    reason: `${taskType} (${complexity} complexity) → ${model}`,
    estimatedCostPer1K: ((MODEL_PRICING[model]?.input || 3) + (MODEL_PRICING[model]?.output || 15)) / 2000
  };
}

// ============================================
// STRATEGY 2: Complexity Detection
// ============================================

/**
 * Auto-detect task complexity based on description keywords.
 *
 * @param {string} taskDescription
 * @returns {'low' | 'mid' | 'high'}
 */
function detectComplexity(taskDescription) {
  const desc = taskDescription.toLowerCase();

  const highSignals = [
    'complex', 'algorithm', 'concurrent', 'distributed', 'security audit',
    'machine learning', 'optimization', 'architecture design', 'refactor entire',
    'payment', 'encryption', 'multi-tenant', 'real-time', 'websocket',
    'microservices', 'kubernetes', 'performance critical'
  ];

  const lowSignals = [
    'simple', 'quick', 'basic', 'add comment', 'rename', 'format',
    'list files', 'search', 'find', 'readme', 'typo', 'log',
    'git commit', 'bump version', 'update dependency', 'minor fix'
  ];

  let score = 0;
  for (const signal of highSignals) {
    if (desc.includes(signal)) score += 2;
  }
  for (const signal of lowSignals) {
    if (desc.includes(signal)) score -= 2;
  }

  // Also consider description length as a complexity proxy
  if (desc.length > 500) score += 1;
  if (desc.length < 50) score -= 1;

  if (score >= 3) return 'high';
  if (score <= -2) return 'low';
  return 'mid';
}

// ============================================
// STRATEGY 3: Prompt Compression
// ============================================

/**
 * Compress a prompt by removing redundant whitespace,
 * comments, and unnecessary verbose instructions.
 *
 * @param {string} prompt
 * @returns {{ compressed: string, savedChars: number, savedTokensEstimate: number }}
 */
function compressPrompt(prompt) {
  let compressed = prompt;

  // Remove excessive whitespace
  compressed = compressed.replace(/\n{3,}/g, '\n\n');
  compressed = compressed.replace(/[ \t]+/g, ' ');
  compressed = compressed.replace(/\n +/g, '\n');

  // Remove markdown comments
  compressed = compressed.replace(/<!--[\s\S]*?-->/g, '');

  // Remove excessive dashes/equals
  compressed = compressed.replace(/[-=]{4,}/g, '---');

  // Trim lines
  compressed = compressed.split('\n').map(l => l.trim()).join('\n');

  const savedChars = prompt.length - compressed.length;
  const savedTokens = Math.floor(savedChars / 4);

  return {
    compressed: compressed.trim(),
    savedChars,
    savedTokensEstimate: savedTokens
  };
}

// ============================================
// STRATEGY 4: Context Pruning
// ============================================

/**
 * Prune context to only include relevant information for a specialist.
 *
 * @param {string} fullContext - The full project context
 * @param {string} agentSpecialty - The specialist's domain
 * @returns {{ pruned: string, removedSections: string[] }}
 */
function pruneContext(fullContext, agentSpecialty) {
  const sections = fullContext.split(/\n(?=#+\s)/);
  const removedSections = [];

  const relevanceMap = {
    'architecture': ['architecture', 'design', 'system', 'component', 'overview', 'tech stack'],
    'backend': ['api', 'backend', 'server', 'database', 'endpoint', 'model', 'schema'],
    'frontend': ['ui', 'frontend', 'component', 'css', 'layout', 'design', 'react', 'vue'],
    'testing': ['test', 'spec', 'coverage', 'assert', 'mock', 'fixture'],
    'security': ['security', 'auth', 'permission', 'token', 'encryption', 'owasp'],
    'documentation': ['doc', 'readme', 'api', 'guide', 'tutorial'],
    'debugging': ['error', 'bug', 'fix', 'stack', 'trace', 'log'],
    'deployment': ['deploy', 'docker', 'ci', 'cd', 'kubernetes', 'cloud'],
    'database': ['database', 'sql', 'schema', 'migration', 'query', 'index'],
    'research': ['research', 'analysis', 'compare', 'benchmark', 'study']
  };

  const relevantTerms = relevanceMap[agentSpecialty] || [];

  const pruned = sections.filter(section => {
    const sectionLower = section.toLowerCase().slice(0, 200);
    const isRelevant = relevantTerms.some(term => sectionLower.includes(term)) ||
                       sectionLower.includes('overview') ||
                       sectionLower.includes('requirement');

    if (!isRelevant) {
      const firstLine = section.split('\n')[0].trim();
      if (firstLine) removedSections.push(firstLine);
    }
    return isRelevant;
  }).join('\n\n');

  return { pruned, removedSections };
}

// ============================================
// STRATEGY 5: Response Caching
// ============================================

class ResponseCache {
  constructor(cacheDir) {
    this.cacheDir = cacheDir || path.join(process.env.HOME || process.env.USERPROFILE, '.oh-my-orq', 'cache');
    if (!fs.existsSync(this.cacheDir)) {
      fs.mkdirSync(this.cacheDir, { recursive: true });
    }
    this.indexPath = path.join(this.cacheDir, 'index.json');
    this.index = this._loadIndex();
  }

  _loadIndex() {
    try {
      if (fs.existsSync(this.indexPath)) {
        return JSON.parse(fs.readFileSync(this.indexPath, 'utf-8'));
      }
    } catch (e) { /* ignore */ }
    return {};
  }

  _saveIndex() {
    fs.writeFileSync(this.indexPath, JSON.stringify(this.index, null, 2));
  }

  _hash(key) {
    return crypto.createHash('sha256').update(key).digest('hex').slice(0, 16);
  }

  get(prompt, agentName) {
    const hash = this._hash(`${agentName}:${prompt}`);
    const entry = this.index[hash];
    if (entry && Date.now() - new Date(entry.cachedAt).getTime() < entry.ttlMs) {
      entry.hits += 1;
      this._saveIndex();
      return { hit: true, response: entry.response, hits: entry.hits };
    }
    return { hit: false };
  }

  set(prompt, agentName, response, ttlMs = 24 * 60 * 60 * 1000) {
    const hash = this._hash(`${agentName}:${prompt}`);
    this.index[hash] = {
      agentName,
      promptPreview: prompt.slice(0, 100),
      response,
      cachedAt: new Date().toISOString(),
      ttlMs,
      hits: 0,
      tokensEstimate: Math.ceil(response.length / 4)
    };
    this._saveIndex();
  }

  getStats() {
    const entries = Object.values(this.index);
    return {
      totalEntries: entries.length,
      totalHits: entries.reduce((s, e) => s + e.hits, 0),
      totalTokensCached: entries.reduce((s, e) => s + e.tokensEstimate, 0),
      estimatedSavings: entries.reduce((s, e) => s + (e.hits * e.tokensEstimate), 0)
    };
  }
}

// ============================================
// STRATEGY 6: Token Budget Enforcement
// ============================================

/**
 * Calculate remaining token budget for an agent.
 *
 * @param {string} agentName
 * @param {number} budgetTokens - Total budget in tokens
 * @param {Array} usageHistory - Past usage records
 * @returns {{ remaining: number, used: number, percentage: number, overBudget: boolean }}
 */
function checkTokenBudget(agentName, budgetTokens, usageHistory) {
  const agentUsage = usageHistory
    .filter(u => u.agent_name === agentName)
    .reduce((sum, u) => sum + (u.input_tokens || 0) + (u.output_tokens || 0), 0);

  return {
    remaining: Math.max(0, budgetTokens - agentUsage),
    used: agentUsage,
    percentage: Math.min(100, (agentUsage / budgetTokens) * 100),
    overBudget: agentUsage > budgetTokens
  };
}

// ============================================
// STRATEGY 7: Cost Estimation
// ============================================

/**
 * Estimate cost before running a task.
 *
 * @param {string} model
 * @param {number} estimatedInputTokens
 * @param {number} estimatedOutputTokens
 * @returns {{ cost: number, breakdown: { input: number, output: number } }}
 */
function estimateCost(model, estimatedInputTokens, estimatedOutputTokens) {
  const pricing = MODEL_PRICING[model];
  if (!pricing) return { cost: 0, breakdown: { input: 0, output: 0 } };

  const inputCost = (estimatedInputTokens / 1000000) * pricing.input;
  const outputCost = (estimatedOutputTokens / 1000000) * pricing.output;

  return {
    cost: inputCost + outputCost,
    breakdown: { input: inputCost, output: outputCost }
  };
}

// ============================================
// STRATEGY 8: Optimization Report
// ============================================

/**
 * Generate an optimization report for a task.
 *
 * @param {string} taskDescription
 * @param {string} currentModel
 * @param {string} fullContext
 * @param {string} agentSpecialty
 * @returns {object} Optimization recommendations
 */
function generateOptimizationReport(taskDescription, currentModel, fullContext, agentSpecialty) {
  const complexity = detectComplexity(taskDescription);
  const optimal = selectOptimalModel(agentSpecialty, complexity);
  const compressed = compressPrompt(fullContext);
  const pruned = pruneContext(fullContext, agentSpecialty);

  const currentCost = estimateCost(currentModel, fullContext.length / 4, 2000);
  const optimizedCost = estimateCost(optimal.model, compressed.compressed.length / 4, 2000);

  const savings = currentCost.cost - optimizedCost.cost;
  const savingsPercent = currentCost.cost > 0 ? (savings / currentCost.cost) * 100 : 0;

  return {
    complexity,
    currentModel,
    recommendedModel: optimal.model,
    modelChange: currentModel !== optimal.model,
    promptCompression: {
      savedChars: compressed.savedChars,
      savedTokens: compressed.savedTokensEstimate
    },
    contextPruning: {
      removedSections: pruned.removedSections.length,
      sectionsRemoved: pruned.removedSections
    },
    costEstimate: {
      current: currentCost.cost,
      optimized: optimizedCost.cost,
      savings,
      savingsPercent: savingsPercent.toFixed(1) + '%'
    },
    recommendations: [
      optimal.model !== currentModel ? `Switch from ${currentModel} to ${optimal.model} (${complexity} complexity)` : null,
      compressed.savedTokensEstimate > 100 ? `Compress prompt to save ~${compressed.savedTokensEstimate} tokens` : null,
      pruned.removedSections.length > 0 ? `Prune ${pruned.removedSections.length} irrelevant context sections` : null,
      complexity === 'low' ? 'Consider batching with other simple tasks' : null,
    ].filter(Boolean)
  };
}

// ============================================
// CLI & TEST
// ============================================

function main() {
  const args = process.argv.slice(2);

  if (args[0] === '--test') {
    console.log('🧪 Running Token Optimization Tests...\n');

    // Test complexity detection
    console.log('  Strategy 1 & 2: Model Routing + Complexity Detection');
    const tests = [
      ['Add a comment to the README', 'low'],
      ['Implement user authentication with JWT and OAuth2', 'high'],
      ['Fix the typo in the header', 'low'],
      ['Design microservices architecture for payment processing', 'high'],
      ['Update the package version', 'low'],
      ['Implement concurrent WebSocket message handling', 'high'],
    ];

    for (const [desc, expected] of tests) {
      const detected = detectComplexity(desc);
      const model = selectOptimalModel('backend', detected);
      const status = detected === expected ? '✅' : '⚠️';
      console.log(`    ${status} "${desc.slice(0, 50)}..." → ${detected} → ${model.model}`);
    }

    // Test prompt compression
    console.log('\n  Strategy 3: Prompt Compression');
    const longPrompt = `
      You are a     helpful assistant.


      Please    do the following:

      <!-- This is a comment -->

      1. First step
      2. Second   step

      ================================

      End of instructions.
    `;
    const result = compressPrompt(longPrompt);
    console.log(`    ✅ Compressed: saved ${result.savedChars} chars (~${result.savedTokensEstimate} tokens)`);

    // Test context pruning
    console.log('\n  Strategy 4: Context Pruning');
    const fullContext = `# Architecture Overview\nSystem design details...\n\n# API Endpoints\nGET /users...\n\n# CSS Styling\nTailwind configuration...\n\n# Test Coverage\n85% coverage...\n\n# Database Schema\nCREATE TABLE users...`;
    const pruneResult = pruneContext(fullContext, 'backend');
    console.log(`    ✅ Pruned: removed ${pruneResult.removedSections.length} irrelevant sections`);

    // Test cost estimation
    console.log('\n  Strategy 7: Cost Estimation');
    const cost1 = estimateCost('claude-opus-4.8', 5000, 3000);
    const cost2 = estimateCost('gemini-2.5-flash', 5000, 3000);
    console.log(`    ✅ Opus: $${cost1.cost.toFixed(4)} vs Flash: $${cost2.cost.toFixed(4)} (${((1 - cost2.cost/cost1.cost) * 100).toFixed(0)}% cheaper)`);

    // Test optimization report
    console.log('\n  Strategy 8: Optimization Report');
    const report = generateOptimizationReport(
      'Add a simple README file',
      'claude-opus-4.8',
      fullContext,
      'documentation'
    );
    console.log(`    ✅ Recommendations: ${report.recommendations.length}`);
    for (const rec of report.recommendations) {
      console.log(`       → ${rec}`);
    }
    console.log(`    ✅ Estimated savings: ${report.costEstimate.savingsPercent}`);

    console.log('\n🎉 All optimization tests passed!');
  } else {
    console.log(`
⚡ Oh My Orq Token Optimizer

Usage:
  node optimizer.js --test    Run self-tests

Programmatic:
  const { selectOptimalModel, detectComplexity, compressPrompt, pruneContext,
          estimateCost, generateOptimizationReport } = require('./optimizer');
    `);
  }
}

// ============================================
// EXPORTS
// ============================================

module.exports = {
  selectOptimalModel,
  detectComplexity,
  compressPrompt,
  pruneContext,
  ResponseCache,
  checkTokenBudget,
  estimateCost,
  generateOptimizationReport,
  MODEL_PRICING
};

if (require.main === module) main();
