import puppeteer from 'puppeteer-core';
import { getProdAuth } from './prod_auth_helper.js';

async function testEditorUI() {
  const auth = await getProdAuth();
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36');

    const cookiePairs = auth.cookies.split('; ').map(c => {
      const idx = c.indexOf('=');
      return {
        name: c.slice(0, idx),
        value: c.slice(idx + 1),
        domain: 'reflectionelite.com',
        path: '/'
      };
    });
    await page.setCookie(...cookiePairs);

    await page.goto(`${auth.siteUrl}/wp-admin/admin.php?page=wpcode-snippet-manager&custom=1`, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    const info = await page.evaluate(() => {
      const titleInput = document.getElementById('title') || document.querySelector('input[name="wpcode_snippet_title"]');
      const codeTypeSelect = document.getElementById('wpcode_snippet_type') || document.querySelector('select[name="wpcode_snippet_type"]');
      const activeCheckbox = document.getElementById('wpcode_active');
      const saveButton = document.getElementById('wpcode-save-button') || document.querySelector('button.wpcode-button-save');
      const codeEditor = document.getElementById('wpcode_snippet_code');

      return {
        hasTitleInput: !!titleInput,
        titleInputId: titleInput ? titleInput.id : null,
        titleInputName: titleInput ? titleInput.name : null,
        hasCodeTypeSelect: !!codeTypeSelect,
        codeTypeOptions: codeTypeSelect ? Array.from(codeTypeSelect.options).map(o => ({ value: o.value, text: o.text })) : [],
        hasActiveCheckbox: !!activeCheckbox,
        hasSaveButton: !!saveButton,
        saveButtonText: saveButton ? saveButton.innerText : null,
        saveButtonId: saveButton ? saveButton.id : null,
        hasCodeEditor: !!codeEditor
      };
    });

    console.log('WPCode Editor info:', info);

  } finally {
    await browser.close();
  }
}

testEditorUI().catch(console.error);
