/**
 * Oh My Orq LearningHook — Continuous Learning Enforcer
 *
 * Scans the project repository to extract coding patterns and updates Project Cortex memory.
 * Can be triggered via `/learn` workflow or automatically on project startup.
 */

const LearningEngine = require('../memory/learning');

function runLearningHook(projectPath = process.cwd()) {
  console.log(`🪝 [Hook: LearningHook] Running continuous learning scan on ${projectPath}...`);
  const engine = new LearningEngine();

  const style = engine.analyzeCodebase(projectPath);
  const prompt = engine.getLearningContextPrompt();

  return {
    status: 'success',
    style,
    learnedPrompt: prompt
  };
}

module.exports = { runLearningHook };

if (require.main === module) {
  runLearningHook();
}
