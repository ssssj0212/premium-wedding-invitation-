const { chromium } = require('playwright');
(async() => {
  const browser = await chromium.launch({headless:true});
  const page = await browser.newPage({ locale:'en-US', timezoneId:'America/New_York', userAgent:'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36' });
  page.setDefaultTimeout(45000);
  const urls = [
    'https://www.booking.com/searchresults.html?ss=Waikiki%2C+Honolulu%2C+Hawaii%2C+United+States&checkin=2026-06-14&checkout=2026-06-19&group_adults=2&no_rooms=1&group_children=0&order=price',
    'https://www.expedia.com/Hotel-Search?destination=Waikiki%2C+Honolulu%2C+Hawaii%2C+United+States+of+America&regionId=6048741&startDate=2026-06-14&endDate=2026-06-19&rooms=1&adults=2&sort=PRICE_LOW_TO_HIGH'
  ];
  for (const url of urls) {
    try {
      console.log('\nURL', url);
      await page.goto(url, {waitUntil:'domcontentloaded'});
      await page.waitForTimeout(8000);
      console.log('title:', await page.title());
      console.log('final url:', page.url());
      const text = await page.locator('body').innerText();
      console.log('body snippet:', text.slice(0,1800));
    } catch (e) {
      console.log('ERR', e.toString());
    }
  }
  await browser.close();
})();
