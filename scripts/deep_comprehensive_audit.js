import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const outDir = 'audit_evidence/site_wide_audit';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

async function runComprehensiveAudit() {
  console.log('=== STARTING SITE-WIDE COMPREHENSIVE UI/UX & BUG AUDIT ===\n');

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-blink-features=AutomationControlled']
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36');

  const findings = [];

  // Helper to audit a URL
  async function auditUrl(url, label) {
    console.log(`\n--- Auditing ${label} (${url}) ---`);
    const consoleErrors = [];
    const consoleHandler = msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    };
    page.on('console', consoleHandler);

    // Desktop
    await page.setViewport({ width: 1440, height: 900 });
    const res = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 35000 });
    await new Promise(r => setTimeout(r, 4000));

    const status = res ? res.status() : 0;

    const desktopData = await page.evaluate(() => {
      const bodyBg = window.getComputedStyle(document.body).backgroundColor;
      const title = document.title;
      const h1s = Array.from(document.querySelectorAll('h1')).map(h => ({
        text: h.innerText.trim(),
        color: window.getComputedStyle(h).color,
        fontFamily: window.getComputedStyle(h).fontFamily
      }));

      // Find dark navy or dark black backgrounds
      const darkBgElements = Array.from(document.querySelectorAll('div, section, article, main')).filter(el => {
        const bg = window.getComputedStyle(el).backgroundColor;
        const bi = window.getComputedStyle(el).backgroundImage;
        const isDark = (
          bg.includes('26, 34, 51') || 
          bg.includes('18, 23, 34') || 
          bg.includes('20, 25, 36') || 
          bg.includes('16, 21, 32') ||
          bg.includes('12, 17, 26') ||
          bg.includes('6, 9, 14') ||
          bi.includes('1a2233') ||
          bi.includes('0c111a') ||
          bi.includes('06090e') ||
          bi.includes('141924')
        );
        return isDark;
      }).map(el => ({
        tag: el.tagName,
        className: el.className,
        style: el.getAttribute('style')?.substring(0, 100)
      }));

      // Find white or low contrast text on light background
      const whiteTextOnLight = Array.from(document.querySelectorAll('p, span, h1, h2, h3, h4, li, div')).filter(el => {
        if (el.children.length > 0) return false;
        const color = window.getComputedStyle(el).color;
        const text = el.innerText?.trim();
        if (!text || text.length < 2) return false;
        // White or slate #cbd5e1 on ivory
        const isWhiteOrSlate = color === 'rgb(255, 255, 255)' || color === 'rgb(203, 213, 225)' || color === 'rgb(148, 163, 184)';
        return isWhiteOrSlate;
      }).slice(0, 5).map(el => ({
        text: el.innerText.substring(0, 50),
        color: window.getComputedStyle(el).color
      }));

      // Check broken images
      const brokenImages = Array.from(document.querySelectorAll('img')).filter(img => {
        return !img.complete || img.naturalWidth === 0;
      }).map(img => img.src);

      return {
        title,
        status,
        bodyBg,
        h1s,
        darkBgCount: darkBgElements.length,
        darkBgSamples: darkBgElements.slice(0, 3),
        whiteTextOnLightCount: whiteTextOnLight.length,
        whiteTextSamples: whiteTextOnLight,
        brokenImagesCount: brokenImages.length,
        brokenImagesSamples: brokenImages.slice(0, 3)
      };
    });

    const screenshotDesktop = `${label}_desktop.png`;
    await page.screenshot({ path: path.join(outDir, screenshotDesktop), fullPage: true });

    // Mobile (375px)
    await page.setViewport({ width: 375, height: 812 });
    await new Promise(r => setTimeout(r, 1200));

    const mobileData = await page.evaluate(() => {
      // Check horizontal overflow
      const docWidth = document.documentElement.offsetWidth;
      const scrollWidth = document.documentElement.scrollWidth;
      const hasHorizontalOverflow = scrollWidth > docWidth;

      // Check mobile hamburger menu presence
      const hamburger = document.querySelector('.main-header-menu-toggle, .ast-mobile-menu-trigger-minimal, button[aria-label="Main Menu"], .menu-toggle');
      return {
        hasHorizontalOverflow,
        scrollWidth,
        docWidth,
        hasHamburger: !!hamburger
      };
    });

    const screenshotMobile = `${label}_mobile.png`;
    await page.screenshot({ path: path.join(outDir, screenshotMobile), fullPage: true });

    page.off('console', consoleHandler);

    const result = {
      label,
      url,
      httpStatus: status,
      desktop: desktopData,
      mobile: mobileData,
      consoleErrors
    };

    findings.push(result);
    console.log(`Finished ${label}: darkBg=${desktopData.darkBgCount}, whiteTextOnLight=${desktopData.whiteTextOnLightCount}, horizontalOverflow=${mobileData.hasHorizontalOverflow}`);
  }

  // 1. Audit Contact Page
  await auditUrl('https://reflectionelite.com/contact/', 'contact_page');

  // 2. Audit Privacy Policy
  await auditUrl('https://reflectionelite.com/privacy-policy-2/', 'privacy_policy_page');

  // 3. Audit Refund & Returns
  await auditUrl('https://reflectionelite.com/refund_returns-2/', 'refund_returns_page');

  // 4. Audit Single Product (Simple)
  await auditUrl('https://reflectionelite.com/product/antique-venetian-cushion/', 'product_antique_cushion');

  // 5. Audit Single Product (Variable)
  await auditUrl('https://reflectionelite.com/product/mosaic-mirror-art/', 'product_mosaic_art');

  // 6. Audit Cart
  await auditUrl('https://reflectionelite.com/cart/', 'cart_page');

  // 7. Audit Checkout
  await auditUrl('https://reflectionelite.com/checkout/', 'checkout_page');

  // 8. Audit My Account
  await auditUrl('https://reflectionelite.com/my-account/', 'my_account_page');

  // 9. Audit Mobile Navigation Drawer Interaction
  console.log('\n--- Auditing Mobile Navigation Drawer ---');
  await page.setViewport({ width: 375, height: 812 });
  await page.goto('https://reflectionelite.com/', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 4000));

  const mobileNavAudit = await page.evaluate(async () => {
    const trigger = document.querySelector('.main-header-menu-toggle, .menu-toggle, .ast-mobile-menu-trigger-minimal, button.ast-menu-toggle');
    if (!trigger) return { triggerFound: false };

    trigger.click();
    await new Promise(r => setTimeout(r, 600));

    const drawer = document.querySelector('.main-navigation, .ast-mobile-header-wrap, .ast-mobile-menu-buttons, #ast-mobile-header');
    const drawerBg = drawer ? window.getComputedStyle(drawer).backgroundColor : '';
    const links = Array.from(document.querySelectorAll('.ast-mobile-header-wrap a, .main-header-menu a')).map(a => ({
      text: a.innerText.trim(),
      href: a.href,
      color: window.getComputedStyle(a).color
    }));

    return {
      triggerFound: true,
      drawerBg,
      linksSample: links.slice(0, 8)
    };
  });

  await page.screenshot({ path: path.join(outDir, 'mobile_menu_open.png') });
  console.log('Mobile Nav Audit:', JSON.stringify(mobileNavAudit, null, 2));

  // Save all findings to JSON
  fs.writeFileSync('audit_evidence/site_wide_audit_findings.json', JSON.stringify(findings, null, 2));
  console.log('\n=== ALL AUDITS COMPLETED! Saved to audit_evidence/site_wide_audit_findings.json ===');

  await browser.close();
}

runComprehensiveAudit().catch(console.error);
