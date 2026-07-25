#!/usr/bin/env node

/**
 * Oh My Orq CLI Installer
 * Run with: npx oh-my-orq
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

console.log(`
  ___  _   _  ___  ___   _   _  ___  ___  _____ 
 / _ \\| | | ||  \\/  |  | | | / _ \\| ___ \\|  _  |
/ /_\\ \\ |_| || .  . |  | |_| / /_\\ \\ |_/ /| | | |
|  _  |  _  || |\\/| |  |  _  |  _  |    / | | | |
| | | | | | || |  | |  | | | | | | | |\\ \\ \\ \\/' /
\\_| |_/\\_| |_/\\_|  |_/  \\_| |_/\\_| |_/\\_| \\_|\\_/ 

  ⚡ Multi-Agent Orchestration Framework
`);

console.log('Installing Oh My Orq...\n');

const homeDir = os.homedir();
const orqHome = path.join(homeDir, '.oh-my-orq');
const orqAppDir = path.join(orqHome, 'app');
const orqBinDir = path.join(orqHome, 'bin');
const antigravityHome = path.join(homeDir, '.gemini', 'antigravity');
const sourceDir = path.resolve(__dirname, '..');

// Directories to create
const dirs = [
  orqHome,
  orqAppDir,
  orqBinDir,
  path.join(orqHome, 'memory'),
  path.join(orqHome, 'cache'),
  path.join(orqHome, 'sessions'),
  path.join(antigravityHome, 'skills'),
  path.join(antigravityHome, 'workflows'),
];

// Create directories
dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`  ✓ Created ${dir}`);
  }
});

// Copy full app framework to ~/.oh-my-orq/app
copyDirSync(sourceDir, orqAppDir);

const isProjectInstall = process.argv.includes('--project');
const skillsSource = path.join(sourceDir, 'skills');
const skillsDest = path.join(antigravityHome, 'skills');

if (fs.existsSync(skillsSource)) {
  const skills = fs.readdirSync(skillsSource);
  let installed = 0;
  for (const skill of skills) {
    const src = path.join(skillsSource, skill);
    const dest = path.join(skillsDest, skill);
    if (fs.statSync(src).isDirectory()) {
      copyDirSync(src, dest);
      installed++;
    }
  }
  console.log(`  ✓ Installed ${installed} agent skills to ${skillsDest}`);

  if (isProjectInstall) {
    const projectSkillsDest = path.join(process.cwd(), '.agents', 'skills');
    fs.mkdirSync(projectSkillsDest, { recursive: true });
    for (const skill of skills) {
      const src = path.join(skillsSource, skill);
      const dest = path.join(projectSkillsDest, skill);
      if (fs.statSync(src).isDirectory()) {
        copyDirSync(src, dest);
      }
    }
    console.log(`  ✓ Installed ${installed} agent skills into project workspace (.agents/skills)`);
  }
}

// Copy workflows to Antigravity IDE directory
const workflowsSource = path.join(sourceDir, 'workflows');
const workflowsDest = path.join(antigravityHome, 'workflows');

if (fs.existsSync(workflowsSource)) {
  const workflows = fs.readdirSync(workflowsSource).filter(f => f.endsWith('.md'));
  for (const wf of workflows) {
    fs.copyFileSync(path.join(workflowsSource, wf), path.join(workflowsDest, wf));
  }
  console.log(`  ✓ Installed ${workflows.length} workflows to ${workflowsDest}`);
}

// Create binary script in ~/.oh-my-orq/bin/orq
const orqBinFile = path.join(orqBinDir, 'orq');
const binScriptContent = `#!/bin/sh\nexec node "${path.join(orqAppDir, 'cli', 'orq.js')}" "$@"\n`;
fs.writeFileSync(orqBinFile, binScriptContent, { mode: 0o755 });

// Also write executable permissions
try {
  fs.chmodSync(path.join(orqAppDir, 'cli', 'orq.js'), 0o755);
} catch (e) {}

// Auto-add alias & PATH to ~/.zshrc and ~/.bashrc
const shellConfigs = ['.zshrc', '.bashrc'].map(file => path.join(homeDir, file));
const exportSnippet = `\n# oh-my-orq CLI\nexport PATH="$HOME/.oh-my-orq/bin:$PATH"\nalias orq="node $HOME/.oh-my-orq/app/cli/orq.js"\n`;

for (const shConfig of shellConfigs) {
  if (fs.existsSync(shConfig)) {
    try {
      const content = fs.readFileSync(shConfig, 'utf-8');
      if (!content.includes('.oh-my-orq/bin') && !content.includes('alias orq=')) {
        fs.appendFileSync(shConfig, exportSnippet);
        console.log(`  ✓ Added 'orq' alias & PATH to ${shConfig}`);
      }
    } catch (e) {}
  }
}

// Try system global bin targets
['/usr/local/bin/orq', path.join(homeDir, '.local', 'bin', 'orq')].forEach(binPath => {
  try {
    if (!fs.existsSync(path.dirname(binPath))) {
      fs.mkdirSync(path.dirname(binPath), { recursive: true });
    }
    fs.writeFileSync(binPath, binScriptContent, { mode: 0o755 });
  } catch (e) {}
});

// Save installation info
const installInfo = {
  version: require(path.join(sourceDir, 'package.json')).version || '1.0.2',
  installedAt: new Date().toISOString(),
  homeDir: orqHome,
  appDir: orqAppDir,
  binDir: orqBinDir,
  skillsDir: skillsDest,
  workflowsDir: workflowsDest,
  platform: os.platform(),
  arch: os.arch()
};

fs.writeFileSync(
  path.join(orqHome, 'install.json'),
  JSON.stringify(installInfo, null, 2)
);

console.log(`\n🎉 Oh My Orq installed successfully!\n`);
console.log(`  Skills:    ${skillsDest}`);
console.log(`  Workflows: ${workflowsDest}`);
console.log(`  Memory:    ${path.join(orqHome, 'memory')}`);
console.log(`  App Home:  ${orqAppDir}\n`);

console.log(`💡 To use 'orq' in current terminal window, run:`);
console.log(`   source ~/.zshrc    (or open a new terminal tab)\n`);
console.log(`  Or install globally with NPM:`);
console.log(`   npm install -g oh-my-orq\n`);
console.log(`  Usage:`);
console.log(`    orq list              List all agents`);
console.log(`    orq graph             Open interactive architecture graph`);
console.log(`    orq memory save "..."  Save a memory`);
console.log(`    orq memory recall "..." Search memories`);
console.log(`    orq coach             Run quality health check`);
console.log(`    orq dashboard          Open usage dashboard\n`);

// ============================================
// UTILITIES
// ============================================
function copyDirSync(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src);
  for (const entry of entries) {
    if (entry === 'node_modules' || entry === '.git') continue;
    const srcPath = path.join(src, entry);
    const destPath = path.join(dest, entry);
    if (fs.statSync(srcPath).isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}
