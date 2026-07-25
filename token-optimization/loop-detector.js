/**
 * Oh My Orq Loop Detector
 *
 * Detects if an agent is stuck in an infinite retry loop (repeated tool calls or messages).
 * Injects a corrective nudge if similarity exceeds 0.7 confidence.
 */

const crypto = require('crypto');

class LoopDetector {
  constructor() {
    this.history = [];
    this.maxHistory = 8;
  }

  recordToolCall(toolName, params) {
    const signature = `${toolName}:${JSON.stringify(params || {})}`;
    const hash = crypto.createHash('md5').update(signature).digest('hex');

    this.history.push({ hash, signature, timestamp: Date.now() });
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }

    return this.detectLoop();
  }

  detectLoop() {
    if (this.history.length < 4) return { isLoop: false };

    const recentHashes = this.history.map(h => h.hash);
    const lastHash = recentHashes[recentHashes.length - 1];

    let matchCount = 0;
    for (let i = 0; i < recentHashes.length - 1; i++) {
      if (recentHashes[i] === lastHash) matchCount++;
    }

    if (matchCount >= 2) {
      return {
        isLoop: true,
        confidence: 0.85,
        nudge: `⚠️ [LOOP DETECTOR ALERT]: You have executed the same tool call (${this.history[this.history.length - 1].signature.slice(0, 50)}) ${matchCount + 1} times. Stop repeating the failing approach. Try a different strategy or inspect the underlying root cause!`
      };
    }

    return { isLoop: false };
  }

  reset() {
    this.history = [];
  }
}

module.exports = LoopDetector;
