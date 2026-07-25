#!/usr/bin/env node

/**
 * Oh My Orq CLI Installer
 * Run with: npx oh-my-orq
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

console.log(`
   ___                    _   _____                    
  / _ \\                  | | |  ___|                   
 / /_\\ \\ __ _  ___ _ __ | |_| |_ ___  _ __ __ _  ___ 
 |  _  |/ _\` |/ _ \\ '_ \\| __|  _/ _ \\| '__/ _\` |/ _ \\
 | | | | (_| |  __/ | | | |_| || (_) | | | (_| |  __/
 \\_| |_/\\__, |\\___|_| |_|\\__|_| \\___/|_|  \\__, |\\___|
         __/ |                              __/ |     
        |___/                              |___/      

  ⚡ Multi-Agent Orchestration Framework
`);

console.log('Installing Oh My Orq...\n');

const homeDir = os.homedir();
const orqHome = path.join(homeDir, '.oh-my-orq');
const antigravityHome = path.join(homeDir, '.gemini', 'antigravity');
const sourceDir = path.resolve(__dirname, '..');

// Directories to create
const dirs = [
  orqHome,
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

// Copy skills
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
}

// Copy workflows
const workflowsSource = path.join(sourceDir, 'workflows');
const workflowsDest = path.join(antigravityHome, 'workflows');

if (fs.existsSync(workflowsSource)) {
  const workflows = fs.readdirSync(workflowsSource).filter(f => f.endsWith('.md'));
  for (const wf of workflows) {
    fs.copyFileSync(path.join(workflowsSource, wf), path.join(workflowsDest, wf));
  }
  console.log(`  ✓ Installed ${workflows.length} workflows to ${workflowsDest}`);
}

// Save installation info
const installInfo = {
  version: require(path.join(sourceDir, 'package.json')).version || '1.0.0',
  installedAt: new Date().toISOString(),
  homeDir: orqHome,
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
console.log(`  Dashboard: Open dashboard/index.html in your browser`);
console.log(`\n  Usage:`);
console.log(`    orq list              List all agents`);
console.log(`    orq memory save "..."  Save a memory`);
console.log(`    orq memory recall "..."  Search memories`);
console.log(`    orq tokens             Show token usage`);
console.log(`    orq dashboard          Open dashboard\n`);

// ============================================
// UTILITIES
// ============================================

function copyDirSync(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src);
  for (const entry of entries) {
    const srcPath = path.join(src, entry);
    const destPath = path.join(dest, entry);
    if (fs.statSync(srcPath).isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}
