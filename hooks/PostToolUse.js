/**
 * Oh My Orq PostToolUse Hook
 *
 * Runs AFTER an agent executes a tool/task.
 * Functions:
 * 1. Records token usage and costs to Project Cortex DB
 * 2. Extracts new coding patterns or bug fixes from result
 * 3. Auto-captures learnings for future agent executions
 */

const LearningEngine = require('../memory/learning');
const { MemoryStore, DB_PATH } = require('../memory/cortex');

function onPostToolUse(resultContext) {
  const { sessionId, agentName, modelName, provider, inputTokens, outputTokens, cost, taskType, taskDescription, outputResult } = resultContext;

  console.log(`🪝 [Hook: PostToolUse] Agent: ${agentName} | Cost: $${(cost || 0).toFixed(4)} | Tokens: ${(inputTokens || 0) + (outputTokens || 0)}`);

  const cortex = new MemoryStore(DB_PATH);
  const learningEngine = new LearningEngine();

  // 1. Record token usage
  cortex.trackTokenUsage({
    sessionId: sessionId || 'session-' + Date.now(),
    agent: agentName,
    model: modelName || 'claude-sonnet-5',
    provider: provider || 'anthropic',
    inputTokens: inputTokens || 0,
    outputTokens: outputTokens || 0,
    cost: cost || 0,
    taskType: taskType || 'general',
    taskDescription: taskDescription || ''
  });

  // 2. Auto-capture learning if task involved fixing a bug or creating architectural patterns
  if (outputResult && (taskType === 'debugging' || taskType === 'architecture' || taskDescription.includes('fix') || taskDescription.includes('implement'))) {
    const summary = outputResult.slice(0, 200).replace(/\n/g, ' ');
    learningEngine.captureLearning(taskDescription, summary, agentName);
  }

  return {
    status: 'recorded',
    agent: agentName,
    tokensTracked: (inputTokens || 0) + (outputTokens || 0)
  };
}

module.exports = { onPostToolUse };

if (require.main === module) {
  const res = onPostToolUse({
    sessionId: 'test-session-123',
    agentName: 'codesmith',
    modelName: 'claude-sonnet-5',
    provider: 'anthropic',
    inputTokens: 1500,
    outputTokens: 2200,
    cost: 0.0375,
    taskType: 'implementation',
    taskDescription: 'Fix error handling in DB connection',
    outputResult: 'Added retry mechanism with exponential backoff for database connection retries.'
  });
  console.log('PostToolUse Result:', res);
}
