/**
 * Oh My Orq Theme Engine
 *
 * Manages CLI console themes and dashboard color palettes.
 * Presets: default-dark, cyberpunk, dracula, nord, solarized.
 */

const fs = require('fs');
const path = require('path');

const THEMES = {
  'default-dark': {
    name: 'Default Dark',
    primary: '#7c5cfc',
    secondary: '#4ecdc4',
    background: '#0a0a0f',
    cardBg: 'rgba(255, 255, 255, 0.04)',
    text: '#f0f0f5',
    accentGradient: 'linear-gradient(135deg, #7c5cfc, #4ecdc4)'
  },
  'cyberpunk': {
    name: 'Cyberpunk 2077',
    primary: '#ff0055',
    secondary: '#00ffff',
    background: '#0d0221',
    cardBg: 'rgba(255, 0, 85, 0.08)',
    text: '#fbee00',
    accentGradient: 'linear-gradient(135deg, #ff0055, #00ffff)'
  },
  'dracula': {
    name: 'Dracula',
    primary: '#bd93f9',
    secondary: '#50fa7b',
    background: '#282a36',
    cardBg: 'rgba(68, 71, 90, 0.4)',
    text: '#f8f8f2',
    accentGradient: 'linear-gradient(135deg, #bd93f9, #ff79c6)'
  },
  'nord': {
    name: 'Nord Studio',
    primary: '#88c0d0',
    secondary: '#a3be8c',
    background: '#2e3440',
    cardBg: 'rgba(67, 76, 94, 0.5)',
    text: '#eceff4',
    accentGradient: 'linear-gradient(135deg, #88c0d0, #81a1c1)'
  }
};

class ThemeEngine {
  constructor() {
    this.themeFile = path.join(process.cwd(), '.oh-my-orq', 'theme.json');
    this.activeTheme = this._loadTheme();
  }

  _loadTheme() {
    try {
      if (fs.existsSync(this.themeFile)) {
        const saved = JSON.parse(fs.readFileSync(this.themeFile, 'utf-8'));
        return saved.theme || 'default-dark';
      }
    } catch (e) { /* ignore */ }
    return 'default-dark';
  }

  setTheme(themeName) {
    if (!THEMES[themeName]) {
      throw new Error(`Unknown theme: ${themeName}. Available: ${Object.keys(THEMES).join(', ')}`);
    }
    this.activeTheme = themeName;
    const dir = path.dirname(this.themeFile);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(this.themeFile, JSON.stringify({ theme: themeName }, null, 2));
    console.log(`🎨 [ThemeEngine] Switched theme to: ${THEMES[themeName].name}`);
    return THEMES[themeName];
  }

  getActiveTheme() {
    return THEMES[this.activeTheme] || THEMES['default-dark'];
  }

  listThemes() {
    return Object.keys(THEMES).map(key => ({
      key,
      name: THEMES[key].name,
      active: key === this.activeTheme
    }));
  }
}

module.exports = { ThemeEngine, THEMES };

if (require.main === module) {
  const engine = new ThemeEngine();
  console.log('Available Themes:', engine.listThemes());
}
