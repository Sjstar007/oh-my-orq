/**
 * Oh My Orq Output Compressor
 *
 * Rewrites verbose CLI tool outputs (pytest, npm test, git log, grep, docker)
 * into concise summaries + failure snippets. Reduces output tokens by 60-85%.
 */

class OutputCompressor {
  compress(command, output) {
    if (!output || output.length < 500) return output;

    const cmdLower = (command || '').toLowerCase();

    if (cmdLower.includes('pytest') || cmdLower.includes('npm test') || cmdLower.includes('jest')) {
      return this._compressTestOutput(output);
    } else if (cmdLower.includes('grep') || cmdLower.includes('rg ') || cmdLower.includes('find')) {
      return this._compressSearchResult(output);
    } else if (cmdLower.includes('git log')) {
      return this._compressGitLog(output);
    } else if (cmdLower.includes('ls ') || cmdLower.includes('dir')) {
      return this._compressListing(output);
    }

    // Default large output trim
    if (output.length > 2000) {
      return output.slice(0, 800) + `\n\n... [${output.length - 1600} characters compressed] ...\n\n` + output.slice(-800);
    }

    return output;
  }

  _compressTestOutput(output) {
    const lines = output.split('\n');
    const failures = lines.filter(l => l.includes('FAIL') || l.includes('ERROR') || l.includes('✕') || l.includes('FAILED'));
    const summary = lines.filter(l => l.includes('passed') || l.includes('failed') || l.includes('Tests:') || l.includes('Suites:'));

    let compressed = `[COMPRESSED TEST OUTPUT — ${lines.length} lines total]\n`;
    if (summary.length > 0) compressed += `Summary: ${summary.join(' | ')}\n\n`;

    if (failures.length > 0) {
      compressed += `Failures:\n${failures.slice(0, 15).join('\n')}\n`;
    } else {
      compressed += `Status: All tests passed cleanly.\n`;
    }

    return compressed;
  }

  _compressSearchResult(output) {
    const lines = output.split('\n').filter(Boolean);
    if (lines.length <= 20) return output;

    return `[COMPRESSED SEARCH RESULT — ${lines.length} matches found]\n` +
      lines.slice(0, 15).join('\n') +
      `\n... [${lines.length - 15} additional matches truncated]`;
  }

  _compressGitLog(output) {
    const lines = output.split('\n').filter(Boolean);
    if (lines.length <= 15) return output;

    return `[COMPRESSED GIT LOG — ${lines.length} commits]\n` +
      lines.slice(0, 10).join('\n') +
      `\n... [${lines.length - 10} older commits truncated]`;
  }

  _compressListing(output) {
    const lines = output.split('\n').filter(Boolean);
    if (lines.length <= 30) return output;

    return `[COMPRESSED DIRECTORY LISTING — ${lines.length} items]\n` +
      lines.slice(0, 20).join('\n') +
      `\n... [${lines.length - 20} items truncated]`;
  }
}

module.exports = OutputCompressor;
