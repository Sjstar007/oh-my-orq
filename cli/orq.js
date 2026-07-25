#!/usr/bin/env node

/**
 * Oh My Orq CLI — Main Entry Point
 * Usage: orq <command> [args]
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

const orqHome = path.join(os.homedir(), '.oh-my-orq');
const skillsDir = path.join(os.homedir(), '.gemini', 'antigravity', 'skills');
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case 'list':
    listAgents();
    break;

  case 'install':
    installAgent(args[1], args.includes('--project'));
    break;

  case 'remove':
    removeAgent(args[1]);
    break;

  case 'memory':
    handleMemory(args.slice(1));
    break;

  case 'learn':
    handleLearn(args.slice(1));
    break;

  case 'coach':
    handleCoach();
    break;

  case 'expand':
    handleExpand(args[1]);
    break;

  case 'theme':
    handleTheme(args[1]);
    break;

  case 'compact-restore':
    handleCompactRestore(args[1]);
    break;

  case 'notify':
    handleNotify(args.slice(1).join(' '));
    break;

  case 'graph':
    openGraph();
    break;

  case 'tokens':
    showTokens();
    break;

  case 'dashboard':
    openDashboard();
    break;

  case 'spawn':
    spawnAgent(args[1], args.slice(2).join(' '));
    break;

  case 'session':
    handleSession(args.slice(1));
    break;

  case 'update':
    console.log('⬆️  Run: npm update -g oh-my-orq');
    break;

  case 'version':
  case '--version':
  case '-v':
    const pkg = require(path.join(__dirname, '..', 'package.json'));
    console.log(`Oh My Orq v${pkg.version}`);
    break;

  default:
    showHelp();
}

// ============================================
// COMMANDS
// ============================================

function listAgents() {
  console.log('\n⚡ Oh My Orq — Agent Catalog\n');

  const sourceSkills = path.join(__dirname, '..', 'skills');
  const dir = fs.existsSync(skillsDir) ? skillsDir : sourceSkills;

  if (!fs.existsSync(dir)) {
    console.log('  No agents found. Run: npx oh-my-orq to install.');
    return;
  }

  const agents = fs.readdirSync(dir).filter(f => {
    return fs.statSync(path.join(dir, f)).isDirectory() &&
           fs.existsSync(path.join(dir, f, 'SKILL.md'));
  });

  const categories = {
    'Orchestration': ['apex-1', 'vector', 'aura'],
    'Architecture': ['atlas', 'nexus', 'lexicon'],
    'Development': ['forge', 'nova', 'prism', 'pulse'],
    'Testing': ['aegis', 'echo', 'cyber'],
    'Research': ['veritas', 'tracker', 'quill', 'intel'],
    'Data': ['spark', 'sigma', 'orion', 'flow', 'query'],
    'Tools, Messaging & MCP': ['viper', 'sync', 'link', 'hermes', 'matrix', 'automata', 'vision', 'hello-oh-my-orq']
  };

  for (const [cat, catAgents] of Object.entries(categories)) {
    const installed = catAgents.filter(a => agents.includes(a));
    if (installed.length > 0) {
      console.log(`  ${cat}:`);
      for (const a of installed) {
        try {
          const content = fs.readFileSync(path.join(dir, a, 'SKILL.md'), 'utf-8');
          const descMatch = content.match(/description:\s*(.+)/);
          const desc = descMatch ? descMatch[1].trim().slice(0, 60) : '';
          console.log(`    ✅ ${a.padEnd(22)} ${desc}`);
        } catch (e) {
          console.log(`    ✅ ${a}`);
        }
      }
      console.log('');
    }
  }

  console.log(`  Total: ${agents.length} agents installed\n`);
}

function installAgent(name, projectScope) {
  if (!name) {
    console.error('Usage: orq install <agent-name|all|apex-1> [--project]');
    process.exit(1);
  }

  const allSkillsDir = path.join(__dirname, '..', 'skills');

  if (name === 'all') {
    const skills = fs.readdirSync(allSkillsDir).filter(f => fs.statSync(path.join(allSkillsDir, f)).isDirectory());
    let count = 0;
    for (const skill of skills) {
      const src = path.join(allSkillsDir, skill);
      const dest = projectScope
        ? path.join(process.cwd(), '.agents', 'skills', skill)
        : path.join(skillsDir, skill);
      copyDirSync(src, dest);
      count++;
    }
    console.log(`✅ Installed all ${count} agents to ${projectScope ? './.agents/skills' : skillsDir}`);
    return;
  }

  const sourceDir = path.join(allSkillsDir, name);
  if (!fs.existsSync(sourceDir)) {
    console.error(`Agent "${name}" not found in available skills.`);
    console.error(`Available agents: all, apex-1, vector, aura, atlas, forge, nova, aegis, etc.`);
    process.exit(1);
  }

  const destDir = projectScope
    ? path.join(process.cwd(), '.agents', 'skills', name)
    : path.join(skillsDir, name);

  copyDirSync(sourceDir, destDir);
  console.log(`✅ Installed agent "${name}" to ${destDir}`);
}

function removeAgent(name) {
  if (!name) {
    console.error('Usage: orq remove <agent-name>');
    process.exit(1);
  }
  const agentDir = path.join(skillsDir, name);
  if (fs.existsSync(agentDir)) {
    fs.rmSync(agentDir, { recursive: true });
    console.log(`🗑️  Removed "${name}"`);
  } else {
    console.error(`Agent "${name}" not found.`);
  }
}

function handleMemory(args) {
  const cortexPath = path.join(__dirname, '..', 'memory', 'cortex.js');
  try {
    execSync(`node "${cortexPath}" ${args.join(' ')}`, { stdio: 'inherit', cwd: process.cwd() });
  } catch (e) { /* ignore */ }
}

