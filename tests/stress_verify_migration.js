#!/usr/bin/env node

/**
 * Empirical Script Stress Tester for Milestone 1
 * Script under test: scripts/verify_migration.js
 * Focus: Line endings (LF, CRLF, mixed, BOM), empty trailing lines, CSV parsing integrity,
 * positive baseline verification, negative assertion failure injection, and cross-platform fragility.
 */

import fs from 'fs';
import path from 'path';
import os from 'os';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

console.log('======================================================================');
console.log('🧪 EMPIRICAL STRESS TEST SUITE: scripts/verify_migration.js');
console.log('======================================================================\n');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const results = [];

function recordResult(name, category, passed, details = '') {
  totalTests++;
  if (passed) {
    passedTests++;
    console.log(`  [PASS] [${category}] ${name}`);
  } else {
    failedTests++;
    console.error(`  [FAIL] [${category}] ${name}`);
    if (details) console.error(`         Details: ${details}`);
  }
  results.push({ name, category, passed, details });
}

// Helper to run verify_migration in a specified working directory
function runScript(cwd) {
  const scriptPath = path.join(cwd, 'scripts', 'verify_migration.js');
  const res = spawnSync(process.execPath, [scriptPath], {
    cwd,
    encoding: 'utf8',
    env: { ...process.env }
  });
  const combinedOutput = (res.stdout || '') + (res.stderr || '');
  return {
    status: res.status,
    stdout: res.stdout || '',
    stderr: res.stderr || '',
    combined: combinedOutput,
    error: res.error
  };
}

// Create an isolated sandbox copying all project assets needed by verify_migration.js
function createSandbox() {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'verify-stress-'));
  const scriptsDir = path.join(tmpDir, 'scripts');
  const dataDir = path.join(tmpDir, 'data');
  const assetsDir = path.join(tmpDir, 'assets', 'images');

  fs.mkdirSync(scriptsDir, { recursive: true });
  fs.mkdirSync(dataDir, { recursive: true });
  fs.mkdirSync(assetsDir, { recursive: true });

  // Copy scripts/verify_migration.js
  fs.copyFileSync(
    path.join(projectRoot, 'scripts', 'verify_migration.js'),
    path.join(scriptsDir, 'verify_migration.js')
  );

  // Copy data files
  const dataFiles = [
    'shopify_export.json',
    'woocommerce_categories.csv',
    'woocommerce_products.csv',
    'seo_301_redirects.csv'
  ];
  for (const f of dataFiles) {
    fs.copyFileSync(
      path.join(projectRoot, 'data', f),
      path.join(dataDir, f)
    );
  }

  // Copy all image assets
  const sourceImagesDir = path.join(projectRoot, 'assets', 'images');
  const imgFiles = fs.readdirSync(sourceImagesDir);
  for (const f of imgFiles) {
    fs.copyFileSync(
      path.join(sourceImagesDir, f),
      path.join(assetsDir, f)
    );
  }

  return {
    tmpDir,
    cleanup: () => {
      try {
        fs.rmSync(tmpDir, { recursive: true, force: true });
      } catch (e) {
        // ignore cleanup errors
      }
    }
  };
}

