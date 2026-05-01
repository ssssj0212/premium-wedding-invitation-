const { chromium } = require('playwright');
const hotels = [
  'Waikiki Resort Hotel',
  'Hyatt Place Waikiki Beach',
  'Queen Kapiolani Hotel',
  'OUTRIGGER Waikiki Paradise Hotel',
  'Wayfinder Waikiki'
];
(async() => {
  const browser = await chromium.launch({headless:true});
  const page = await browser.newPage({ locale:'en-US', timezoneId:'America/New_York', userAgent:'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36' });
  page.setDefaultTimeout(60000);
  for (const hotel of hotels) {
    const url = `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(hotel + ', Waikiki')}&checkin=2026-06-14&checkout=2026-06-19&group_adults=2&no_rooms=1&group_children=0`;
    console.log('\n===', hotel, '===');
    await page.goto(url, {waitUntil:'domcontentloaded'});
    await page.waitForTimeout(7000);
    const cards = page.locator('[data-testid="property-card"]');
    const count = await cards.count();
    console.log('cards', count, 'title', await page.title());
    for (let i = 0; i < Math.min(count, 5); i++) {
      const card = cards.nth(i);
      const txt = (await card.innerText()).replace(/\s+/g, ' ').trim();
      console.log('CARD', i+1, txt.slice(0,700));
    }
  }
  await browser.close();
})();
