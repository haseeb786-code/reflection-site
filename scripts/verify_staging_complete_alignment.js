import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\haseeb\\.gemini\\antigravity\\brain\\414d7e40-4d4d-49c9-8868-01c3c84a4783';

async function saveScreenshot(page, filename) {
  const localPath = path.resolve(filename);
  const artifactPath = path.join(ARTIFACT_DIR, filename);
  await page.screenshot({ path: localPath, fullPage: false });
  try {
    fs.copyFileSync(localPath, artifactPath);
  } catch (e) {
    console.error('Error copying artifact:', e.message);
  }
  console.log(`✓ Screenshot saved: ${filename}`);
}

async function verifyStaging() {
  console.log('=== FINAL COMPREHENSIVE STRUCTURAL VERIFICATION OF STAGING SITE ===');
  console.log('Target: https://reflectionelite.ataanalytiq.com\n');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36');

  const pages = [
    {
      category: 'Home',
      url: 'https://reflectionelite.ataanalytiq.com/',
      screenshot: 'staging_aligned_01_home.png'
    },
    {
      category: 'Shop / Collection',
      url: 'https://reflectionelite.ataanalytiq.com/shop/',
      screenshot: 'staging_aligned_02_shop.png'
    },
    {
      category: 'Single Product (Showcase)',
      url: 'https://reflectionelite.ataanalytiq.com/product/?prod=murana-mirror',
      screenshot: 'staging_aligned_03_product_murana.png'
    },
    {
      category: 'About Us',
      url: 'https://reflectionelite.ataanalytiq.com/about-us/',
      screenshot: 'staging_aligned_04_about.png'
    },
    {
      category: 'Contact',
      url: 'https://reflectionelite.ataanalytiq.com/contact/',
      screenshot: 'staging_aligned_05_contact.png'
    },
    {
      category: 'Privacy Policy',
      url: 'https://reflectionelite.ataanalytiq.com/privacy-policy-2/',
      screenshot: 'staging_aligned_06_privacy.png'
    },
    {
      category: 'Refund Policy',
      url: 'https://reflectionelite.ataanalytiq.com/refund-policy/',
      screenshot: 'staging_aligned_07_refund.png'
    },
    {
      category: 'Shipping Policy',
      url: 'https://reflectionelite.ataanalytiq.com/shipping-policy/',
      screenshot: 'staging_aligned_08_shipping.png'
    },
    {
      category: 'Terms of Service',
      url: 'https://reflectionelite.ataanalytiq.com/terms-of-service/',
      screenshot: 'staging_aligned_09_terms.png'
    },
    {
      category: 'Cart',
      url: 'https://reflectionelite.ataanalytiq.com/cart/',
      screenshot: 'staging_aligned_10_cart.png'
    },
    {
      category: 'Book Survey / Custom Dimensions',
      url: 'https://reflectionelite.ataanalytiq.com/custom-dimensions/',
      screenshot: 'staging_aligned_11_book_survey.png'
    }
  ];

  const report = [];

  for (const item of pages) {
    console.log(`\n------------------------------------------------------------`);
    console.log(`Verifying ${item.category} (${item.url})...`);

    const res = await page.goto(item.url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await new Promise(r => setTimeout(r, 2500));

    const status = res ? res.status() : 0;
    const title = await page.title();

    const evaluation = await page.evaluate(() => {
      // 1. Top Banner
      const bannerEl = document.querySelector('.announcement-bar, .top-bar, .top-banner');
      const bannerText = bannerEl ? bannerEl.innerText.trim() : 'MISSING';
      const isBannerVisible = bannerEl ? window.getComputedStyle(bannerEl).display !== 'none' : false;

      // 2. Logo
      const logoEl = document.querySelector('.header-logo, .site-logo, .custom-logo, img[alt*="Reflection"]');
      const isLogoPresent = !!logoEl;
      const logoHtml = logoEl ? logoEl.outerHTML.slice(0, 160) : 'MISSING';

      // 3. Navigation Links
      const navEls = Array.from(document.querySelectorAll('nav a, .main-nav a, .nav-desktop a'));
      const navLinks = navEls.map(a => ({
        label: a.innerText.trim(),
        href: a.getAttribute('href')
      })).filter(x => x.label.length > 0);

      // 4. Action Button / Book Survey
      const actionBtn = document.querySelector('.header-quote-btn, .btn-action, .header-actions a');
      const actionDetails = actionBtn ? {
        label: actionBtn.innerText.trim(),
        href: actionBtn.getAttribute('href')
      } : null;

      return {
        bannerText,
        isBannerVisible,
        isLogoPresent,
        logoHtml,
        navLinks,
        actionDetails
      };
    });

    const isBannerCorrect = evaluation.bannerText.includes('Complimentary Insured White-Glove Logistics & Laser Templating Across India');
    const isBookSurveyLinked = evaluation.actionDetails?.href?.includes('custom-dimensions') || evaluation.actionDetails?.label === 'BOOK SURVEY';

    const itemResult = {
      category: item.category,
      url: item.url,
      httpStatus: status,
      title: title,
      bannerVisible: evaluation.isBannerVisible,
      bannerText: evaluation.bannerText,
      bannerAlignedWithLive: isBannerCorrect,
      logoPresent: evaluation.isLogoPresent,
      navLinksCount: evaluation.navLinks.length,
      actionButton: evaluation.actionDetails,
      screenshot: item.screenshot
    };

    report.push(itemResult);

    console.log(`  HTTP Status: ${status} (Expected 200)`);
    console.log(`  Title: "${title}"`);
    console.log(`  Top Banner Visible: ${evaluation.isBannerVisible} | Text Matches Live: ${isBannerCorrect}`);
    console.log(`  Banner Text: "${evaluation.bannerText}"`);
    console.log(`  Logo Present: ${evaluation.isLogoPresent}`);
    console.log(`  Nav Links Count: ${evaluation.navLinks.length}`);
    console.log(`  Action Button: ${JSON.stringify(evaluation.actionDetails)}`);

    await saveScreenshot(page, item.screenshot);
  }

  await browser.close();

  fs.writeFileSync('staging_final_alignment_report.json', JSON.stringify(report, null, 2));
  console.log('\n=== STAGING STRUCTURAL VERIFICATION COMPLETE ===');
  console.log('Results saved to staging_final_alignment_report.json');
}

verifyStaging().catch(console.error);
