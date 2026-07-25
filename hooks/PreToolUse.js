/**
 * Oh My Orq PreToolUse Hook (Stitched Flow)
 *
 * Intercepts tool calls before execution and applies:
 * 1. Delta Mode (file re-read diffs)
 * 2. Code Skeletons (structural summaries)
 * 3. Progressive Disclosure & Archiving (for large inputs)
 * 4. Loop Detection (alerting on repeated failing tool loops)
 * 5. Memory & Continuous Learning Context Injection
 * 6. Prompt Compression
 */

const LearningEngine = require('../memory/learning');
const { MemoryStore, DB_PATH } = require('../memory/cortex');
const { compressPrompt } = require('../token-optimization/optimizer');
const DeltaModeEngine = require('../token-optimization/delta-mode');
const CodeSkeletonEngine = require('../token-optimization/skeletons');
const OutputCompressor = require('../token-optimization/output-compressor');
const ArchiveStore = require('../token-optimization/archive-store');
const LoopDetector = require('../token-optimization/loop-detector');

const deltaEngine = new DeltaModeEngine();
const skeletonEngine = new CodeSkeletonEngine();
const outputCompressor = new OutputCompressor();
const archiveStore = new ArchiveStore();
const loopDetector = new LoopDetector();

function onPreToolUse(context) {
  const { agentName, taskDescription, toolName, toolParams, prompt, content } = context;
  console.log(`🪝 [Hook: PreToolUse] Agent: ${agentName} | Tool: ${toolName || 'task'} | Task: "${(taskDescription || '').slice(0, 30)}..."`);

  const cortex = new MemoryStore(DB_PATH);
  const learningEngine = new LearningEngine();

  // 1. Loop Detection
  const loopCheck = loopDetector.recordToolCall(toolName || 'task', toolParams);
  let loopNudge = '';
  if (loopCheck.isLoop) {
    loopNudge = `\n${loopCheck.nudge}\n`;
  }

  // 2. Delta Mode or Code Skeleton if file read
  let processedContent = content || prompt || '';
  if (toolName === 'view_file' || toolName === 'read_file') {
    const filePath = toolParams?.AbsolutePath || toolParams?.filePath || 'file';
    const deltaRes = deltaEngine.processRead(filePath, processedContent);
    if (deltaRes.isDelta) {
      processedContent = deltaRes.content;
    } else {
      // First read: apply skeleton if code file is large
      const skelRes = skeletonEngine.generateSkeleton(filePath, processedContent);
      if (skelRes.skeleton) {
        processedContent = typeof skelRes === 'string' ? skelRes : skelRes.skeleton;
      }
    }
  }

  // 3. Output Compression (if CLI command output)
  if (toolName === 'run_command' || toolName === 'bash') {
    processedContent = outputCompressor.compress(toolParams?.CommandLine || '', processedContent);
  }

  // 4. Progressive Disclosure Archiving (if content > 4KB)
  const archiveRes = archiveStore.process(toolName || 'tool', processedContent, 4096);
  if (archiveRes.archived) {
    processedContent = archiveRes.content;
  }

  // 5. Memory & Continuous Learning Context
  const memories = cortex.recallMemories(taskDescription || '', { limit: 3 });
  let memoryContext = '';
  if (memories.length > 0) {
    memoryContext = `\n--- RECALLED PROJECT MEMORIES ---\n` +
      memories.map(m => `[${m.type}] ${m.content}`).join('\n') +
      `\n---------------------------------\n`;
  }
  const learningContext = learningEngine.getLearningContextPrompt();

  // 6. Final Prompt Compression
  const fullPrompt = processedContent + '\n' + loopNudge + memoryContext + '\n' + learningContext;
  const compressed = compressPrompt(fullPrompt);

  return {
    ...context,
    preparedPrompt: compressed.compressed,
    loopDetected: loopCheck.isLoop,
    recalledMemoriesCount: memories.length,
    savedTokensEstimate: compressed.savedTokensEstimate
  };
}

module.exports = { onPreToolUse, deltaEngine, archiveStore, loopDetector };

if (require.main === module) {
  const res = onPreToolUse({
    agentName: 'forge',
    taskDescription: 'Implement user login endpoint',
    toolName: 'view_file',
    toolParams: { AbsolutePath: '/Users/shubhamjangid/workspace/agent/cli/orq.js' },
    content: 'const fs = require("fs"); function foo() { console.log("bar"); } module.exports = foo;'
  });
  console.log('PreToolUse Output:\n', res.preparedPrompt.slice(0, 300) + '...');
}
