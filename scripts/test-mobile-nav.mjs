import puppeteer from 'puppeteer';
import { spawn } from 'child_process';
import http from 'http';

const sleep = ms => new Promise(r => setTimeout(r, ms));

function waitForServer(port, timeout = 10000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const check = () => {
      const req = http.get(`http://localhost:${port}/`, res => {
        if (res.statusCode === 200) resolve();
        else setTimeout(check, 200);
      });
      req.on('error', () => {
        if (Date.now() - start > timeout) reject(new Error('Server timeout'));
        else setTimeout(check, 200);
      });
    };
    check();
  });
}

async function run() {
  console.log('Starting preview server on port 4181...');
  const preview = spawn('cmd.exe', ['/c', 'npm', 'run', 'preview', '--', '--port', '4181', '--strictPort'], {
    stdio: 'ignore'
  });

  await waitForServer(4181);
  console.log('Preview server ready!');

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:4181/', { waitUntil: 'networkidle2' });

  console.log('--- 1. Testing Mobile Hamburger Toggle ---');
  const menuBtn = await page.$('button[aria-label="Open navigation menu"]');
  if (!menuBtn) throw new Error('Menu button not found');
  await menuBtn.tap();
  await sleep(400);

  const isDrawerVisible = await page.evaluate(() => {
    const d = document.getElementById('mobile-nav-drawer');
    if (!d) return false;
    const style = window.getComputedStyle(d);
    return style.visibility === 'visible' && parseFloat(style.opacity) > 0.8;
  });
  console.log('Mobile drawer visible after tap:', isDrawerVisible);
  if (!isDrawerVisible) throw new Error('Drawer failed to open smoothly');

  console.log('--- 2. Testing Tapping "Services" Link ---');
  const servicesLink = await page.$('#mobile-nav-drawer a[href="#services"]');
  if (!servicesLink) throw new Error('Services link not found in drawer');
  await servicesLink.tap();
  await sleep(1000);

  const scrollAfterServices = await page.evaluate(() => window.scrollY);
  const isDrawerClosed = await page.evaluate(() => {
    const d = document.getElementById('mobile-nav-drawer');
    return d === null;
  });
  console.log(`Scroll Y after tapping Services: ${scrollAfterServices}px, Drawer closed: ${isDrawerClosed}`);
  if (scrollAfterServices < 1000) throw new Error(`Expected scroll to Services (>1000px), got ${scrollAfterServices}px`);
  if (!isDrawerClosed) throw new Error('Drawer failed to close after tapping Services');

  console.log('--- 3. Testing Tapping "Book Appointment" CTA inside Mobile Drawer ---');
  const menuBtn2 = await page.$('button[aria-label="Open navigation menu"]');
  await menuBtn2.tap();
  await sleep(400);

  const bookBtn = await page.$('#mobile-nav-drawer a[href="#booking"]');
  if (!bookBtn) throw new Error('Book Appointment button not found in drawer');
  await bookBtn.tap();
  await sleep(1000);

  const scrollAfterBooking = await page.evaluate(() => window.scrollY);
  console.log(`Scroll Y after tapping Book Appointment: ${scrollAfterBooking}px`);
  if (scrollAfterBooking < 3000) throw new Error(`Expected scroll to Booking (>3000px), got ${scrollAfterBooking}px`);

  console.log('--- 4. Testing Logo Tap (Smooth Scroll Back to Hero) ---');
  const logoLink = await page.$('header a[href="#hero"]');
  await logoLink.tap();
  
  // Wait for smooth scroll animation to finish
  await page.waitForFunction(() => window.scrollY < 50, { timeout: 4000 });

  const scrollAfterHero = await page.evaluate(() => window.scrollY);
  console.log(`Scroll Y after tapping Logo: ${scrollAfterHero}px`);
  if (scrollAfterHero > 50) throw new Error(`Expected scroll to top (<50px), got ${scrollAfterHero}px`);

  console.log('\n=== ALL MOBILE NAVBAR TESTS PASSED SMOOTHLY! ===');

  await browser.close();
  preview.kill();
  process.exit(0);
}

run().catch(err => {
  console.error('Test Failed:', err);
  process.exit(1);
});
