#!/usr/bin/env node

/**
 * Oh My Orq Post-Install Setup Script
 * Runs automatically when installed via npm install -g oh-my-orq or npx
 */

const path = require('path');
const { execSync } = require('child_process');

try {
  const installer = path.join(__dirname, 'install.js');
  require(installer);
} catch (e) {
  // Silent catch on postinstall failure
}
