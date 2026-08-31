const { chromium } = require('playwright');
const fs = require('fs');

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 }
  });

  // Navigate to work page
  await page.goto('http://localhost:3001/work', { waitUntil: 'networkidle' });
  
  // Scroll down progressively to trigger ScrollReveal
  for (let i = 0; i < 5; i++) {
    await page.evaluate(() => window.scrollBy(0, 800));
    await page.waitForTimeout(1000);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  
  await page.screenshot({ path: 'qa-work-desktop.png', fullPage: true });

  const mobilePage = await browser.newPage({
    viewport: { width: 375, height: 812 },
    isMobile: true
  });
  await mobilePage.goto('http://localhost:3001/work', { waitUntil: 'networkidle' });
  for (let i = 0; i < 5; i++) {
    await mobilePage.evaluate(() => window.scrollBy(0, 800));
    await mobilePage.waitForTimeout(1000);
  }
  await mobilePage.evaluate(() => window.scrollTo(0, 0));
  await mobilePage.waitForTimeout(500);

  await mobilePage.screenshot({ path: 'qa-work-mobile.png', fullPage: true });

  await browser.close();
  console.log("Screenshots captured!");
}

run();
