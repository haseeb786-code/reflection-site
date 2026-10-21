const fs = require('fs');
const html = fs.readFileSync('wpcode_new_custom.html', 'utf8');

const titleInput = html.match(/<input[^>]*id="title"[^>]*>/i);
console.log('Title input:', titleInput ? titleInput[0] : 'none');

const codeTypeSelect = html.match(/<select[^>]*id="wpcode-code-type"[^>]*>([\s\S]*?)<\/select>/i);
console.log('Code type select:', codeTypeSelect ? codeTypeSelect[0] : 'none');

const saveBtn = html.match(/<button[^>]*id="wpcode-save-button"[^>]*>([\s\S]*?)<\/button>/i) || html.match(/<button[^>]*class="[^"]*wpcode-button[^"]*"[^>]*>([\s\S]*?)<\/button>/i);
console.log('Save button:', saveBtn ? saveBtn[0] : 'none');

const activeToggle = html.match(/<input[^>]*id="wpcode_active"[^>]*>/i) || html.match(/<input[^>]*name="wpcode_active"[^>]*>/i);
console.log('Active toggle:', activeToggle ? activeToggle[0] : 'none');
