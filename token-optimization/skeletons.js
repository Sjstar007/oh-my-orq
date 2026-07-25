/**
 * Oh My Orq Code Skeletons (AST-style Structural Summary Generator)
 *
 * Converts code files into structural skeletons (imports, exports, class & function signatures)
 * for re-reads or initial exploratory reads. Reduces code file size by 75-90%.
 */

class CodeSkeletonEngine {
  /**
   * Generates a structural skeleton from source code.
   */
  generateSkeleton(filePath, code) {
    const ext = filePath.split('.').pop().toLowerCase();

    if (['js', 'ts', 'jsx', 'tsx', 'mjs'].includes(ext)) {
      return this._skeletonJS(filePath, code);
    } else if (ext === 'py') {
      return this._skeletonPython(filePath, code);
    }

    // Fallback: return top 30 lines
    const lines = code.split('\n');
    if (lines.length <= 40) return code;
    return lines.slice(0, 30).join('\n') + `\n... [${lines.length - 30} lines collapsed]`;
  }

  _skeletonJS(filePath, code) {
    const lines = code.split('\n');
    const skeletonLines = [`// 🦴 SKELETON SUMMARY: ${filePath} (${lines.length} lines, ${(code.length/1024).toFixed(1)} KB)`];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      // Imports / Exports
      if (trimmed.startsWith('import ') || trimmed.startsWith('require(') || trimmed.startsWith('export ')) {
        skeletonLines.push(line);
      }
      // Class definitions
      else if (/\bclass\s+\w+/.test(trimmed)) {
        skeletonLines.push(line);
      }
      // Function signatures (async function, const fn =, function foo)
      else if (/\bfunction\b|\bconst\s+\w+\s*=\s*(\(|async)/.test(trimmed)) {
        if (trimmed.endsWith('{') || trimmed.endsWith('=>')) {
          skeletonLines.push(line.replace(/\{$/, '{ /* ... */ }'));
        } else {
          skeletonLines.push(line + ' { /* ... */ }');
        }
      }
      // Method signatures
      else if (/^\s*(async\s+)?\w+\s*\(.*\)\s*\{/.test(line)) {
        skeletonLines.push(line.replace(/\{$/, '{ /* ... */ }'));
      }
    }

    const result = skeletonLines.join('\n');
    return {
      skeleton: result,
      savedTokens: Math.max(0, Math.ceil((code.length - result.length) / 4))
    };
  }

  _skeletonPython(filePath, code) {
    const lines = code.split('\n');
    const skeletonLines = [`# 🦴 SKELETON SUMMARY: ${filePath} (${lines.length} lines)`];

    for (const line of lines) {
      const trimmed = line.trim();

      if (trimmed.startsWith('import ') || trimmed.startsWith('from ')) {
        skeletonLines.push(line);
      } else if (trimmed.startsWith('class ') || trimmed.startsWith('def ')) {
        skeletonLines.push(line + ' pass');
      }
    }

    const result = skeletonLines.join('\n');
    return {
      skeleton: result,
      savedTokens: Math.max(0, Math.ceil((code.length - result.length) / 4))
    };
  }
}

module.exports = CodeSkeletonEngine;
