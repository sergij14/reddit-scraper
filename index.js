const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();

  await page.goto('https://old.reddit.com/r/learnprogramming/comments/t2jaes/i_learned_to_code_in_2_months_and_got_a_remote/');
  await page.setViewport({width: 1080, height: 1024});

  await page.waitForNetworkIdle()


  await browser.close();
})();