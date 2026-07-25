/**
 * Oh My Orq Archive Store (Progressive Disclosure & Retrieval)
 *
 * Archives large tool output (>4KB) to local disk (`.oh-my-orq/archives/`) and
 * replaces it in prompt context with a 100-token preview + retrieval ID.
 * Agents can retrieve full outputs on demand via `orq expand <id>`.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class ArchiveStore {
  constructor() {
    this.archiveDir = path.join(process.cwd(), '.oh-my-orq', 'archives');
    if (!fs.existsSync(this.archiveDir)) {
      fs.mkdirSync(this.archiveDir, { recursive: true });
    }
  }

  /**
   * Process tool output. If > threshold (default 4KB), archives and returns preview.
   */
  process(toolName, content, thresholdBytes = 4096) {
    if (!content || content.length < thresholdBytes) {
      return { archived: false, content };
    }

    const archiveId = crypto.randomBytes(4).toString('hex');
    const filename = `${archiveId}.txt`;
    const archivePath = path.join(this.archiveDir, filename);

    fs.writeFileSync(archivePath, content, 'utf-8');

    const preview = content.slice(0, 400).replace(/\n+/g, ' ');
    const replacement = `[📦 PROGRESSIVE DISCLOSURE ARCHIVE #${archiveId}]\n` +
      `Tool: ${toolName} | Size: ${(content.length / 1024).toFixed(1)} KB\n` +
      `Preview: ${preview}...\n` +
      `[Full output archived. Run 'orq expand ${archiveId}' or prompt 'Expand archive ${archiveId}' to retrieve]`;

    return {
      archived: true,
      archiveId,
      archivePath,
      savedTokens: Math.max(0, Math.ceil((content.length - replacement.length) / 4)),
      content: replacement
    };
  }

  /**
   * Retrieve archived output by ID.
   */
  retrieve(archiveId) {
    const filename = archiveId.endsWith('.txt') ? archiveId : `${archiveId}.txt`;
    const archivePath = path.join(this.archiveDir, filename);

    if (fs.existsSync(archivePath)) {
      return fs.readFileSync(archivePath, 'utf-8');
    }
    return null;
  }

  list() {
    if (!fs.existsSync(this.archiveDir)) return [];
    return fs.readdirSync(this.archiveDir).map(file => {
      const stat = fs.statSync(path.join(this.archiveDir, file));
      return {
        id: file.replace('.txt', ''),
        sizeKB: (stat.size / 1024).toFixed(1),
        createdAt: stat.birthtime.toISOString()
      };
    });
  }
}

module.exports = ArchiveStore;
