const { chromium } = require('playwright');
const hotels = [
  'Ilima Hotel',
  'Park Shore Waikiki',
  'Oasis Hotel Waikiki',
  'The Equus',
  'Courtyard by Marriott Waikiki Beach',
  'Shoreline Hotel Waikiki',
  'Romer House Waikiki',
  'Ala Moana Hotel by Mantra',
  'Embassy Suites by Hilton Waikiki Beach Walk',
  'Hilton Waikiki Beach'
];
(async() => {
  const browser = await chromium.launch({headless:true});
  const page = await browser.newPage({ locale:'en-US', timezoneId:'America/New_York', userAgent:'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36' });
  page.setDefaultTimeout(60000);
  for (const hotel of hotels) {
    const url = `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(hotel + ', Waikiki')}&checkin=2026-06-14&checkout=2026-06-19&group_adults=2&no_rooms=1&group_children=0`;
    console.log('\n===', hotel, '===');
    await page.goto(url, {waitUntil:'domcontentloaded'});
    await page.waitForTimeout(6000);
    const cards = page.locator('[data-testid="property-card"]');
    const count = await cards.count();
    if (!count) { console.log('No cards'); continue; }
    const txt = (await cards.nth(0).innerText()).replace(/\s+/g,' ').trim();
    console.log(txt.slice(0,1000));
  }
  await browser.close();
})();
