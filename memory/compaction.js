/**
 * Oh My Orq Compaction Checkpoints & Context Intel Digest
 *
 * Checkpoints session state (active task, key decisions, modified files, git branch)
 * before auto-compaction and auto-restores an Intel Digest after compaction.
 */

const fs = require('fs');
const path = require('path');
const { MemoryStore, DB_PATH } = require('./cortex');

const CHECKPOINT_DIR = path.join(process.cwd(), '.oh-my-orq', 'checkpoints');

class CompactionEngine {
  constructor() {
    this.cortex = new MemoryStore(DB_PATH);
    if (!fs.existsSync(CHECKPOINT_DIR)) {
      fs.mkdirSync(CHECKPOINT_DIR, { recursive: true });
    }
  }

  /**
   * Save a pre-compaction checkpoint
   */
  createCheckpoint(sessionId, taskDescription, decisions = [], modifiedFiles = []) {
    const checkpoint = {
      sessionId,
      taskDescription,
      decisions,
      modifiedFiles,
      timestamp: new Date().toISOString(),
      project: process.cwd()
    };

    const filePath = path.join(CHECKPOINT_DIR, `checkpoint-${sessionId || 'latest'}.json`);
    fs.writeFileSync(filePath, JSON.stringify(checkpoint, null, 2));

    // Store key decisions to Cortex memory
    for (const decision of decisions) {
      this.cortex.saveMemory(`Compaction Checkpoint Decision: ${decision}`, { type: 'decision', tags: ['compaction', 'checkpoint'] });
    }

    console.log(`🛡️ [CompactionEngine] Created pre-compaction checkpoint for session ${sessionId}`);
    return checkpoint;
  }

  /**
   * Generate post-compaction Context Intel Digest
   */
  generateIntelDigest(sessionId) {
    const filePath = path.join(CHECKPOINT_DIR, `checkpoint-${sessionId || 'latest'}.json`);

    let checkpoint = null;
    try {
      if (fs.existsSync(filePath)) {
        checkpoint = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      }
    } catch (e) { /* ignore */ }

    let digest = `\n--- 🧠 POST-COMPACTION CONTEXT INTEL DIGEST ---\n`;
    digest += `[Context auto-compacted. Restoring critical session state]\n`;

    if (checkpoint) {
      digest += `- Active Task: ${checkpoint.taskDescription}\n`;
      if (checkpoint.modifiedFiles.length > 0) {
        digest += `- Touched Files: ${checkpoint.modifiedFiles.join(', ')}\n`;
      }
      if (checkpoint.decisions.length > 0) {
        digest += `- Critical Decisions:\n` + checkpoint.decisions.map(d => `  • ${d}`).join('\n') + '\n';
      }
    } else {
      digest += `- Session state re-established. Proceeding with active task.\n`;
    }

    digest += `-------------------------------------------------\n`;
    return digest;
  }
}

module.exports = CompactionEngine;
