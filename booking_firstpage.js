const { chromium } = require('playwright');
(async() => {
  const browser = await chromium.launch({headless:true});
  const page = await browser.newPage({ locale:'en-US', timezoneId:'America/New_York', userAgent:'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36' });
  page.setDefaultTimeout(60000);
  const url = 'https://www.booking.com/searchresults.html?ss=Waikiki%2C+Honolulu%2C+Hawaii%2C+United+States&checkin=2026-06-14&checkout=2026-06-19&group_adults=2&no_rooms=1&group_children=0&order=price';
  await page.goto(url, {waitUntil:'domcontentloaded'});
  await page.waitForTimeout(8000);
  const cards = page.locator('[data-testid="property-card"]');
  const count = await cards.count();
  console.log('count', count);
  for (let i = 0; i < Math.min(count, 25); i++) {
    const txt = (await cards.nth(i).innerText()).replace(/\s+/g,' ').trim();
    console.log('\nCARD', i+1, txt.slice(0,900));
  }
  await browser.close();
})();