async function runAllTests() {
  // =========================================================================
  // CATEGORY 1: BASELINE PROJECT VERIFICATION (Live project repo state)
  // =========================================================================
  console.log('▶ Category 1: Real Baseline Project Verification');
  {
    const res = runScript(projectRoot);
    const passCountMatch = res.stdout.match(/VERIFICATION SUMMARY: (\d+) PASSED, (\d+) FAILED/);
    const passCount = passCountMatch ? parseInt(passCountMatch[1], 10) : 0;
    const failCount = passCountMatch ? parseInt(passCountMatch[2], 10) : -1;

    recordResult(
      'Baseline script execution exits with code 0',
      'Baseline',
      res.status === 0,
      `Exit code: ${res.status}, stderr: ${res.stderr}`
    );

    recordResult(
      'Baseline reports exactly 19 PASSED and 0 FAILED',
      'Baseline',
      passCount === 19 && failCount === 0,
      `Reported: ${passCount} passed, ${failCount} failed`
    );

    recordResult(
      'Baseline validates SEO Redirects rule count',
      'Baseline',
      res.stdout.includes('[PASS] SEO Redirects contains 1 header + 18 redirect rules (11 products including aliases, 5 collections, 2 pages)'),
      'Missing expected SEO Redirects assertion message in stdout'
    );
  }

  // =========================================================================
  // CATEGORY 2: LINE ENDINGS STRESS TESTING ON data/seo_301_redirects.csv
  // =========================================================================
  console.log('\n▶ Category 2: Line Endings & Trailing Newline Permutations on seo_301_redirects.csv');

  const originalSeoText = fs.readFileSync(path.join(projectRoot, 'data', 'seo_301_redirects.csv'), 'utf8');
  const rawLines = originalSeoText.trim().split(/\r?\n/); // 19 rows

  // Subcase 2.1: LF line endings, no trailing newline
  {
    const sb = createSandbox();
    try {
      const content = rawLines.join('\n');
      fs.writeFileSync(path.join(sb.tmpDir, 'data', 'seo_301_redirects.csv'), content, 'utf8');
      const res = runScript(sb.tmpDir);
      recordResult(
        'Pure LF without trailing newline -> PASS (19 passed, exit 0)',
        'LineEndings_SEO',
        res.status === 0 && res.stdout.includes('19 PASSED, 0 FAILED'),
        `Status: ${res.status}, Combined: ${res.combined}`
      );
    } finally {
      sb.cleanup();
    }
  }

  // Subcase 2.2: LF line endings, single trailing newline
  {
    const sb = createSandbox();
    try {
      const content = rawLines.join('\n') + '\n';
      fs.writeFileSync(path.join(sb.tmpDir, 'data', 'seo_301_redirects.csv'), content, 'utf8');
      const res = runScript(sb.tmpDir);
      recordResult(
        'Pure LF with single trailing newline (\\n) -> PASS (19 passed, exit 0)',
        'LineEndings_SEO',
        res.status === 0 && res.stdout.includes('19 PASSED, 0 FAILED'),
        `Status: ${res.status}, Combined: ${res.combined}`
      );
    } finally {
      sb.cleanup();
    }
  }

  // Subcase 2.3: LF line endings, 5 trailing newlines
  {
    const sb = createSandbox();
    try {
      const content = rawLines.join('\n') + '\n\n\n\n\n';
      fs.writeFileSync(path.join(sb.tmpDir, 'data', 'seo_301_redirects.csv'), content, 'utf8');
      const res = runScript(sb.tmpDir);
      recordResult(
        'Pure LF with multiple trailing newlines (\\n*5) -> PASS (19 passed, exit 0)',
        'LineEndings_SEO',
        res.status === 0 && res.stdout.includes('19 PASSED, 0 FAILED'),
        `Status: ${res.status}, Combined: ${res.combined}`
      );
    } finally {
      sb.cleanup();
    }
  }

  // Subcase 2.4: CRLF line endings, no trailing newline
  {
    const sb = createSandbox();
    try {
      const content = rawLines.join('\r\n');
      fs.writeFileSync(path.join(sb.tmpDir, 'data', 'seo_301_redirects.csv'), content, 'utf8');
      const res = runScript(sb.tmpDir);
      recordResult(
        'Pure CRLF without trailing newline -> PASS (19 passed, exit 0)',
        'LineEndings_SEO',
        res.status === 0 && res.stdout.includes('19 PASSED, 0 FAILED'),
        `Status: ${res.status}, Combined: ${res.combined}`
      );
    } finally {
      sb.cleanup();
    }
  }

  // Subcase 2.5: CRLF line endings, single trailing CRLF
  {
    const sb = createSandbox();
    try {
      const content = rawLines.join('\r\n') + '\r\n';
      fs.writeFileSync(path.join(sb.tmpDir, 'data', 'seo_301_redirects.csv'), content, 'utf8');
      const res = runScript(sb.tmpDir);
      recordResult(
        'Pure CRLF with single trailing newline (\\r\\n) -> PASS (19 passed, exit 0)',
        'LineEndings_SEO',
        res.status === 0 && res.stdout.includes('19 PASSED, 0 FAILED'),
        `Status: ${res.status}, Combined: ${res.combined}`
      );
    } finally {
      sb.cleanup();
    }
  }

  // Subcase 2.6: CRLF line endings, 5 trailing CRLFs
  {
    const sb = createSandbox();
    try {
      const content = rawLines.join('\r\n') + '\r\n\r\n\r\n\r\n\r\n';
      fs.writeFileSync(path.join(sb.tmpDir, 'data', 'seo_301_redirects.csv'), content, 'utf8');
      const res = runScript(sb.tmpDir);
      recordResult(
        'Pure CRLF with multiple trailing newlines (\\r\\n*5) -> PASS (19 passed, exit 0)',
        'LineEndings_SEO',
        res.status === 0 && res.stdout.includes('19 PASSED, 0 FAILED'),
        `Status: ${res.status}, Combined: ${res.combined}`
      );
    } finally {
      sb.cleanup();
    }
  }

  // Subcase 2.7: Mixed line endings (alternating LF and CRLF)
  {
    const sb = createSandbox();
    try {
      let mixedContent = '';
      rawLines.forEach((line, idx) => {
        mixedContent += line + (idx < rawLines.length - 1 ? (idx % 2 === 0 ? '\r\n' : '\n') : '');
      });
      fs.writeFileSync(path.join(sb.tmpDir, 'data', 'seo_301_redirects.csv'), mixedContent, 'utf8');
      const res = runScript(sb.tmpDir);
      recordResult(
        'Mixed LF and CRLF alternating per line -> PASS (19 passed, exit 0)',
        'LineEndings_SEO',
        res.status === 0 && res.stdout.includes('19 PASSED, 0 FAILED'),
        `Status: ${res.status}, Combined: ${res.combined}`
      );
    } finally {
      sb.cleanup();
    }
  }

  // Subcase 2.8: Mixed line endings with trailing mixed whitespace and newlines
  {
    const sb = createSandbox();
    try {
      let mixedContent = '';
      rawLines.forEach((line, idx) => {
        mixedContent += line + (idx % 2 === 0 ? '\r\n' : '\n');
      });
      mixedContent += '\r\n   \n\t \r\n';
      fs.writeFileSync(path.join(sb.tmpDir, 'data', 'seo_301_redirects.csv'), mixedContent, 'utf8');
      const res = runScript(sb.tmpDir);
      recordResult(
        'Mixed LF/CRLF with trailing whitespace and newlines -> PASS (19 passed, exit 0)',
        'LineEndings_SEO',
        res.status === 0 && res.stdout.includes('19 PASSED, 0 FAILED'),
        `Status: ${res.status}, Combined: ${res.combined}`
      );
    } finally {
      sb.cleanup();
    }
  }

  // Subcase 2.9: Blank line in middle of rules (internal empty line)
  {
    const sb = createSandbox();
    try {
      const corrupted = [...rawLines.slice(0, 5), '', ...rawLines.slice(5)].join('\n');
      fs.writeFileSync(path.join(sb.tmpDir, 'data', 'seo_301_redirects.csv'), corrupted, 'utf8');
      const res = runScript(sb.tmpDir);
      recordResult(
        'Empty line in middle of CSV -> FAIL (assertion triggers, exit 1)',
        'EmptyLines_SEO',
        res.status === 1 && res.combined.includes('[FAIL] SEO Redirects contains 1 header + 18 redirect rules'),
        `Status: ${res.status}, Combined: ${res.combined}`
      );
    } finally {
      sb.cleanup();
    }
  }

  // Subcase 2.10: Completely blank CSV (empty file)
  {
    const sb = createSandbox();
    try {
      fs.writeFileSync(path.join(sb.tmpDir, 'data', 'seo_301_redirects.csv'), '', 'utf8');
      const res = runScript(sb.tmpDir);
      recordResult(
        'Completely empty CSV file -> FAIL (assertion triggers, exit 1)',
        'EmptyLines_SEO',
        res.status === 1 && res.combined.includes('[FAIL] SEO Redirects contains 1 header + 18 redirect rules'),
        `Status: ${res.status}, Combined: ${res.combined}`
      );
    } finally {
      sb.cleanup();
    }
  }

  // Subcase 2.11: UTF-8 with BOM (\uFEFF) + LF
  {
    const sb = createSandbox();
    try {
      const bomContent = '\uFEFF' + rawLines.join('\n') + '\n';
      fs.writeFileSync(path.join(sb.tmpDir, 'data', 'seo_301_redirects.csv'), bomContent, 'utf8');
      const res = runScript(sb.tmpDir);
      recordResult(
        'UTF-8 BOM (\\uFEFF) with LF -> PASS (trim strips BOM, exit 0)',
        'LineEndings_SEO',
        res.status === 0 && res.stdout.includes('19 PASSED, 0 FAILED'),
        `Status: ${res.status}, Combined: ${res.combined}`
      );
    } finally {
      sb.cleanup();
    }
  }

  // Subcase 2.12: UTF-8 with BOM (\uFEFF) + CRLF
  {
    const sb = createSandbox();
    try {
      const bomContent = '\uFEFF' + rawLines.join('\r\n') + '\r\n';
      fs.writeFileSync(path.join(sb.tmpDir, 'data', 'seo_301_redirects.csv'), bomContent, 'utf8');
      const res = runScript(sb.tmpDir);
      recordResult(
        'UTF-8 BOM (\\uFEFF) with CRLF -> PASS (trim strips BOM, exit 0)',
        'LineEndings_SEO',
        res.status === 0 && res.stdout.includes('19 PASSED, 0 FAILED'),
        `Status: ${res.status}, Combined: ${res.combined}`
      );
    } finally {
      sb.cleanup();
    }
  }

  // =========================================================================
  // CATEGORY 3: CSV DATA ALTERATION & INTEGRITY TESTING ON seo_301_redirects.csv
  // =========================================================================
  console.log('\n▶ Category 3: CSV Data Alteration & Negative Injection on seo_301_redirects.csv');

  // Subcase 3.1: Line deletion (18 total lines instead of 19)
  {
    const sb = createSandbox();
    try {
      const truncated = rawLines.slice(0, 18).join('\n');
      fs.writeFileSync(path.join(sb.tmpDir, 'data', 'seo_301_redirects.csv'), truncated, 'utf8');
      const res = runScript(sb.tmpDir);
      recordResult(
        'Under-count: 17 rules (18 lines) -> FAIL (assertion triggers, exit 1)',
        'Integrity_SEO',
        res.status === 1 && res.combined.includes('[FAIL] SEO Redirects contains 1 header + 18 redirect rules'),
        `Status: ${res.status}, Combined: ${res.combined}`
      );
    } finally {
      sb.cleanup();
    }
  }

  // Subcase 3.2: Line addition (20 total lines instead of 19)
  {
    const sb = createSandbox();
    try {
      const extended = [...rawLines, '/products/phantom-product,/product/phantom/,301'].join('\n');
      fs.writeFileSync(path.join(sb.tmpDir, 'data', 'seo_301_redirects.csv'), extended, 'utf8');
      const res = runScript(sb.tmpDir);
      recordResult(
        'Over-count: 19 rules (20 lines) -> FAIL (assertion triggers, exit 1)',
        'Integrity_SEO',
        res.status === 1 && res.combined.includes('[FAIL] SEO Redirects contains 1 header + 18 redirect rules'),
        `Status: ${res.status}, Combined: ${res.combined}`
      );
    } finally {
      sb.cleanup();
    }
  }

  // Subcase 3.3: Deleted seo_301_redirects.csv file
  {
    const sb = createSandbox();
    try {
      fs.unlinkSync(path.join(sb.tmpDir, 'data', 'seo_301_redirects.csv'));
      const res = runScript(sb.tmpDir);
      recordResult(
        'Missing data/seo_301_redirects.csv -> FAIL (assertion triggers or throws, exit non-zero)',
        'Integrity_SEO',
        res.status !== 0,
        `Status: ${res.status}, Output: ${res.stdout}, Stderr: ${res.stderr}`
      );
    } finally {
      sb.cleanup();
    }
  }

  // =========================================================================
  // CATEGORY 4: ADVERSARIAL STRESS TESTING ON OTHER DATA FILES & ASSERTIONS
  // =========================================================================
  console.log('\n▶ Category 4: Other Data Files & Assertions in scripts/verify_migration.js');

  // Subcase 4.1: Corrupt currency in shopify_export.json
  {
    const sb = createSandbox();
    try {
      const expPath = path.join(sb.tmpDir, 'data', 'shopify_export.json');
      const parsed = JSON.parse(fs.readFileSync(expPath, 'utf8'));
      parsed.shop.currency = 'USD';
      fs.writeFileSync(expPath, JSON.stringify(parsed, null, 2), 'utf8');
      const res = runScript(sb.tmpDir);
      recordResult(
        'Altered currency in shopify_export.json (USD) -> FAIL (exit 1)',
        'Negative_ShopifyExport',
        res.status === 1 && res.combined.includes('[FAIL] Store currency is INR'),
        `Status: ${res.status}, Combined: ${res.combined}`
      );
    } finally {
      sb.cleanup();
    }
  }

  // Subcase 4.2: Truncate products in shopify_export.json (8 instead of 9)
  {
    const sb = createSandbox();
    try {
      const expPath = path.join(sb.tmpDir, 'data', 'shopify_export.json');
      const parsed = JSON.parse(fs.readFileSync(expPath, 'utf8'));
      parsed.products.pop();
      fs.writeFileSync(expPath, JSON.stringify(parsed, null, 2), 'utf8');
      const res = runScript(sb.tmpDir);
      recordResult(
        'Altered product count in shopify_export.json (8) -> FAIL (exit 1)',
        'Negative_ShopifyExport',
        res.status === 1 && res.combined.includes('[FAIL] All 9 Shopify products extracted'),
        `Status: ${res.status}, Combined: ${res.combined}`
      );
    } finally {
      sb.cleanup();
    }
  }

  // Subcase 4.3: Corrupted price in woocommerce_products.csv (81500.00 altered)
  {
    const sb = createSandbox();
    try {
      const prodPath = path.join(sb.tmpDir, 'data', 'woocommerce_products.csv');
      let prodText = fs.readFileSync(prodPath, 'utf8');
      prodText = prodText.replaceAll('81500.00', '99999.00');
      fs.writeFileSync(prodPath, prodText, 'utf8');
      const res = runScript(sb.tmpDir);
      recordResult(
        'Altered Antique Venetian Cushion price in woocommerce_products.csv -> FAIL (exit 1)',
        'Negative_ProductsCSV',
        res.status === 1 && res.combined.includes('[FAIL] Antique venetian cushion price (81500.00) preserved'),
        `Status: ${res.status}, Combined: ${res.combined}`
      );
    } finally {
      sb.cleanup();
    }
  }

  // Subcase 4.4: Corrupted price for Modern Victorian in woocommerce_products.csv
  {
    const sb = createSandbox();
    try {
      const prodPath = path.join(sb.tmpDir, 'data', 'woocommerce_products.csv');
      let prodText = fs.readFileSync(prodPath, 'utf8');
      prodText = prodText.replaceAll('58787.00', '11111.00');
      fs.writeFileSync(prodPath, prodText, 'utf8');
      const res = runScript(sb.tmpDir);
      recordResult(
        'Altered Modern Victorian price in woocommerce_products.csv -> FAIL (exit 1)',
        'Negative_ProductsCSV',
        res.status === 1 && res.combined.includes('[FAIL] Modern victorian variant price (58787.00) preserved'),
        `Status: ${res.status}, Combined: ${res.combined}`
      );
    } finally {
      sb.cleanup();
    }
  }

  // Subcase 4.5: 0-byte file in assets/images/
  {
    const sb = createSandbox();
    try {
      const firstImg = fs.readdirSync(path.join(sb.tmpDir, 'assets', 'images'))[0];
      const targetImg = path.join(sb.tmpDir, 'assets', 'images', firstImg);
      fs.writeFileSync(targetImg, Buffer.alloc(0));
      const res = runScript(sb.tmpDir);
      recordResult(
        '0-byte file placed in assets/images/ -> FAIL (validSizes fails, exit 1)',
        'Negative_Images',
        res.status === 1 && res.combined.includes('[FAIL] All 27 image files have valid, non-zero file sizes on disk'),
        `Status: ${res.status}, Combined: ${res.combined}`
      );
    } finally {
      sb.cleanup();
    }
  }

  // Subcase 4.6: Image count reduced (26 instead of 27)
  {
    const sb = createSandbox();
    try {
      const firstImg = fs.readdirSync(path.join(sb.tmpDir, 'assets', 'images'))[0];
      const targetImg = path.join(sb.tmpDir, 'assets', 'images', firstImg);
      fs.unlinkSync(targetImg);
      const res = runScript(sb.tmpDir);
      recordResult(
        'Image removed (26 images) -> FAIL (count assertion fails, exit 1)',
        'Negative_Images',
        res.status === 1 && res.combined.includes('[FAIL] All 27 high-res mirror product images downloaded locally (found 26)'),
        `Status: ${res.status}, Combined: ${res.combined}`
      );
    } finally {
      sb.cleanup();
    }
  }

  // Subcase 4.7: Missing data/shopify_export.json
  {
    const sb = createSandbox();
    try {
      fs.unlinkSync(path.join(sb.tmpDir, 'data', 'shopify_export.json'));
      const res = runScript(sb.tmpDir);
      recordResult(
        'Missing data/shopify_export.json -> FAIL (fails/throws, exit non-zero)',
        'Negative_ShopifyExport',
        res.status !== 0,
        `Status: ${res.status}, Combined: ${res.combined}`
      );
    } finally {
      sb.cleanup();
    }
  }

  // Subcase 4.8: Missing data/woocommerce_categories.csv
  {
    const sb = createSandbox();
    try {
      fs.unlinkSync(path.join(sb.tmpDir, 'data', 'woocommerce_categories.csv'));
      const res = runScript(sb.tmpDir);
      recordResult(
        'Missing data/woocommerce_categories.csv -> FAIL (fails/throws, exit non-zero)',
        'Negative_CategoriesCSV',
        res.status !== 0,
        `Status: ${res.status}, Combined: ${res.combined}`
      );
    } finally {
      sb.cleanup();
    }
  }

  // Subcase 4.9: Missing data/woocommerce_products.csv
  {
    const sb = createSandbox();
    try {
      fs.unlinkSync(path.join(sb.tmpDir, 'data', 'woocommerce_products.csv'));
      const res = runScript(sb.tmpDir);
      recordResult(
        'Missing data/woocommerce_products.csv -> FAIL (fails/throws, exit non-zero)',
        'Negative_ProductsCSV',
        res.status !== 0,
        `Status: ${res.status}, Combined: ${res.combined}`
      );
    } finally {
      sb.cleanup();
    }
  }

  // =========================================================================
  // CATEGORY 5: LINE-ENDING FRAGILITY IN OTHER CSV FILES (CRITIC STRESS DIMENSION)
  // =========================================================================
  console.log('\n▶ Category 5: Line-Ending Fragility Inspection in woocommerce_categories.csv & woocommerce_products.csv');

  // Subcase 5.1: LF line endings on woocommerce_categories.csv
  {
    const sb = createSandbox();
    try {
      const catPath = path.join(sb.tmpDir, 'data', 'woocommerce_categories.csv');
      const catText = fs.readFileSync(catPath, 'utf8');
      // Convert CRLF to LF
      const lfCat = catText.replace(/\r\n/g, '\n');
      fs.writeFileSync(catPath, lfCat, 'utf8');
      const res = runScript(sb.tmpDir);
      // In verify_migration.js: const catContent = fs.readFileSync(catPath, 'utf8').trim().split('\r\n');
      // If converted to LF, split('\r\n') gives length 1, not 6!
      const failedAsExpected = res.status === 1 && res.combined.includes('[FAIL] Categories CSV contains 1 header + 5 category rows');
      recordResult(
        'woocommerce_categories.csv converted to LF fails under split(\'\\r\\n\') (known fragility)',
        'Critic_Fragility',
        failedAsExpected,
        `If LF used, split('\\r\\n') causes assertion failure. Status: ${res.status}`
      );
    } finally {
      sb.cleanup();
    }
  }

  // Subcase 5.2: woocommerce_products.csv with LF-only line breaks
  {
    const sb = createSandbox();
    try {
      const prodPath = path.join(sb.tmpDir, 'data', 'woocommerce_products.csv');
      const prodText = fs.readFileSync(prodPath, 'utf8');
      const lfProd = prodText.replace(/\r\n/g, '\n');
      fs.writeFileSync(prodPath, lfProd, 'utf8');
      const res = runScript(sb.tmpDir);
      const failedAsExpected = res.status === 1 && res.combined.includes('[FAIL] Products CSV contains 1 header + 13 product rows');
      recordResult(
        'woocommerce_products.csv converted to LF-only fails under split(\'\\r\\n\') (known fragility)',
        'Critic_Fragility',
        failedAsExpected,
        `If LF used, split('\\r\\n') causes assertion failure. Status: ${res.status}`
      );
    } finally {
      sb.cleanup();
    }
  }

  // =========================================================================
  // SUMMARY REPORT
  // =========================================================================
  console.log('\n======================================================================');
  console.log(`STRESS TEST SUMMARY: ${passedTests} / ${totalTests} TESTS PASSED (${((passedTests/totalTests)*100).toFixed(1)}%)`);
  if (failedTests > 0) {
    console.error(`FAILED TESTS: ${failedTests}`);
  }
  console.log('======================================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runAllTests().catch(err => {
  console.error('Fatal stress test error:', err);
  process.exit(1);
});
