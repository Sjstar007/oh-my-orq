/**
 * Oh My Orq Dashboard — Main Application
 *
 * Renders token usage charts, pricing tables, cost calculator,
 * and budget monitor. Uses Chart.js for visualization.
 * Data source: usage-data.json (exported from Cortex) or localStorage.
 */

// ============================================
// DATA LOADING
// ============================================

const EMPTY_DATA = {
  tokenUsage: [],
  sessions: [],
  cacheStats: { totalEntries: 0, totalHits: 0, totalTokensCached: 0 }
};

let pricingData = {};
let usageData = EMPTY_DATA;
let budget = parseFloat(localStorage.getItem('oh-my-orq-budget') || '50');

// ============================================
// INITIALIZATION
// ============================================

async function init() {
  // Load pricing data
  try {
    const resp = await fetch('data/pricing.json');
    pricingData = await resp.json();
  } catch (e) {
    console.warn('Could not load pricing.json, using defaults');
    pricingData = getDefaultPricing();
  }

  // Try to load real usage data from usage-data.json or localStorage
  try {
    const resp = await fetch('data/usage-data.json');
    if (resp.ok) {
      const real = await resp.json();
      if (real && (real.tokenUsage || real.usage)) {
        usageData = {
          tokenUsage: real.tokenUsage || real.usage || [],
          sessions: real.sessions || [],
          cacheStats: real.cacheStats || { totalEntries: 0, totalHits: 0, totalTokensCached: 0 }
        };
      }
    }
  } catch (e) {
    const localSaved = localStorage.getItem('oh-my-orq-usage-data');
    if (localSaved) {
      try { usageData = JSON.parse(localSaved); } catch (err) {}
    }
  }

  renderSummaryCards();
  renderCharts();
  renderPricingTable();
  renderDetailTable();
  renderBudgetMonitor();
  setupCalculator();
  setupEventListeners();
}

function getDefaultPricing() {
  return {
    models: {
      "claude-opus-4.8": { provider: "Anthropic", displayName: "Claude Opus 4.8", tier: "high", inputCostPer1M: 5.00, outputCostPer1M: 25.00, contextWindow: 200000, strengths: ["PRD", "Complex backend"], color: "#d4a574" },
      "claude-sonnet-5": { provider: "Anthropic", displayName: "Claude Sonnet 5", tier: "mid", inputCostPer1M: 3.00, outputCostPer1M: 15.00, contextWindow: 200000, strengths: ["Fast coding"], color: "#b8956a" },
      "claude-haiku-4.5": { provider: "Anthropic", displayName: "Claude Haiku 4.5", tier: "low", inputCostPer1M: 1.00, outputCostPer1M: 5.00, contextWindow: 200000, strengths: ["Research"], color: "#8a6f4e" },
      "gemini-2.5-pro": { provider: "Google", displayName: "Gemini 2.5 Pro", tier: "mid", inputCostPer1M: 1.25, outputCostPer1M: 10.00, contextWindow: 1000000, strengths: ["Frontend/UI"], color: "#4285f4" },
      "gemini-2.5-flash": { provider: "Google", displayName: "Gemini 2.5 Flash", tier: "low", inputCostPer1M: 0.30, outputCostPer1M: 2.50, contextWindow: 1000000, strengths: ["Fast research"], color: "#34a853" },
      "gpt-5.6-sol": { provider: "OpenAI", displayName: "GPT-5.6 Sol", tier: "high", inputCostPer1M: 5.00, outputCostPer1M: 30.00, contextWindow: 256000, strengths: ["Architecture"], color: "#10a37f" }
    }
  };
}

// ============================================
// SUMMARY CARDS
// ============================================

function renderSummaryCards() {
  const usage = usageData.tokenUsage;
  const totalInput = usage.reduce((s, u) => s + u.input_tokens, 0);
  const totalOutput = usage.reduce((s, u) => s + u.output_tokens, 0);
  const totalCost = usage.reduce((s, u) => s + u.cost_usd, 0);
  const totalCached = usage.reduce((s, u) => s + (u.cached_tokens || 0), 0);
  const completedSessions = (usageData.sessions || []).filter(s => s.status === 'completed').length;

  document.getElementById('total-tokens').textContent = (totalInput + totalOutput).toLocaleString();
  document.getElementById('total-tokens-sub').textContent = `${totalInput.toLocaleString()} in + ${totalOutput.toLocaleString()} out`;
  document.getElementById('total-cost').textContent = `$${totalCost.toFixed(2)}`;
  document.getElementById('total-cost-sub').textContent = `across ${Object.keys(groupBy(usage, 'model_name')).length} models`;
  document.getElementById('total-sessions').textContent = completedSessions;
  document.getElementById('total-sessions-sub').textContent = `${(usageData.sessions || []).length} total`;
  document.getElementById('cache-hits').textContent = totalCached.toLocaleString();
  document.getElementById('cache-hits-sub').textContent = 'tokens saved via cache';
}

