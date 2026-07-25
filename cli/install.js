#!/usr/bin/env node

/**
 * Oh My Orq CLI Installer
 * Run with: npx oh-my-orq
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const readline = require('readline');

console.log(`
  ___  _   _  ___  ___   _   _  ___  ___  _____ 
 / _ \\| | | ||  \\/  |  | | | / _ \\| ___ \\|  _  |
/ /_\\ \\ |_| || .  . |  | |_| / /_\\ \\ |_/ /| | | |
|  _  |  _  || |\\/| |  |  _  |  _  |    / | | | |
| | | | | | || |  | |  | | | | | | | |\\ \\ \\ \\/' /
\\_| |_/\\_| |_/\\_|  |_/  \\_| |_/\\_| |_/\\_| \\_|\\_/ 

  ⚡ Multi-Agent Orchestration Framework
`);

// Enforce global installation check
const isGlobalInstall = process.env.npm_config_global === 'true' || process.argv.includes('--global') || process.argv.includes('-g') || process.argv.includes('--project');
if (process.env.npm_lifecycle_event === 'postinstall' && !isGlobalInstall) {
  console.error(`\n❌ ERROR: Local installation of oh-my-orq without -g is disabled.`);
  console.error(`👉 Please install oh-my-orq globally:\n`);
  console.error(`   npm i -g oh-my-orq\n`);
  process.exit(1);
}

const homeDir = os.homedir();
const orqHome = path.join(homeDir, '.oh-my-orq');
const orqAppDir = path.join(orqHome, 'app');
const orqBinDir = path.join(orqHome, 'bin');
const antigravityHome = path.join(homeDir, '.gemini', 'antigravity');
const sourceDir = path.resolve(__dirname, '..');

const isProjectInstall = process.argv.includes('--project');
const skillsSource = path.join(sourceDir, 'skills');
const skillsDest = path.join(antigravityHome, 'skills');

async function promptProjectInstall() {
  if (isProjectInstall) return true;
  if (process.stdout.isTTY && !process.argv.includes('-y') && !process.argv.includes('--yes')) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    return new Promise(resolve => {
      rl.question('❓ Do you want to install all 30 agents into your current project workspace (.agents/skills)? (y/N): ', answer => {
        rl.close();
        const ans = answer.trim().toLowerCase();
        resolve(ans === 'y' || ans === 'yes');
      });
    });
  }
  return false;
}

async function main() {
  console.log('Installing Oh My Orq across IDEs (Antigravity, Cursor, VS Code, Claude Code)...\n');

  // IDE Target Directories
  const ideSkillTargets = [
    path.join(homeDir, '.gemini', 'antigravity', 'skills'),
    path.join(homeDir, '.cursor', 'skills'),
    path.join(homeDir, '.claude', 'skills'),
    path.join(homeDir, '.agents', 'skills'),
  ];

  const ideWorkflowTargets = [
    path.join(homeDir, '.gemini', 'antigravity', 'workflows'),
    path.join(homeDir, '.cursor', 'workflows'),
    path.join(homeDir, '.claude', 'workflows'),
    path.join(homeDir, '.agents', 'workflows'),
  ];

  // Directories to create
  const dirs = [
    orqHome,
    orqAppDir,
    orqBinDir,
    path.join(orqHome, 'memory'),
    path.join(orqHome, 'cache'),
    path.join(orqHome, 'sessions'),
    ...ideSkillTargets,
    ...ideWorkflowTargets,
  ];

  // Create directories
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  // Copy full app framework to ~/.oh-my-orq/app
  copyDirSync(sourceDir, orqAppDir);

  // Check interactive project prompt
  const shouldInstallProject = await promptProjectInstall();

  // Install skills across all IDE target locations
  if (fs.existsSync(skillsSource)) {
    const skills = fs.readdirSync(skillsSource);
    let installedCount = 0;
    for (const skill of skills) {
      const src = path.join(skillsSource, skill);
      if (fs.statSync(src).isDirectory()) {
        for (const targetDir of ideSkillTargets) {
          copyDirSync(src, path.join(targetDir, skill));
        }
        installedCount++;
      }
    }
    console.log(`  ✓ Installed ${installedCount} agent skills to Antigravity, Cursor, VS Code & Claude Code`);

    if (shouldInstallProject) {
      const projectTargets = [
        path.join(process.cwd(), '.agents', 'skills'),
        path.join(process.cwd(), '.cursor', 'skills'),
        path.join(process.cwd(), '.claude', 'skills'),
      ];
      for (const pTarget of projectTargets) {
        fs.mkdirSync(pTarget, { recursive: true });
        for (const skill of skills) {
          const src = path.join(skillsSource, skill);
          if (fs.statSync(src).isDirectory()) {
            copyDirSync(src, path.join(pTarget, skill));
          }
        }
      }

      // Copy project-scoped workflows
      const projectWfTargets = [
        path.join(process.cwd(), '.agents', 'workflows'),
        path.join(process.cwd(), '.cursor', 'workflows'),
        path.join(process.cwd(), '.claude', 'workflows'),
      ];
      const workflowsSource = path.join(sourceDir, 'workflows');
      if (fs.existsSync(workflowsSource)) {
        const workflows = fs.readdirSync(workflowsSource).filter(f => f.endsWith('.md'));
        for (const pTarget of projectWfTargets) {
          fs.mkdirSync(pTarget, { recursive: true });
          for (const wf of workflows) {
            fs.copyFileSync(path.join(workflowsSource, wf), path.join(pTarget, wf));
          }
        }
      }

      // Copy framework sub-systems (memory, token-optimization, delegation, subagents, dashboard)
      const subsystems = ['memory', 'token-optimization', 'delegation', 'subagents', 'dashboard'];
      const projectOrqHome = path.join(process.cwd(), '.oh-my-orq');
      for (const sys of subsystems) {
        const srcSys = path.join(sourceDir, sys);
        if (fs.existsSync(srcSys)) {
          const destSys = sys === 'dashboard' ? path.join(process.cwd(), 'dashboard') : path.join(projectOrqHome, sys);
          copyDirSync(srcSys, destSys);
        }
      }

      console.log(`  ✓ Installed ALL agent skills, workflows, memory, harness & dashboard into project workspace!`);
    }
  }

  // Copy workflows across all IDE target locations
  const workflowsSource = path.join(sourceDir, 'workflows');
  if (fs.existsSync(workflowsSource)) {
    const workflows = fs.readdirSync(workflowsSource).filter(f => f.endsWith('.md'));
    for (const wf of workflows) {
      for (const targetDir of ideWorkflowTargets) {
        fs.copyFileSync(path.join(workflowsSource, wf), path.join(targetDir, wf));
      }
    }
    console.log(`  ✓ Installed ${workflows.length} slash command workflows across IDE target locations`);
  }

  // Create binary script in ~/.oh-my-orq/bin/orq
  const orqBinFile = path.join(orqBinDir, 'orq');
  const binScriptContent = `#!/bin/sh\nexec node "${path.join(orqAppDir, 'cli', 'orq.js')}" "$@"\n`;
  fs.writeFileSync(orqBinFile, binScriptContent, { mode: 0o755 });

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

  // System global bin targets
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
    version: require(path.join(sourceDir, 'package.json')).version || '1.0.7',
    installedAt: new Date().toISOString(),
    homeDir: orqHome,
    appDir: orqAppDir,
    binDir: orqBinDir,
    skillsDirs: ideSkillTargets,
    workflowsDirs: ideWorkflowTargets,
    platform: os.platform(),
    arch: os.arch()
  };

  fs.writeFileSync(
    path.join(orqHome, 'install.json'),
    JSON.stringify(installInfo, null, 2)
  );

  console.log(`\n🎉 Oh My Orq installed successfully across all IDEs!\n`);
  console.log(`  IDEs Supported: Antigravity, Cursor, VS Code & Claude Code`);
  console.log(`  Memory:         ${path.join(orqHome, 'memory')}`);
  console.log(`  App Home:       ${orqAppDir}\n`);

  console.log(`💡 Usage Commands:`);
  console.log(`  npm i -g oh-my-orq           Global installation`);
  console.log(`  orq install all              Install all 30 agents`);
  console.log(`  orq install all --project    Install all 30 agents into current project`);
  console.log(`  orq install apex-1           Install Master Orchestrator agent`);
  console.log(`  orq list                     List all installed agents`);
  console.log(`  orq graph                    Open interactive architecture graph\n`);
}

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

main().catch(console.error);
