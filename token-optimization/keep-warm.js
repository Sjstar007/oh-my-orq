/**
 * Oh My Orq Keep-Warm Prompt Cache Pinger
 *
 * Issues minimal read pings before API prompt cache TTL expires (5 minutes)
 * to keep Anthropic/OpenAI prompt caches alive for 0.1x cost vs 1.25x rewrite cost.
 */

class KeepWarmEngine {
  constructor() {
    this.lastPingTime = Date.now();
    this.ttlMs = 4 * 60 * 1000; // 4 minute ping interval
  }

  shouldPing() {
    return (Date.now() - this.lastPingTime) > this.ttlMs;
  }

  createKeepWarmPayload(prefixHash) {
    this.lastPingTime = Date.now();
    return {
      type: 'keep-warm-ping',
      hash: prefixHash,
      timestamp: new Date().toISOString(),
      message: '[KEEP-WARM CACHE PING: Refreshing prompt cache TTL]'
    };
  }
}

module.exports = KeepWarmEngine;
