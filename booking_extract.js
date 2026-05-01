const { chromium } = require('playwright');
(async() => {
  const browser = await chromium.launch({headless:true});
  const page = await browser.newPage({ locale:'en-US', timezoneId:'America/New_York', userAgent:'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36' });
  page.setDefaultTimeout(60000);
  const url = 'https://www.booking.com/searchresults.html?ss=Waikiki%2C+Honolulu%2C+Hawaii%2C+United+States&checkin=2026-06-14&checkout=2026-06-19&group_adults=2&no_rooms=1&group_children=0&order=price';
  await page.goto(url, {waitUntil:'domcontentloaded'});
  await page.waitForTimeout(8000);
  console.log('title', await page.title());
  const targets = ['Waikiki Resort Hotel','Hyatt Place Waikiki Beach','Queen Kapiolani Hotel','OUTRIGGER Waikiki Paradise Hotel','Wayfinder Waikiki'];
  const text = await page.locator('body').innerText();
  for (const t of targets) {
    console.log('\nTARGET', t, 'present', text.includes(t));
    const i = text.indexOf(t);
    if (i >= 0) console.log(text.slice(Math.max(0,i-200), i+500));
  }
  const headings = await page.locator('h3, h2').allInnerTexts();
  console.log('\nHEADINGS sample', headings.slice(0,40));
  await browser.close();
})();