// ============================================
// CHARTS
// ============================================

let charts = {};

function renderCharts() {
  renderModelUsageChart();
  renderCostBreakdownChart();
  renderUsageTrendChart();
  renderAgentActivityChart();
  renderProviderSplitChart();
}

function renderModelUsageChart() {
  const byModel = groupBy(usageData.tokenUsage, 'model_name');
  const labels = Object.keys(byModel);
  const inputData = labels.map(m => byModel[m].reduce((s, u) => s + u.input_tokens, 0));
  const outputData = labels.map(m => byModel[m].reduce((s, u) => s + u.output_tokens, 0));
  const colors = labels.map(m => (pricingData.models?.[m]?.color) || '#7c5cfc');

  if (charts.modelUsage) charts.modelUsage.destroy();
  charts.modelUsage = new Chart(document.getElementById('chart-model-usage'), {
    type: 'bar',
    data: {
      labels: labels.map(l => pricingData.models?.[l]?.displayName || l),
      datasets: [
        { label: 'Input Tokens', data: inputData, backgroundColor: colors.map(c => c + 'AA'), borderRadius: 4 },
        { label: 'Output Tokens', data: outputData, backgroundColor: colors.map(c => c + '66'), borderRadius: 4 }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { labels: { color: '#8e8ea0', font: { family: 'Inter' } } } },
      scales: {
        x: { ticks: { color: '#8e8ea0', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.04)' } },
        y: { ticks: { color: '#8e8ea0' }, grid: { color: 'rgba(255,255,255,0.04)' } }
      }
    }
  });
}

function renderCostBreakdownChart() {
  const byModel = groupBy(usageData.tokenUsage, 'model_name');
  const labels = Object.keys(byModel);
  const costs = labels.map(m => byModel[m].reduce((s, u) => s + u.cost_usd, 0));
  const colors = labels.map(m => (pricingData.models?.[m]?.color) || '#7c5cfc');

  if (charts.costBreakdown) charts.costBreakdown.destroy();
  charts.costBreakdown = new Chart(document.getElementById('chart-cost-breakdown'), {
    type: 'doughnut',
    data: {
      labels: labels.map(l => pricingData.models?.[l]?.displayName || l),
      datasets: [{ data: costs, backgroundColor: colors, borderWidth: 0 }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '65%',
      plugins: {
        legend: { position: 'right', labels: { color: '#8e8ea0', font: { family: 'Inter', size: 11 }, padding: 12 } }
      }
    }
  });
}

function renderUsageTrendChart() {
  const byDate = {};
  for (const u of usageData.tokenUsage) {
    const date = u.timestamp.split('T')[0];
    if (!byDate[date]) byDate[date] = { input: 0, output: 0, cost: 0 };
    byDate[date].input += u.input_tokens;
    byDate[date].output += u.output_tokens;
    byDate[date].cost += u.cost_usd;
  }
  const dates = Object.keys(byDate).sort();

  if (charts.usageTrend) charts.usageTrend.destroy();
  charts.usageTrend = new Chart(document.getElementById('chart-usage-trend'), {
    type: 'line',
    data: {
      labels: dates,
      datasets: [
        {
          label: 'Input Tokens',
          data: dates.map(d => byDate[d].input),
          borderColor: '#7c5cfc',
          backgroundColor: 'rgba(124,92,252,0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6
        },
        {
          label: 'Output Tokens',
          data: dates.map(d => byDate[d].output),
          borderColor: '#4ecdc4',
          backgroundColor: 'rgba(78,205,196,0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { labels: { color: '#8e8ea0', font: { family: 'Inter' } } } },
      scales: {
        x: { ticks: { color: '#8e8ea0' }, grid: { color: 'rgba(255,255,255,0.04)' } },
        y: { ticks: { color: '#8e8ea0' }, grid: { color: 'rgba(255,255,255,0.04)' } }
      }
    }
  });
}

function renderAgentActivityChart() {
  const byAgent = groupBy(usageData.tokenUsage, 'agent_name');
  const labels = Object.keys(byAgent);
  const tokens = labels.map(a => byAgent[a].reduce((s, u) => s + u.input_tokens + u.output_tokens, 0));
  const colors = ['#7c5cfc', '#4ecdc4', '#ff6b6b', '#ffd93d', '#4285f4', '#34a853', '#d4a574', '#b8956a', '#10a37f', '#8a6f4e', '#6a4ae0', '#ff8c94', '#91d8e0', '#d4a5ff'];

  if (charts.agentActivity) charts.agentActivity.destroy();
  charts.agentActivity = new Chart(document.getElementById('chart-agent-activity'), {
    type: 'bar',
    data: {
      labels,
      datasets: [{ label: 'Total Tokens', data: tokens, backgroundColor: colors.slice(0, labels.length), borderRadius: 6 }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: '#8e8ea0' }, grid: { color: 'rgba(255,255,255,0.04)' } },
        y: { ticks: { color: '#8e8ea0', font: { size: 11 } }, grid: { display: false } }
      }
    }
  });
}

function renderProviderSplitChart() {
  const byProvider = groupBy(usageData.tokenUsage, 'provider');
  const labels = Object.keys(byProvider);
  const costs = labels.map(p => byProvider[p].reduce((s, u) => s + u.cost_usd, 0));
  const providerColors = { anthropic: '#d4a574', google: '#4285f4', openai: '#10a37f', other: '#8e8ea0' };

  if (charts.providerSplit) charts.providerSplit.destroy();
  charts.providerSplit = new Chart(document.getElementById('chart-provider-split'), {
    type: 'pie',
    data: {
      labels: labels.map(l => l.charAt(0).toUpperCase() + l.slice(1)),
      datasets: [{ data: costs, backgroundColor: labels.map(l => providerColors[l] || '#8e8ea0'), borderWidth: 0 }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'right', labels: { color: '#8e8ea0', font: { family: 'Inter', size: 12 }, padding: 12 } } }
    }
  });
}

// ============================================
// PRICING TABLE
// ============================================

function renderPricingTable() {
  const tbody = document.getElementById('pricing-table-body');
  tbody.innerHTML = '';

  const models = pricingData.models || {};
  for (const [id, model] of Object.entries(models)) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><span style="color:${model.color}">●</span> ${model.displayName}</td>
      <td>${model.provider}</td>
      <td><span class="tier-badge tier-${model.tier}">${model.tier}</span></td>
      <td>$${model.inputCostPer1M.toFixed(2)}</td>
      <td>$${model.outputCostPer1M.toFixed(2)}</td>
      <td>${(model.contextWindow / 1000).toFixed(0)}K</td>
      <td>${(model.strengths || []).join(', ')}</td>
    `;
    tbody.appendChild(tr);
  }
}

// ============================================
// DETAIL TABLE
// ============================================

function renderDetailTable(filterModel, filterAgent) {
  const tbody = document.getElementById('detail-table-body');
  tbody.innerHTML = '';

  let data = [...usageData.tokenUsage].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  if (filterModel) data = data.filter(u => u.model_name === filterModel);
  if (filterAgent) data = data.filter(u => u.agent_name === filterAgent);

  for (const u of data) {
    const tr = document.createElement('tr');
    const time = new Date(u.timestamp).toLocaleString();
    tr.innerHTML = `
      <td>${time}</td>
      <td>${u.agent_name}</td>
      <td>${pricingData.models?.[u.model_name]?.displayName || u.model_name}</td>
      <td>${u.input_tokens.toLocaleString()}</td>
      <td>${u.output_tokens.toLocaleString()}</td>
      <td>${(u.cached_tokens || 0).toLocaleString()}</td>
      <td>$${u.cost_usd.toFixed(4)}</td>
      <td>${u.task_type || '-'}</td>
    `;
    tbody.appendChild(tr);
  }

  // Populate filter dropdowns
  const modelSelect = document.getElementById('filter-model');
  const agentSelect = document.getElementById('filter-agent');
  const models = [...new Set(usageData.tokenUsage.map(u => u.model_name))];
  const agents = [...new Set(usageData.tokenUsage.map(u => u.agent_name))];

  if (modelSelect.options.length <= 1) {
    models.forEach(m => {
      const opt = document.createElement('option');
      opt.value = m;
      opt.textContent = pricingData.models?.[m]?.displayName || m;
      modelSelect.appendChild(opt);
    });
  }
  if (agentSelect.options.length <= 1) {
    agents.forEach(a => {
      const opt = document.createElement('option');
      opt.value = a;
      opt.textContent = a;
      agentSelect.appendChild(opt);
    });
  }
}

// ============================================
// BUDGET MONITOR
// ============================================

function renderBudgetMonitor() {
  const totalCost = usageData.tokenUsage.reduce((s, u) => s + u.cost_usd, 0);
  const pct = Math.min((totalCost / budget) * 100, 100);

  const fill = document.getElementById('budget-fill');
  fill.style.width = pct + '%';
  fill.className = 'budget-fill' + (pct > 80 ? ' warning' : '');

  document.getElementById('budget-spent').textContent = `$${totalCost.toFixed(2)} spent`;
  document.getElementById('budget-limit').textContent = `$${budget.toFixed(2)} limit`;
  document.getElementById('budget-input').value = budget;
}

// ============================================
// COST CALCULATOR
// ============================================

function setupCalculator() {
  const modelSelect = document.getElementById('calc-model');
  modelSelect.innerHTML = '';

  for (const [id, model] of Object.entries(pricingData.models || {})) {
    const opt = document.createElement('option');
    opt.value = id;
    opt.textContent = `${model.displayName} (${model.provider})`;
    modelSelect.appendChild(opt);
  }

  const calculate = () => {
    const modelId = modelSelect.value;
    const model = pricingData.models?.[modelId];
    if (!model) return;

    const inputTokens = parseInt(document.getElementById('calc-input-tokens').value) || 0;
    const outputTokens = parseInt(document.getElementById('calc-output-tokens').value) || 0;

    const cost = (inputTokens / 1000000) * model.inputCostPer1M + (outputTokens / 1000000) * model.outputCostPer1M;
    document.getElementById('calc-cost').textContent = `$${cost.toFixed(4)}`;
  };

  modelSelect.addEventListener('change', calculate);
  document.getElementById('calc-input-tokens').addEventListener('input', calculate);
  document.getElementById('calc-output-tokens').addEventListener('input', calculate);
  calculate();
}

// ============================================
// EVENT LISTENERS
// ============================================

function setupEventListeners() {
  // Theme toggle
  document.getElementById('theme-toggle').addEventListener('click', () => {
    const html = document.documentElement;
    const current = html.getAttribute('data-theme');
    html.setAttribute('data-theme', current === 'dark' ? 'light' : 'dark');
    localStorage.setItem('oh-my-orq-theme', html.getAttribute('data-theme'));
  });

  // Restore theme
  const saved = localStorage.getItem('oh-my-orq-theme');
  if (saved) document.documentElement.setAttribute('data-theme', saved);

  // Refresh
  document.getElementById('btn-refresh').addEventListener('click', () => {
    location.reload();
  });

  // Export CSV
  document.getElementById('btn-export').addEventListener('click', exportCSV);

  // Budget
  document.getElementById('btn-set-budget').addEventListener('click', () => {
    budget = parseFloat(document.getElementById('budget-input').value) || 50;
    localStorage.setItem('oh-my-orq-budget', budget);
    renderBudgetMonitor();
  });

  // Filters
  document.getElementById('filter-model').addEventListener('change', (e) => {
    renderDetailTable(e.target.value, document.getElementById('filter-agent').value);
  });
  document.getElementById('filter-agent').addEventListener('change', (e) => {
    renderDetailTable(document.getElementById('filter-model').value, e.target.value);
  });
}

// ============================================
// EXPORT
// ============================================

function exportCSV() {
  const headers = ['Timestamp', 'Agent', 'Model', 'Provider', 'Input Tokens', 'Output Tokens', 'Cached', 'Cost USD', 'Task Type'];
  const rows = usageData.tokenUsage.map(u => [
    u.timestamp, u.agent_name, u.model_name, u.provider,
    u.input_tokens, u.output_tokens, u.cached_tokens || 0,
    u.cost_usd.toFixed(4), u.task_type || ''
  ]);

  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `oh-my-orq-usage-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ============================================
// UTILITIES
// ============================================

function groupBy(arr, key) {
  return arr.reduce((groups, item) => {
    const val = item[key];
    (groups[val] = groups[val] || []).push(item);
    return groups;
  }, {});
}

// ============================================
// START
// ============================================

document.addEventListener('DOMContentLoaded', init);
