import { chromium } from "playwright";
import fs from "node:fs/promises";

const browser = await chromium.launch({ channel: "msedge", headless: true });
for (const role of ["student", "professional"]) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    storageState: `reference/accounts/${role}-session.json`,
  });
  await context.route("**/*", (route) => {
    const method = route.request().method();
    if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) return route.abort();
    return route.continue();
  });
  const page = await context.newPage();
  await page.goto("https://hackculture.io/my-events", { waitUntil: "networkidle" });
  const manage = page.getByRole("button", { name: "Manage Hackathon", exact: true });
  if (await manage.count()) {
    await manage.click();
    await page.waitForTimeout(1200);
  }
  const file = `reference/accounts/${role}-manage-hackathon`;
  await fs.writeFile(file + ".html", await page.content());
  await page.screenshot({ path: file + ".png", fullPage: true });
  console.log(role, JSON.stringify({
    url: page.url(),
    text: (await page.locator("body").innerText()).slice(0, 24000),
    links: await page.locator("a").evaluateAll((items) => items.map((a) => ({ text: a.textContent, href: a.getAttribute("href") }))),
    buttons: await page.locator("button").allTextContents(),
  }));
  await context.close();
}
await browser.close();
