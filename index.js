const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto(
    "https://old.reddit.com/r/learnprogramming/comments/t2jaes/i_learned_to_code_in_2_months_and_got_a_remote/"
  );
  await page.setViewport({ width: 1080, height: 1024 });

  let expandButtons = await page.$$(".morecomments");

  while (expandButtons.length) {
    for (let btn of expandButtons) {
      await btn.click();
      await page.waitForNetworkIdle();
    }

    expandButtons = await page.$$(".morecomments");
  }

  const comments = await page.$$(".entry");

  for (let comment of comments) {
    const points = await comment
      .$eval(".score", (el) => el.innerHTML)
      .catch(() => console.error("No child entry"));
    console.log(points);
  }

  await browser.close();
})();
