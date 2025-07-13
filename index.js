import puppeteer from "puppeteer-core";
import formatter from "./formatter.js";
import "dotenv/config";

const LANG_NAME = process.env.LANG_NAME;
const PHONE_NUMBER = process.env.PHONE_NUMBER;

(async () => {
  const browser = await puppeteer.launch({
    browser: "firefox",
    executablePath: "/usr/bin/firefox",
    headless: false,
  });
  const page = await browser.newPage();

  await page.goto(`https://translations.telegram.org`);

  await page.setViewport({ width: 1080, height: 1024 });

  await page.locator(".login-link").click();

  await page.type("#phone-number", `${PHONE_NUMBER}`);

  await page.locator(".btn-lg[type=submit]").click();

  await page.waitForSelector(".header-auth-photo");

  await page.goto(
    `https://translations.telegram.org/${LANG_NAME}/untranslated/`
  );

  await page.exposeFunction("formatTranslate", formatter);

  const translateWraps = await page.$$(".tr-key-row-wrap");

  for (const wrap of translateWraps) {
    const translateLink = await wrap.$(".tr-value-link");
    await translateLink.click();

    const formField = await wrap.waitForSelector(".add-suggestion-form");

    formField.$eval(".key-add-suggestion-field", async (field) => {
      field.textContent = await window.formatTranslate(field.textContent);
    });

    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
  }
})();
