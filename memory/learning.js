/**
 * Oh My Orq Continuous Learning & Pattern Capture Engine
 *
 * Automatically inspects codebase and agent execution outputs to detect:
 * - Naming conventions (camelCase, snake_case, PascalCase)
 * - Import styles & patterns (ES6 modules, CommonJS, path aliases)
 * - Architecture patterns (Repository pattern, MVC, Custom Hooks)
 * - Error handling conventions (Result types, try-catch wrappers, custom Error classes)
 * - Testing styles (AAA pattern, Jest/pytest fixtures)
 * - Past bug patterns & lessons learned
 *
 * Automatically saves patterns to Project Cortex shared memory and `.oh-my-orq/patterns.json`.
 */

const fs = require('fs');
const path = require('path');
const { MemoryStore, DB_PATH } = require('./cortex');

const PATTERNS_FILE = path.join(process.cwd(), '.oh-my-orq', 'patterns.json');

class LearningEngine {
  constructor() {
    this.cortex = new MemoryStore(DB_PATH);
    this.patterns = this._loadPatterns();
  }

  _loadPatterns() {
    try {
      if (fs.existsSync(PATTERNS_FILE)) {
        return JSON.parse(fs.readFileSync(PATTERNS_FILE, 'utf-8'));
      }
    } catch (e) { /* ignore */ }
    return {
      namingConventions: {},
      codeStyle: {},
      architecturePatterns: [],
      errorHandlingStyle: '',
      learnedLessons: [],
      lastAnalyzed: null
    };
  }

  _savePatterns() {
    const dir = path.dirname(PATTERNS_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(PATTERNS_FILE, JSON.stringify(this.patterns, null, 2));
  }

  /**
   * Analyze codebase to extract coding patterns automatically
   */
  analyzeCodebase(targetDir = process.cwd()) {
    console.log(`🧠 [LearningEngine] Analyzing codebase at ${targetDir}...`);
    const files = this._getFiles(targetDir, 50);

    let es6Imports = 0, commonJS = 0;
    let camelCaseVars = 0, snakeCaseVars = 0;
    let asyncAwait = 0, promises = 0;
    let customErrors = 0;

    for (const file of files) {
      if (!file.endsWith('.js') && !file.endsWith('.ts') && !file.endsWith('.py')) continue;
      try {
        const content = fs.readFileSync(file, 'utf-8');

        // Check imports
        if (/import\s+.*\s+from\s+['"]/.test(content)) es6Imports++;
        if (/require\s*\(['"]/.test(content)) commonJS++;

        // Check variable naming
        if (/[a-z]+[A-Z][a-zA-Z0-9]*\s*=/.test(content)) camelCaseVars++;
        if (/[a-z]+_[a-z0-9_]+\s*=/.test(content)) snakeCaseVars++;

        // Check async handling
        if (/async\s+function|async\s*\(/.test(content)) asyncAwait++;
        if (/\.then\s*\(/.test(content)) promises++;

        // Check error handling
        if (/class\s+\w+Error\s+extends/.test(content) || /throw new/.test(content)) customErrors++;
      } catch (e) { /* ignore */ }
    }

    const detected = {
      importStyle: es6Imports >= commonJS ? 'ES6 Modules (import/export)' : 'CommonJS (require/module.exports)',
      namingStyle: camelCaseVars >= snakeCaseVars ? 'camelCase' : 'snake_case',
      asyncStyle: asyncAwait >= promises ? 'async/await' : 'Promises (.then)',
      errorStyle: customErrors > 0 ? 'Custom Error Classes / Explicit Throws' : 'Standard Errors'
    };

    this.patterns.codeStyle = detected;
    this.patterns.lastAnalyzed = new Date().toISOString();
    this._savePatterns();

    // Persist to Cortex memory
    const memoryText = `Codebase Patterns Detected: Import style: ${detected.importStyle}, Naming: ${detected.namingStyle}, Async: ${detected.asyncStyle}, Errors: ${detected.errorStyle}`;
    this.cortex.saveMemory(memoryText, { type: 'convention', tags: ['code-style', 'patterns', 'auto-learned'] });

    console.log(`  ✓ Detected: ${detected.importStyle}, ${detected.namingStyle}, ${detected.asyncStyle}`);
    return detected;
  }

  /**
   * Capture a lesson learned after a task run or error fix
   */
  captureLearning(taskDescription, solution, agentName = 'system') {
    const lesson = {
      id: Date.now().toString(36),
      task: taskDescription,
      solution: solution,
      agent: agentName,
      timestamp: new Date().toISOString()
    };

    this.patterns.learnedLessons.push(lesson);
    this._savePatterns();

    // Save to Project Cortex memory
    this.cortex.saveMemory(
      `Learned Lesson [${taskDescription}]: ${solution}`,
      { type: 'lesson', tags: ['learning', agentName], source_agent: agentName }
    );

    console.log(`💡 [LearningEngine] Captured learning from ${agentName}: "${taskDescription.slice(0, 50)}..."`);
    return lesson;
  }

  /**
   * Get context prompt containing all learned project patterns and lessons
   */
  getLearningContextPrompt() {
    const style = this.patterns.codeStyle || {};
    const lessons = (this.patterns.learnedLessons || []).slice(-5);

    let prompt = `\n--- 🧠 PROJECT LEARNINGS & CODING CONVENTIONS ---\n`;
    if (style.importStyle) prompt += `- Import Style: ${style.importStyle}\n`;
    if (style.namingStyle) prompt += `- Naming Convention: ${style.namingStyle}\n`;
    if (style.asyncStyle) prompt += `- Async Pattern: ${style.asyncStyle}\n`;
    if (style.errorStyle) prompt += `- Error Pattern: ${style.errorStyle}\n`;

    if (lessons.length > 0) {
      prompt += `\nRecent Learned Lessons:\n`;
      lessons.forEach((l, i) => {
        prompt += `  ${i + 1}. [${l.agent}] Task: ${l.task} -> Solution: ${l.solution}\n`;
      });
    }
    prompt += `--- END LEARNINGS ---\n`;

    return prompt;
  }

  _getFiles(dir, limit = 50, fileList = []) {
    if (fileList.length >= limit) return fileList;
    try {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        if (file.startsWith('.') || file === 'node_modules' || file === 'dist' || file === 'build') continue;
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
          this._getFiles(filePath, limit, fileList);
        } else {
          fileList.push(filePath);
        }
      }
    } catch (e) { /* ignore */ }
    return fileList;
  }
}

module.exports = LearningEngine;

if (require.main === module) {
  const engine = new LearningEngine();
  engine.analyzeCodebase();
  engine.captureLearning('Fix uncaught promise rejection in API', 'Wrap async handlers in try-catch block and return 500 status', 'codesmith');
  console.log(engine.getLearningContextPrompt());
}
