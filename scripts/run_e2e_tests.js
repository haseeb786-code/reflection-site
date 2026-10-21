#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { runTier1Tests } from '../tests/e2e/tier1_feature_coverage.test.js';
import { runTier2Tests } from '../tests/e2e/tier2_boundary_corner.test.js';
import { runTier3Tests } from '../tests/e2e/tier3_cross_feature.test.js';
import { runTier4Tests } from '../tests/e2e/tier4_real_world_scenarios.test.js';
import { runLiveIntegrationTests } from '../tests/e2e/live_integration.test.js';
import { loadEnvFile, rootDir } from '../tests/e2e/test_framework.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log(`\n======================================================================`);
  console.log(`🚀 REFLECTION ELITE — OPAQUE-BOX E2E TEST RUNNER`);
  console.log(`   Derived strictly from ORIGINAL_REQUEST.md & PROJECT.md`);
  console.log(`======================================================================\n`);

  const args = process.argv.slice(2);
  const tierArg = args.find(a => a.startsWith('--tier='));
  const targetTier = tierArg ? parseInt(tierArg.split('=')[1], 10) : null;
  const isLiveRequested = args.includes('--live');

  const startTime = Date.now();
  const harnesses = [];

  // Run Tiers
  if (!targetTier || targetTier === 1) {
    console.log(`▶ Executing Tier 1: Feature Coverage (Features 1-36)...`);
    const h1 = await runTier1Tests();
    harnesses.push(h1);
  }

  if (!targetTier || targetTier === 2) {
    console.log(`▶ Executing Tier 2: Boundary Value Analysis & Corner Cases...`);
    const h2 = await runTier2Tests();
    harnesses.push(h2);
  }

  if (!targetTier || targetTier === 3) {
    console.log(`▶ Executing Tier 3: Cross-Feature Combinations & Interactions...`);
    const h3 = await runTier3Tests();
    harnesses.push(h3);
  }

  if (!targetTier || targetTier === 4) {
    console.log(`▶ Executing Tier 4: Real-World Shopping Scenarios...`);
    const h4 = await runTier4Tests();
    harnesses.push(h4);
  }

  if (isLiveRequested) {
    console.log(`▶ Executing Live Integration Audit against WordPress Host...`);
    const hLive = await runLiveIntegrationTests();
    harnesses.push(hLive);
  }

  // Print summaries for each tier
  for (const h of harnesses) {
    h.printSummary();
  }

  // Grand totals
  let totalAssertions = 0;
  let totalPassed = 0;
  let totalFailed = 0;

  const tierBreakdown = harnesses.map(h => {
    const rep = h.getReport();
    totalAssertions += rep.totalAssertions;
    totalPassed += rep.passedAssertions;
    totalFailed += rep.failedAssertions;
    return rep;
  });

  const durationMs = Date.now() - startTime;
  const passRate = totalAssertions > 0 ? ((totalPassed / totalAssertions) * 100).toFixed(2) + '%' : '0%';

  console.log(`======================================================================`);
  console.log(`🏆 OVERALL E2E TEST EXECUTION SUMMARY`);
  console.log(`======================================================================`);
  console.log(`Total Assertions Executed: ${totalAssertions}  (Target Minimum: 414)`);
  console.log(`Total Assertions Passed:   ${totalPassed} (${passRate})`);
  console.log(`Total Assertions Failed:   ${totalFailed}`);
  console.log(`Execution Time:            ${durationMs}ms`);
  console.log(`----------------------------------------------------------------------`);
  console.log(`TIER BREAKDOWN:`);

  const tierTargets = {
    'Tier 1: Feature Coverage (Features 1-36)': 180,
    'Tier 2: Boundary Value Analysis & Corner Cases': 180,
    'Tier 3: Cross-Feature Combinations & Pairwise Interactions': 36,
    'Tier 4: Real-World Shopping Scenarios': 18
  };

  for (const tb of tierBreakdown) {
    const target = tierTargets[tb.tier] || 0;
    const meetsTarget = tb.totalAssertions >= target ? '✅ MEETS TARGET' : '⚠️ BELOW TARGET';
    console.log(` - ${tb.tier}:`);
    console.log(`     Assertions: ${tb.totalAssertions} / ${target} target [${meetsTarget}]`);
    console.log(`     Passed: ${tb.passedAssertions} | Failed: ${tb.failedAssertions}`);
  }
  console.log(`======================================================================\n`);

  // Save report to data/
  const reportData = {
    timestamp: new Date().toISOString(),
    totalAssertions,
    totalPassed,
    totalFailed,
    passRate,
    durationMs,
    tiers: tierBreakdown
  };

  const reportJsonPath = path.join(rootDir, 'data', 'e2e_test_report.json');
  fs.writeFileSync(reportJsonPath, JSON.stringify(reportData, null, 2), 'utf8');

  // Save markdown report
  const mdLines = [
    '# Reflection Elite: E2E Test Suite Execution Report',
    `- **Date**: ${reportData.timestamp}`,
    `- **Total Assertions**: ${totalAssertions} (Target: ≥414)`,
    `- **Passed**: ${totalPassed} (${passRate})`,
    `- **Failed**: ${totalFailed}`,
    `- **Execution Time**: ${durationMs}ms`,
    '',
    '## Tier Coverage Summary',
    '| Tier | Name | Assertions | Target | Passed | Failed | Status |',
    '| :---: | :--- | :---: | :---: | :---: | :---: | :---: |'
  ];

  tierBreakdown.forEach((tb, idx) => {
    const target = tierTargets[tb.tier] || 0;
    const status = tb.totalAssertions >= target && tb.failedAssertions === 0 ? '✅ PASS' : (tb.failedAssertions > 0 ? '❌ FAIL' : '⚠️ UNDER-TARGET');
    mdLines.push(`| T${idx + 1} | ${tb.tier} | ${tb.totalAssertions} | ${target} | ${tb.passedAssertions} | ${tb.failedAssertions} | ${status} |`);
  });

  mdLines.push('');
  mdLines.push('## Verification Instructions');
  mdLines.push('```bash');
  mdLines.push('node scripts/run_e2e_tests.js');
  mdLines.push('```');

  const reportMdPath = path.join(rootDir, 'data', 'e2e_test_report.md');
  fs.writeFileSync(reportMdPath, mdLines.join('\n'), 'utf8');
  console.log(`📝 Reports written to:`);
  console.log(`   - ${reportJsonPath}`);
  console.log(`   - ${reportMdPath}\n`);

  if (totalFailed > 0) {
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Fatal Test Runner Error:', err);
  process.exit(1);
});
