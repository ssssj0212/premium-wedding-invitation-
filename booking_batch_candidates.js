const { chromium } = require('playwright');
const hotels = [
  'Waikiki Malia',
  'Vive Hotel Waikiki',
  'Ramada Plaza by Wyndham Waikiki',
  'Hotel La Croix Waikiki',
  'Coconut Waikiki Hotel',
  'Aqua Palms Waikiki',
  'Hilton Garden Inn Waikiki Beach',
  'Waikiki Central Hotel',
  'Romer Waikiki at The Ambassador',
  'Waikiki Beachcomber by Outrigger'
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
    if (!count) {
      console.log('No cards');
      continue;
    }
    const txt = (await cards.nth(0).innerText()).replace(/\s+/g, ' ').trim();
    console.log(txt.slice(0,1000));
  }
  await browser.close();
})();
