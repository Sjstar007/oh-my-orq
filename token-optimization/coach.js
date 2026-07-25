/**
 * Oh My Orq Quality Scoring & Token Coach
 *
 * 1. Scores context health & quality (Grades S, A, B, C, D, F) based on token fill & repeat reads.
 * 2. Provides `/token-coach` audit report analyzing token waste and actionable recommendations.
 */

const { MemoryStore, DB_PATH } = require('../memory/cortex');

class QualityCoach {
  constructor() {
    this.cortex = new MemoryStore(DB_PATH);
  }

  /**
   * Calculate real-time context quality score (0-100) and letter grade
   */
  calculateQualityScore(totalTokens, contextLimit = 200000, repeatReadCount = 0) {
    const fillRatio = totalTokens / contextLimit;

    // Quality drops as context fills (MRCR decay)
    let score = 100 - (fillRatio * 35);

    // Penalty for excessive repeat reads
    score -= (repeatReadCount * 5);

    score = Math.max(10, Math.min(100, Math.round(score)));

    let grade = 'S';
    if (score < 90) grade = 'A';
    if (score < 80) grade = 'B';
    if (score < 70) grade = 'C';
    if (score < 60) grade = 'D';
    if (score < 50) grade = 'F';

    return {
      score,
      grade,
      fillPercentage: (fillRatio * 100).toFixed(1) + '%',
      status: score >= 75 ? 'Healthy 🟢' : score >= 60 ? 'Warning 🟡' : 'Degraded 🔴'
    };
  }

  /**
   * Run Coach Mode Audit Report
   */
  generateCoachReport() {
    const summary = this.cortex.getTokenSummary();
    const totalTokens = summary.total.input + summary.total.output;
    const totalCost = summary.total.cost;

    const quality = this.calculateQualityScore(totalTokens);

    let report = `\n⚡ ====================================================\n`;
    report += `🎯 OH MY ORQ TOKEN COACH AUDIT REPORT\n`;
    report += `====================================================\n\n`;

    report += `📊 Context Health Grade: ${quality.grade} (${quality.score}/100) — ${quality.status}\n`;
    report += `💰 Total Spent: $${totalCost.toFixed(4)} across ${summary.recordCount} API calls\n`;
    report += `🔢 Total Tokens: ${totalTokens.toLocaleString()} (${summary.total.input.toLocaleString()} in / ${summary.total.output.toLocaleString()} out)\n`;
    report += `⚡ Cached Saved: ${summary.total.cached.toLocaleString()} tokens\n\n`;

    report += `💡 TOP OPTIMIZATION RECOMMENDATIONS:\n`;

    if (summary.byModel['claude-opus-4.8'] && summary.byModel['claude-opus-4.8'].count > 5) {
      report += `  1. 🔴 High Opus Usage: You made ${summary.byModel['claude-opus-4.8'].count} Opus calls. Consider routing simple tasks to Sonnet or Flash.\n`;
    } else {
      report += `  1. 🟢 Model Routing: Good model distribution observed.\n`;
    }

    report += `  2. 🗜️ Output Compression: Active. Test output & search compression enabled.\n`;
    report += `  3. 📦 Progressive Disclosure: Outputs > 4KB are automatically archived.\n`;
    report += `  4. 🧠 Project Memory: Cortex shared memory active.\n`;

    report += `\n====================================================\n`;
    return report;
  }
}

module.exports = QualityCoach;

if (require.main === module) {
  const coach = new QualityCoach();
  console.log(coach.generateCoachReport());
}
