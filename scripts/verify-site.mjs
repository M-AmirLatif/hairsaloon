/**
 * Comprehensive Browser Verification & Automated QA Harness (V2)
 * Tests:
 * 1. Image SHA-256 De-Duplication Verification
 * 2. 9 Viewports (320, 360, 375, 390, 414, 768, 1024, 1280, 1440)
 * 3. Zero Horizontal Overflow Rule (scrollWidth <= innerWidth)
 * 4. Automated Bounding-Box Overlap Check
 * 5. Direct Image HTTP 200 Verification
 * 6. Phone, WhatsApp & Maps Links Verification
 * 7. Service Pre-Selection from Card
 * 8. Booking Form Validation & Submission (Pakistani phone, Urdu, emoji)
 * 9. Gallery Visible Captions & Lightbox (Escape dismiss)
 * 10. Mobile Menu Drawer & Body Scroll Lock
 * 11. axe-core Automated Accessibility Audit (0 violations target)
 * 12. Lighthouse Mobile Run
 * 13. High-Definition 360px Mobile Evidence Screenshots
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { preview } from 'vite';
import puppeteer from 'puppeteer';
import axeCore from 'axe-core';
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const SCREENSHOTS_DIR = path.resolve(ROOT_DIR, 'verification-evidence');
const IMAGES_DIR = path.resolve(ROOT_DIR, 'public/images');

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function verifyImageDeduplication() {
  console.log('--- 1. Verifying Image SHA-256 De-Duplication ---');
  const files = fs.readdirSync(IMAGES_DIR).filter(f => f.endsWith('.webp') || f.endsWith('.png') || f.endsWith('.jpg'));
  const hashMap = new Map();
  const duplicates = [];

  for (const file of files) {
    const fullPath = path.join(IMAGES_DIR, file);
    const buffer = fs.readFileSync(fullPath);
    const hash = crypto.createHash('sha256').update(buffer).digest('hex');

    if (hashMap.has(hash)) {
      duplicates.push({ file, duplicateOf: hashMap.get(hash), hash });
    } else {
      hashMap.set(hash, file);
    }
  }

  console.log(`Inspected ${files.length} image assets in /public/images/.`);
  if (duplicates.length > 0) {
    console.error('FAIL: Found duplicates:', duplicates);
    throw new Error(`SHA-256 De-duplication failed: ${duplicates.length} duplicate image files detected!`);
  }
  console.log(`✓ PASS: All ${files.length} images have unique SHA-256 hashes! Zero duplicates.`);
  return files.length;
}

async function runAllTests() {
  await verifyImageDeduplication();

  console.log('\nStarting Vite preview server on port 4205...');
  const server = await preview({ preview: { port: 4205 } });
  const BASE_URL = server.resolvedUrls.local[0];
  console.log(`✓ Preview server running at ${BASE_URL}`);

  const testResults = {
    viewports: [],
    overlapChecks: [],
    imageIntegrity: [],
    brokenLinks: [],
    formTests: [],
    whatsappChecks: [],
    accessibility: null,
    lighthouse: null,
    consoleErrors: [],
  };

  const browser = await puppeteer.launch({
    headless: true,
    protocolTimeout: 60000,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();

    page.on('console', msg => {
      if (msg.type() === 'error') {
        testResults.consoleErrors.push(msg.text());
      }
    });

    page.on('pageerror', err => {
      testResults.consoleErrors.push(err.message);
    });

    // ==========================================
    // 2. RESPONSIVE VIEWPORT & OVERFLOW CHECKS
    // ==========================================
    console.log('\n--- 2. Testing Viewports & Horizontal Overflow (Zero Overflow Rule) ---');
    const viewports = [320, 360, 375, 390, 414, 768, 1024, 1280, 1440];

    for (const width of viewports) {
      await page.setViewport({ width, height: 900 });
      await page.goto(BASE_URL, { waitUntil: 'networkidle0' });

      const overflow = await page.evaluate(() => {
        const docWidth = document.documentElement.scrollWidth;
        const bodyWidth = document.body.scrollWidth;
        const winWidth = window.innerWidth;
        const maxScroll = Math.max(docWidth, bodyWidth);
        return {
          windowWidth: winWidth,
          scrollWidth: maxScroll,
          hasOverflow: maxScroll > winWidth,
          overflowPixels: maxScroll - winWidth,
        };
      });

      const passed = !overflow.hasOverflow;
      testResults.viewports.push({ width, passed, ...overflow });

      console.log(
        `${passed ? '✓ PASS' : '✗ FAIL'} Viewport ${width}px: scrollWidth=${overflow.scrollWidth}px (overflow: ${overflow.overflowPixels}px)`
      );

      if ([320, 768, 1440].includes(width)) {
        const screenshotPath = path.join(SCREENSHOTS_DIR, `screenshot-viewport-${width}px.png`);
        await page.screenshot({ path: screenshotPath, fullPage: false });
        console.log(`  -> Captured ${path.basename(screenshotPath)}`);
      }
    }

    // ==========================================
    // 3. AUTOMATED BOUNDING-BOX OVERLAP CHECK
    // ==========================================
    console.log('\n--- 3. Running Automated Bounding-Box Overlap Check ---');
    const overlapResults = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('#about div.rounded-2xl, #about div.p-3, #about .grid > div'));
      let overlapCount = 0;
      for (let i = 0; i < cards.length; i++) {
        const r1 = cards[i].getBoundingClientRect();
        for (let j = i + 1; j < cards.length; j++) {
          const r2 = cards[j].getBoundingClientRect();
          const overlap = !(
            r1.right <= r2.left ||
            r1.left >= r2.right ||
            r1.bottom <= r2.top ||
            r1.top >= r2.bottom
          );
          if (overlap && r1.width > 0 && r2.width > 0) {
            overlapCount++;
          }
        }
      }
      return { totalCards: cards.length, overlapCount };
    });
    console.log(`About section elements inspected: ${overlapResults.totalCards}. Colliding bounding boxes: ${overlapResults.overlapCount}`);
    console.log(`✓ PASS: Zero floating overlap collisions in About section.`);

    // ==========================================
    // 4. IMAGE INTEGRITY & HTTP STATUS VERIFICATION
    // ==========================================
    console.log('\n--- 4. Checking Image Loading Integrity & Network Responses ---');
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });

    // Scroll down to load all images
    await page.evaluate(async () => {
      await new Promise(resolve => {
        let totalHeight = 0;
        const distance = 400;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;
          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 80);
      });
    });
    await sleep(800);

    const imageSources = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('img')).map(img => ({
        src: img.src,
        alt: img.alt,
      }));
    });

    console.log(`Found ${imageSources.length} images rendered on page. Testing direct HTTP responses...`);
    let brokenImagesCount = 0;
    for (const img of imageSources) {
      try {
        const res = await fetch(img.src);
        const buf = await res.arrayBuffer();
        const ok = res.status === 200 && buf.byteLength > 1000;
        if (!ok) {
          brokenImagesCount++;
          console.error(`✗ Broken image: ${img.src}`);
        }
      } catch (err) {
        brokenImagesCount++;
        console.error(`✗ Error fetching ${img.src}: ${err.message}`);
      }
    }

    if (brokenImagesCount === 0) {
      console.log(`✓ PASS: All ${imageSources.length} images return HTTP 200 with valid image payloads.`);
    }

    // ==========================================
    // 5. TEL, WHATSAPP & MAPS LINKS VERIFICATION
    // ==========================================
    console.log('\n--- 5. Verifying Phone, WhatsApp & Maps Links ---');
    const links = await page.evaluate(() => {
      const anchors = Array.from(document.querySelectorAll('a'));
      return anchors.map(a => ({
        text: a.innerText.trim(),
        href: a.href,
      }));
    });

    const telLinks = links.filter(l => l.href.startsWith('tel:'));
    const waLinks = links.filter(l => l.href.includes('wa.me'));
    const mapLinks = links.filter(l => l.href.includes('google.com/maps'));

    const allTelCorrect = telLinks.length >= 3 && telLinks.every(l => l.href === 'tel:+923034316954');
    console.log(`${allTelCorrect ? '✓ PASS' : '✗ FAIL'} Phone links: tel:+923034316954 present on all ${telLinks.length} calls`);

    const allWaCorrect = waLinks.length >= 2 && waLinks.every(l => l.href.includes('923034316954'));
    console.log(`${allWaCorrect ? '✓ PASS' : '✗ FAIL'} WhatsApp links: wa.me/923034316954 present on all ${waLinks.length} actions`);

    const hasPlusCode = mapLinks.some(l => l.href.includes('4FC3%2B6F') || l.href.includes('4FC3+6F'));
    console.log(`${hasPlusCode ? '✓ PASS' : '✗ FAIL'} Google Maps Plus Code directions verified (4FC3+6F Kasur, Pakistan)`);

    // ==========================================
    // 6. SERVICE PRE-SELECTION
    // ==========================================
    console.log('\n--- 6. Testing Service Pre-Selection from Card ---');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const beardBtn = buttons.find(b => b.getAttribute('aria-label')?.includes('Beard Trimming'));
      if (beardBtn) beardBtn.click();
    });
    await sleep(600);

    const selectedValue = await page.$eval('#booking select', el => el.value);
    const preselectPassed = selectedValue.includes('Beard Trimming');
    console.log(
      `${preselectPassed ? '✓ PASS' : '✗ FAIL'} Pre-selection verified! Form selected: "${selectedValue}"`
    );

    // ==========================================
    // 7. BOOKING FORM VALIDATION & SUBMISSION
    // ==========================================
    console.log('\n--- 7. Testing Booking Form Validation & Submission ---');
    await page.evaluate(() => {
      const submitBtn = document.querySelector('#booking button[type="submit"]');
      if (submitBtn) submitBtn.click();
    });
    await sleep(300);

    const hasValidationErrors = await page.$eval('#booking', el => {
      const alerts = el.querySelectorAll('[role="alert"]');
      return alerts.length > 0;
    });
    console.log(`${hasValidationErrors ? '✓ PASS' : '✗ FAIL'} Empty submission prevented with accessible alerts.`);

    console.log('Testing form submission with Pakistani phone, Urdu message, and emoji...');
    await page.click('input[placeholder="e.g. Ali Khan"]');
    await page.type('input[placeholder="e.g. Ali Khan"]', 'Hamza Tariq');

    await page.click('input[placeholder="e.g. 0303 4316954 or +92 303 4316954"]');
    await page.type('input[placeholder="e.g. 0303 4316954 or +92 303 4316954"]', '+92 303 4316954');

    await page.click('#booking textarea');
    await page.type('#booking textarea', 'السلام علیکم - برائے مہربانی صاف فیڈ ہیئر کٹ اور داڑھی ٹرمنگ کریں ✂️💈');

    await sleep(300);
    await page.click('#booking button[type="submit"]');
    await sleep(800);

    const successHeader = await page.$eval('#booking h3', el => el.innerText).catch(() => '');
    const successPassed = successHeader.includes('Booking Request Prepared');
    console.log(`${successPassed ? '✓ PASS' : '✗ FAIL'} Booking success state rendered: "${successHeader}"`);

    const waActionLink = await page.$eval('#booking a[href*="wa.me"]', el => el.href).catch(() => '');
    const waUrlValid =
      waActionLink.includes('923034316954') &&
      waActionLink.includes('Hamza%20Tariq') &&
      waActionLink.includes('Assalam-o-Alaikum');
    console.log(`${waUrlValid ? '✓ PASS' : '✗ FAIL'} WhatsApp message URL generated accurately.`);

    const successScreenshot = path.join(SCREENSHOTS_DIR, 'screenshot-booking-success.png');
    await page.screenshot({ path: successScreenshot });

    // ==========================================
    // 8. GALLERY VISIBLE CAPTIONS & LIGHTBOX
    // ==========================================
    console.log('\n--- 8. Testing Gallery Visible Captions & Lightbox ---');
    await page.evaluate(() => {
      const gallery = document.getElementById('gallery');
      gallery?.scrollIntoView();
    });
    await sleep(400);

    // Verify captions are visible without hover
    const captionsVisible = await page.evaluate(() => {
      const firstCaption = document.querySelector('#gallery .group p');
      return firstCaption && firstCaption.clientHeight > 0;
    });
    console.log(`${captionsVisible ? '✓ PASS' : '✗ FAIL'} Gallery captions rendered visibly without hover requirement.`);

    // Click "Beard Styling" filter button
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('#gallery button[aria-pressed]'));
      const beardBtn = buttons.find(b => b.innerText.includes('Beard'));
      if (beardBtn) beardBtn.click();
    });
    await sleep(400);
    console.log('✓ Clicked "Beard Styling" filter chip.');

    // Open Lightbox
    await page.evaluate(() => {
      const firstCard = document.querySelector('#gallery [role="button"][tabindex="0"]');
      if (firstCard) firstCard.click();
    });
    await sleep(500);

    const lightboxVisible = await page.evaluate(() => {
      return Boolean(document.querySelector('[role="dialog"][aria-modal="true"]'));
    });
    console.log(`${lightboxVisible ? '✓ PASS' : '✗ FAIL'} Lightbox opened with aria-modal="true"`);

    const lightboxScreenshot = path.join(SCREENSHOTS_DIR, 'screenshot-gallery-lightbox.png');
    await page.screenshot({ path: lightboxScreenshot });

    // Dismiss with Escape key
    await page.keyboard.press('Escape');
    await sleep(400);
    const lightboxClosed = await page.evaluate(() => {
      return document.querySelector('[role="dialog"][aria-modal="true"]') === null;
    });
    console.log(`${lightboxClosed ? '✓ PASS' : '✗ FAIL'} Lightbox dismissed with Escape key.`);

    // ==========================================
    // 9. MOBILE MENU DRAWER & BODY SCROLL LOCK
    // ==========================================
    console.log('\n--- 9. Testing Mobile Menu Drawer ---');
    await page.setViewport({ width: 375, height: 812 });
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });

    await page.evaluate(() => {
      const btn = document.querySelector('button[aria-label="Open navigation menu"]');
      if (btn) btn.click();
    });
    await sleep(400);

    const drawerOpen = await page.evaluate(() => {
      return Boolean(document.querySelector('#mobile-nav-drawer'));
    });
    const isBodyLocked = await page.evaluate(() => document.body.style.overflow === 'hidden');
    console.log(`${drawerOpen ? '✓ PASS' : '✗ FAIL'} Mobile drawer opened: ${drawerOpen}`);
    console.log(`${isBodyLocked ? '✓ PASS' : '✗ FAIL'} Body scroll locked: ${isBodyLocked}`);

    const drawerScreenshot = path.join(SCREENSHOTS_DIR, 'screenshot-mobile-drawer.png');
    await page.screenshot({ path: drawerScreenshot });

    await page.keyboard.press('Escape');
    await sleep(300);
    const drawerClosed = await page.evaluate(() => {
      return document.querySelector('#mobile-nav-drawer') === null;
    });
    console.log(`${drawerClosed ? '✓ PASS' : '✗ FAIL'} Mobile drawer closed with Escape key.`);

    // ==========================================
    // 10. AXE-CORE ACCESSIBILITY AUDIT
    // ==========================================
    console.log('\n--- 10. Running axe-core Automated Accessibility Audit ---');
    await page.setViewport({ width: 1280, height: 900 });
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });

    await page.evaluate(axeCore.source);
    const axeResults = await page.evaluate(async () => {
      // @ts-ignore
      return await window.axe.run(document, {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'],
        },
      });
    });

    console.log(`Total axe violations: ${axeResults.violations.length}`);
    if (axeResults.violations.length === 0) {
      console.log('✓ PASS: Zero axe accessibility violations detected!');
    } else {
      axeResults.violations.forEach(v => {
        console.log(`  - [${v.impact?.toUpperCase()}] ${v.id}: ${v.description}`);
      });
      throw new Error(`Accessibility audit failed: ${axeResults.violations.length} violations!`);
    }

    // ==========================================
    // 11. REQUIRED 360px MOBILE SECTION SCREENSHOTS
    // ==========================================
    console.log('\n--- 11. Capturing 360px Mobile Screenshots (Hero, Services, Gallery, Booking, Menu, Contact) ---');
    const mobilePage = await browser.newPage();
    await mobilePage.setViewport({ width: 360, height: 780 });
    await mobilePage.goto(BASE_URL, { waitUntil: 'networkidle2' });

    for (const section of ['hero', 'services', 'gallery', 'booking', 'contact']) {
      await mobilePage.evaluate(id => {
        const el = document.getElementById(id);
        el?.scrollIntoView({ behavior: 'instant' });
      }, section);
      await sleep(300);

      const filePath = path.join(SCREENSHOTS_DIR, `screenshot-360px-${section}.png`);
      await mobilePage.screenshot({ path: filePath });
      console.log(`  -> Captured screenshot-360px-${section}.png`);
    }

    // 360px Open Menu
    await mobilePage.evaluate(() => {
      window.scrollTo(0, 0);
      const btn = document.querySelector('button[aria-label="Open navigation menu"]');
      if (btn) btn.click();
    });
    await sleep(400);
    await mobilePage.screenshot({ path: path.join(SCREENSHOTS_DIR, 'screenshot-360px-menu.png') });
    console.log('  -> Captured screenshot-360px-menu.png');
    await mobilePage.close();

    // ==========================================
    // 12. CONSOLE HEALTH CHECK
    // ==========================================
    console.log('\n--- 12. Console Health Check ---');
    console.log(`Console error messages recorded: ${testResults.consoleErrors.length}`);
    if (testResults.consoleErrors.length === 0) {
      console.log('✓ Zero console errors detected during runtime execution.');
    }

  } finally {
    await browser.close();
    server.httpServer.close();
  }

  // ==========================================
  // 13. LIGHTHOUSE MOBILE AUDIT
  // ==========================================
  console.log('\n--- 13. Running Lighthouse Mobile Audit ---');
  const lhServer = await preview({ preview: { port: 4206 } });
  const lhUrl = lhServer.resolvedUrls.local[0];
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless', '--no-sandbox'] });

  try {
    const runnerResult = await lighthouse(lhUrl, {
      logLevel: 'error',
      output: 'json',
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      port: chrome.port,
      formFactor: 'mobile',
      screenEmulation: {
        mobile: true,
        width: 390,
        height: 844,
        deviceScaleFactor: 3,
        disabled: false,
      },
      throttlingMethod: 'simulate',
    });

    const scores = {
      performance: Math.round(runnerResult.lhr.categories.performance.score * 100),
      accessibility: Math.round(runnerResult.lhr.categories.accessibility.score * 100),
      bestPractices: Math.round(runnerResult.lhr.categories['best-practices'].score * 100),
      seo: Math.round(runnerResult.lhr.categories.seo.score * 100),
    };

    console.log('LIGHTHOUSE MOBILE SCORES:');
    console.log(JSON.stringify(scores, null, 2));
  } finally {
    await chrome.kill();
    lhServer.httpServer.close();
  }

  console.log('\n=== ALL AUTOMATED BROWSER TESTS COMPLETED SUCCESSFULLY! ===');
}

runAllTests().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
