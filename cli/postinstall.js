#!/usr/bin/env node

/**
 * Oh My Orq Post-Install Setup Script
 * Strictly enforces global installation: npm i -g oh-my-orq
 */

const path = require('path');

const isGlobal = process.env.npm_config_global === 'true' || 
                 process.argv.includes('-g') || 
                 process.argv.includes('--global');

if (!isGlobal && process.env.NODE_ENV !== 'test') {
  console.error('\n❌ ERROR: Local installation of oh-my-orq without -g is disabled.');
  console.error('👉 Please install oh-my-orq globally using:\n');
  console.error('   npm i -g oh-my-orq\n');
  process.exit(1);
}

try {
  const installer = path.join(__dirname, 'install.js');
  require(installer);
} catch (e) {
  console.error('Installation failed:', e.message);
  process.exit(1);
}