function handleLearn(args) {
  const learningHookPath = path.join(__dirname, '..', 'hooks', 'LearningHook.js');
  try {
    execSync(`node "${learningHookPath}"`, { stdio: 'inherit', cwd: process.cwd() });
  } catch (e) { /* ignore */ }
}

function handleCoach() {
  const coachPath = path.join(__dirname, '..', 'token-optimization', 'coach.js');
  try {
    execSync(`node "${coachPath}"`, { stdio: 'inherit', cwd: process.cwd() });
  } catch (e) { /* ignore */ }
}

function handleExpand(archiveId) {
  const ArchiveStore = require('../token-optimization/archive-store');
  const store = new ArchiveStore();

  if (!archiveId) {
    console.log('📦 Archived Output List:\n');
    const archives = store.list();
    if (archives.length === 0) console.log('  No archived outputs found.');
    archives.forEach(a => console.log(`  ID: ${a.id} | Size: ${a.sizeKB} KB | Created: ${a.createdAt}`));
    return;
  }

  const content = store.retrieve(archiveId);
  if (content) {
    console.log(`\n📦 [RETRIEVED ARCHIVE #${archiveId}]\n\n${content}\n`);
  } else {
    console.error(`Archive #${archiveId} not found.`);
  }
}

function handleTheme(themeName) {
  const { ThemeEngine } = require('../themes/theme-engine');
  const engine = new ThemeEngine();

  if (!themeName) {
    console.log('🎨 Visual Themes:\n');
    engine.listThemes().forEach(t => console.log(`  ${t.active ? '👉' : '  '} ${t.key.padEnd(15)} ${t.name}`));
    return;
  }

  try {
    engine.setTheme(themeName);
  } catch (e) {
    console.error(e.message);
  }
}

function handleNotify(msg) {
  const HermesMessenger = require('../hermes/messenger');
  const messenger = new HermesMessenger();
  messenger.notify({ channel: 'system', title: 'Oh My Orq Notification', message: msg || 'Task completed' });
}

function handleCompactRestore(sessionId) {
  const CompactionEngine = require('../memory/compaction');
  const engine = new CompactionEngine();
  const digest = engine.generateIntelDigest(sessionId);
  console.log(digest);
}

function showTokens() {
  handleMemory(['tokens']);
}

function openGraph() {
  const graphPath = path.join(__dirname, '..', 'dashboard', 'architecture-graph.html');
  const opener = os.platform() === 'darwin' ? 'open' : os.platform() === 'win32' ? 'start' : 'xdg-open';
  try {
    execSync(`${opener} "${graphPath}"`);
    console.log('🌐 Interactive Architecture Graph opened in browser');
  } catch (e) {
    console.log(`📂 Open this file in your browser: ${graphPath}`);
  }
}

function openDashboard() {
  const dashboardPath = path.join(__dirname, '..', 'dashboard', 'index.html');
  handleMemory(['export', path.join(__dirname, '..', 'dashboard', 'data', 'usage-data.json')]);

  const opener = os.platform() === 'darwin' ? 'open' : os.platform() === 'win32' ? 'start' : 'xdg-open';
  try {
    execSync(`${opener} "${dashboardPath}"`);
    console.log('🌐 Dashboard opened in browser');
  } catch (e) {
    console.log(`📂 Open this file in your browser: ${dashboardPath}`);
  }
}

function spawnAgent(agent, task) {
  if (!agent || !task) {
    console.error('Usage: orq spawn <agent> "<task>"');
    process.exit(1);
  }
  console.log(`[Oh My Orq] Spawning SubAgent: ${agent}`);
  console.log(`  Task: ${task}`);
}

function handleSession(args) {
  const subcmd = args[0];
  switch (subcmd) {
    case 'list':
      handleMemory(['sessions']);
      break;
    default:
      console.log('Usage: orq session list');
  }
}

function showHelp() {
  console.log(`
⚡ Oh My Orq CLI — Multi-Agent Framework

Usage: orq <command> [options]

Core Commands:
  list                         List all 30 installed agents
  install <agent> [--project]  Install an agent
  remove <agent>               Remove an agent
  spawn <agent> "<task>"       Spawn a SubAgent
  session list                 List sessions

Messaging & Notifications:
  notify "<message>"           Send desktop / system notification via Hermes

Learning & Optimization:
  learn                        Scan codebase & extract continuous learning patterns
  coach                        Run Token Coach audit & context quality health check
  expand [id]                  Retrieve or list archived progressive disclosure outputs
  compact-restore [session]    Generate post-compaction Context Intel Digest
  theme [name]                 Switch or list CLI/dashboard visual themes

Memory & Dashboard:
  memory save "<info>"         Save a project memory
  memory recall "<query>"      Search memories
  memory list                  List recent memories
  memory clear                 Clear project memories
  tokens                       Show token usage summary
  dashboard                    Open web dashboard
  version                      Show version

Examples:
  orq list
  orq notify "Build succeeded"
  orq learn
  orq coach
  orq theme cyberpunk
  orq dashboard
  `);
}

function copyDirSync(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src)) {
    const s = path.join(src, entry);
    const d = path.join(dest, entry);
    fs.statSync(s).isDirectory() ? copyDirSync(s, d) : fs.copyFileSync(s, d);
  }
}
