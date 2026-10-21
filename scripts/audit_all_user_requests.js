import fs from 'fs';
import readline from 'readline';

async function findUserRequests() {
  const fileStream = fs.createReadStream('C:\\Users\\haseeb\\.gemini\\antigravity\\brain\\414d7e40-4d4d-49c9-8868-01c3c84a4783\\.system_generated\\logs\\transcript.jsonl');
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  let count = 0;
  for await (const line of rl) {
    if (!line.trim()) continue;
    try {
      const obj = JSON.parse(line);
      if (obj.type === 'USER_INPUT') {
        count++;
        const preview = (obj.content || '').split('\n').filter(l => l.trim()).slice(0, 3).join(' | ');
        console.log(`Req #${count} [Step ${obj.step_index}]: ${preview.slice(0, 150)}`);
      }
    } catch (e) {}
  }
}

findUserRequests().catch(console.error);
