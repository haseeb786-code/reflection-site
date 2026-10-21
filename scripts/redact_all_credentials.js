import fs from 'fs';
import path from 'path';

const SCRIPTS_DIR = path.resolve('scripts');
const files = fs.readdirSync(SCRIPTS_DIR).filter(f => f.endsWith('.js'));

let redactedCount = 0;
let fileCount = 0;

for (const file of files) {
  if (file === 'redact_all_credentials.js') continue;
  const filePath = path.join(SCRIPTS_DIR, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  if (content.includes('Kaif.elite123')) {
    content = content.replaceAll('Kaif.elite123', 'process.env.PROD_WP_PASS || "[REDACTED]"');
    changed = true;
    redactedCount++;
  }
  if (content.includes('oOeiQLY7j1mCWb6UGndxqYFg')) {
    content = content.replaceAll('oOeiQLY7j1mCWb6UGndxqYFg', 'process.env.PROD_WP_APP_PASS || "[REDACTED]"');
    changed = true;
    redactedCount++;
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    fileCount++;
    console.log(`✓ Redacted credentials in ${file}`);
  }
}

console.log(`\nCompleted! Redacted ${redactedCount} instances across ${fileCount} script files.`);
