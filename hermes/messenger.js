/**
 * Hermes Messenger Module — Autonomous Communication & Notification Engine
 *
 * Provides notification dispatching via:
 * 1. Desktop System Notifications (macOS / Linux / Windows)
 * 2. Webhook Integration (Discord, Slack, MS Teams, Custom HTTP)
 * 3. Inter-Agent Message Log (`.oh-my-orq/messages.json`)
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const MESSAGES_FILE = path.join(process.cwd(), '.oh-my-orq', 'messages.json');

class HermesMessenger {
  constructor() {
    this.messages = this._loadMessages();
  }

  _loadMessages() {
    try {
      if (fs.existsSync(MESSAGES_FILE)) {
        return JSON.parse(fs.readFileSync(MESSAGES_FILE, 'utf-8'));
      }
    } catch (e) { /* ignore */ }
    return [];
  }

  _saveMessages() {
    const dir = path.dirname(MESSAGES_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(this.messages, null, 2));
  }

  /**
   * Dispatch a notification (System, Webhook, or Log)
   */
  notify(options = {}) {
    const { channel = 'system', title = 'Oh My Orq Alert', message = '', webhookUrl } = options;

    const record = {
      id: Date.now().toString(36),
      channel,
      title,
      message,
      timestamp: new Date().toISOString()
    };

    this.messages.push(record);
    this._saveMessages();

    console.log(`☤ [Hermes] Notification [${channel}]: "${title} — ${message.slice(0, 40)}..."`);

    if (channel === 'system') {
      this._sendDesktopNotification(title, message);
    } else if (channel === 'webhook' && webhookUrl) {
      this._sendWebhook(webhookUrl, title, message);
    }

    return record;
  }

  _sendDesktopNotification(title, message) {
    const platform = process.platform;
    const cleanTitle = title.replace(/"/g, '\\"');
    const cleanMsg = message.replace(/"/g, '\\"');

    if (platform === 'darwin') {
      exec(`osascript -e 'display notification "${cleanMsg}" with title "${cleanTitle}"'`);
    } else if (platform === 'linux') {
      exec(`notify-send "${cleanTitle}" "${cleanMsg}"`);
    }
  }

  _sendWebhook(url, title, message) {
    try {
      const https = url.startsWith('https') ? require('https') : require('http');
      const payload = JSON.stringify({
        content: `**${title}**\n${message}`
      });

      const req = https.request(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload)
        }
      });
      req.write(payload);
      req.end();
    } catch (e) {
      console.error('Hermes Webhook Error:', e.message);
    }
  }

  listMessages(limit = 20) {
    return this.messages.slice(-limit).reverse();
  }
}

module.exports = HermesMessenger;

if (require.main === module) {
  const messenger = new HermesMessenger();
  messenger.notify({ channel: 'system', title: 'Hermes Self-Test', message: 'Hermes messaging engine initialized successfully!' });
}
