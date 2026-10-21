import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const rootDir = path.resolve(__dirname, '..', '..');

export class TestHarness {
  constructor(tierName) {
    this.tierName = tierName;
    this.currentSuite = 'General';
    this.currentTest = 'Default';
    this.assertions = [];
    this.tests = [];
    this.passedCount = 0;
    this.failedCount = 0;
    this.startTime = Date.now();
  }

  suite(name, fn) {
    this.currentSuite = name;
    if (typeof fn === 'function') {
      fn();
    }
  }

  test(name, fn) {
    this.currentTest = name;
    const testRecord = {
      suite: this.currentSuite,
      name,
      assertions: [],
      passed: true,
      error: null
    };

    try {
      const result = fn();
      if (result && typeof result.then === 'function') {
        return result.then(() => {
          this.tests.push(testRecord);
          return testRecord;
        }).catch(err => {
          testRecord.passed = false;
          testRecord.error = err.message;
          this.assert(false, `Unhandled test error in "${name}": ${err.message}`);
          this.tests.push(testRecord);
          return testRecord;
        });
      }
      this.tests.push(testRecord);
      return testRecord;
    } catch (err) {
      testRecord.passed = false;
      testRecord.error = err.message;
      this.assert(false, `Unhandled exception in "${name}": ${err.message}`);
      this.tests.push(testRecord);
      return testRecord;
    }
  }

  assert(condition, message, details = '') {
    const record = {
      tier: this.tierName,
      suite: this.currentSuite,
      test: this.currentTest,
      passed: Boolean(condition),
      message,
      details: details ? String(details) : ''
    };

    this.assertions.push(record);
    if (record.passed) {
      this.passedCount++;
    } else {
      this.failedCount++;
    }
    return record.passed;
  }

  assertEqual(actual, expected, message) {
    const passed = actual === expected;
    const details = passed ? '' : `Expected [${expected}] but got [${actual}]`;
    return this.assert(passed, message, details);
  }

  assertDeepEqual(actual, expected, message) {
    const actualStr = JSON.stringify(actual);
    const expectedStr = JSON.stringify(expected);
    const passed = actualStr === expectedStr;
    const details = passed ? '' : `Expected ${expectedStr} but got ${actualStr}`;
    return this.assert(passed, message, details);
  }

  assertMatches(value, regex, message) {
    const r = typeof regex === 'string' ? new RegExp(regex) : regex;
    const passed = r.test(String(value));
    const details = passed ? '' : `Value "${value}" did not match pattern ${regex}`;
    return this.assert(passed, message, details);
  }

  assertDoesNotMatch(value, regex, message) {
    const r = typeof regex === 'string' ? new RegExp(regex) : regex;
    const passed = !r.test(String(value));
    const details = passed ? '' : `Value "${value}" unexpectedly matched pattern ${regex}`;
    return this.assert(passed, message, details);
  }

  assertInRange(value, min, max, message) {
    const num = Number(value);
    const passed = num >= min && num <= max;
    const details = passed ? '' : `Value ${value} is out of expected range [${min}, ${max}]`;
    return this.assert(passed, message, details);
  }

  getReport() {
    const durationMs = Date.now() - this.startTime;
    return {
      tier: this.tierName,
      totalAssertions: this.assertions.length,
      passedAssertions: this.passedCount,
      failedAssertions: this.failedCount,
      durationMs,
      passRate: this.assertions.length > 0 ? ((this.passedCount / this.assertions.length) * 100).toFixed(2) + '%' : '0%',
      failures: this.assertions.filter(a => !a.passed)
    };
  }

  printSummary() {
    const r = this.getReport();
    console.log(`\n======================================================`);
    console.log(`📊 ${this.tierName} SUMMARY`);
    console.log(`======================================================`);
    console.log(`Total Assertions:  ${r.totalAssertions}`);
    console.log(`Passed:            ${r.passedAssertions} (${r.passRate})`);
    console.log(`Failed:            ${r.failedAssertions}`);
    console.log(`Duration:          ${r.durationMs}ms`);

    if (r.failedAssertions > 0) {
      console.log(`\n❌ FAILURES (${r.failedAssertions}):`);
      r.failures.slice(0, 15).forEach((f, i) => {
        console.log(`  ${i + 1}. [${f.suite} > ${f.test}] ${f.message}`);
        if (f.details) console.log(`     Details: ${f.details}`);
      });
      if (r.failures.length > 15) {
        console.log(`  ... and ${r.failures.length - 15} more failures.`);
      }
    }
    console.log(`======================================================\n`);
  }
}

// Utility functions
export function loadEnvFile() {
  const envPath = path.join(rootDir, '.env');
  const env = {};
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const idx = trimmed.indexOf('=');
        if (idx !== -1) {
          let val = trimmed.slice(idx + 1).trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          }
          env[trimmed.slice(0, idx).trim()] = val;
        }
      }
    }
  }
  return env;
}

export function computeHmacSha256(data, secret) {
  return crypto.createHmac('sha256', secret).update(data).digest('hex');
}
