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

  const formattedComments = [];

  for (let comment of comments) {
    const point = await comment
      .$eval(".score", (el) => parseInt(el.innerText))
      .catch(() => console.error(""));

    const rawText = await comment
      .$eval(".usertext-body", (el) => el.innerText)
      .catch(() => console.error(""));

    if (point && rawText) {
      const text = rawText.replace(/\n/g, "");
      formattedComments.push({point, text});
    }
  }

  console.log(formattedComments);

  await browser.close();
})();
