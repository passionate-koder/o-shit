import { chromium } from "playwright";
import fs from "node:fs/promises";
await fs.mkdir("reference", { recursive: true });
const browser = await chromium.launch({ channel: "msedge", headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
page.on("response", async (r) => {
  if (/\/api\//.test(r.url())) {
    try {
      const body = await r.text();
      await fs.appendFile(
        "reference/api.jsonl",
        JSON.stringify({ url: r.url(), status: r.status(), body }) + "\n",
      );
    } catch {}
  }
});
await page.goto("https://hackculture.io/", {
  waitUntil: "networkidle",
  timeout: 90000,
});
await page.screenshot({ path: "reference/home-desktop.png", fullPage: true });
await fs.writeFile("reference/home-rendered.html", await page.content());
console.log(
  await page.evaluate(() => ({
    links: [...document.querySelectorAll("a")].map((a) => ({
      text: a.textContent,
      href: a.getAttribute("href"),
    })),
    buttons: [...document.querySelectorAll("button")].map((a) => a.textContent),
    fonts: [...document.fonts].map((f) => ({
      family: f.family,
      status: f.status,
    })),
  })),
);
await page.goto("https://hackculture.io/programs", {
  waitUntil: "networkidle",
  timeout: 90000,
});
await page.screenshot({
  path: "reference/programs-desktop.png",
  fullPage: true,
});
await fs.writeFile("reference/programs-rendered.html", await page.content());
console.log(
  "PROGRAMS",
  await page
    .locator("a")
    .evaluateAll((as) =>
      as.map((a) => ({ text: a.textContent, href: a.getAttribute("href") })),
    ),
);
await browser.close();
