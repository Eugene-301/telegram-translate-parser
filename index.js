import puppeteer from "puppeteer-core";
import 'dotenv/config'

const LANG_NAME = process.env.LANG_NAME;

(async () => {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({
    browser: 'firefox',
    executablePath: "/usr/bin/firefox",
    headless: false
  });
  const page = await browser.newPage();

  // Navigate the page to a URL
  await page.goto(`https://translations.telegram.org/${LANG_NAME}/untranslated/`);

  // Set screen size

})();