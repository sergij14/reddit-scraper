const puppeteer = require("puppeteer");
const fs = require("fs/promises");
const { argv } = require("process");

const url = argv[2];

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto(url);
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
      formattedComments.push({ point, text });
    }
  }

  const sortedComments = [...formattedComments].sort(
    (a, b) => b.point - a.point
  );

  const dataFileHandle = await fs.open("data/data.csv", "w");
  const writeStream = dataFileHandle.createWriteStream();

  sortedComments.forEach((el) => {
    let line = [];

    Object.keys(el).forEach((key) => line.push(el[key]));

    line = [...line].map((el, idx) =>
      idx !== line.length - 1 ? `"${el}",` : `"${el}"`
    );

    writeStream.write(line.join("") + "\n");
  });

  writeStream.end();

  writeStream.on("finish", () => {
    dataFileHandle.close();
  });

  await browser.close();
})();
