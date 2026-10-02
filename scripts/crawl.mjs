import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import * as cheerio from "cheerio";
await fs.mkdir("reference/pages", { recursive: true });
await fs.mkdir("public/assets", { recursive: true });
const browser = await chromium.launch({ channel: "msedge", headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
});
const page = await context.newPage();
const save = async (name) => {
  await fs.writeFile(`reference/${name}.html`, await page.content());
  await page.screenshot({ path: `reference/${name}.png`, fullPage: true });
};
await page.goto("https://hackculture.io/", { waitUntil: "networkidle" });
await page.getByRole("button", { name: "Offerings", exact: true }).hover();
await page.waitForTimeout(500);
await save("offerings-menu");
await page.getByRole("button", { name: "Get Involved", exact: true }).hover();
await page.waitForTimeout(500);
await save("involved-menu");
await page.getByRole("button", { name: "Host", exact: true }).click();
await page.waitForTimeout(700);
await save("host-flow");
console.log("Host URL", page.url());
console.log(
  "Host text",
  (await page.locator("body").innerText()).slice(-10000),
);
await page.goto("https://hackculture.io/auth", { waitUntil: "networkidle" });
await save("auth");
console.log("Auth text", await page.locator("body").innerText());
const queue = [
  "/",
  "/programs",
  "/offerings",
  "/offerings/corporate-innovation-programs",
  "/offerings/hiring-hackathons-employer-branding",
  "/offerings/innovation-hackathons",
  "/offerings/ai-capacity-building",
  "/offerings/internal-hackathons",
  "/our-clientele",
  "/blog",
  "/legal/privacy-policy",
  "/legal/terms-and-conditions",
  "/auth",
  "/my-programs",
];
const apis = (await fs.readFile("reference/api.jsonl", "utf8"))
  .trim()
  .split("\n")
  .map(JSON.parse);
const programs = JSON.parse(apis.find((x) => x.url.includes("sort_by")).body);
await fs.writeFile(
  "reference/program-data.json",
  JSON.stringify(programs, null, 2),
);
queue.push(...programs.map((p) => "/hackathons/" + p.slug));
const visited = new Set();
const manifest = [];
const assetMap = {};
const styles = new Set();
const assetPromises = new Map();
async function asset(url) {
  if (!url || url.startsWith("data:") || url.startsWith("blob:")) return url;
  const full = new URL(url, "https://hackculture.io").href;
  if (assetPromises.has(full)) return assetPromises.get(full);
  const promise = (async () => {
    try {
      const r = await context.request.get(full, { timeout: 30000 });
      if (!r.ok()) return full;
      const ext = path.extname(new URL(full).pathname).slice(0, 8) || ".webp";
      const dest =
        "/assets/" +
        crypto.createHash("sha1").update(full).digest("hex").slice(0, 16) +
        ext;
      await fs.writeFile("public" + dest, await r.body());
      assetMap[full] = dest;
      return dest;
    } catch {
      return full;
    }
  })();
  assetPromises.set(full, promise);
  return promise;
}
async function capture(route) {
  const tab = await context.newPage();
  try {
    await tab.goto("https://hackculture.io" + route, {
      waitUntil: "networkidle",
      timeout: 60000,
    });
    await tab.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 700) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
      window.scrollTo(0, 0);
    });
    await tab.waitForTimeout(450);
    const html = await tab.content();
    const $ = cheerio.load(html);
    $("link[rel=stylesheet]").each((i, e) =>
      styles.add(new URL($(e).attr("href"), "https://hackculture.io").href),
    );
    $("a[href]").each((i, e) => {
      const h = $(e).attr("href");
      if (h?.startsWith("/blog/") && !queue.includes(h) && !visited.has(h))
        queue.push(h);
    });
    for (const e of $("img").toArray()) {
      const img = $(e);
      const src = img.attr("src");
      img.attr("src", await asset(src));
      img.removeAttr("srcset").removeAttr("sizes").removeAttr("loading");
    }
    // All retained HTML is public presentation content. No scripts, handlers, embedded forms, or tracking code are retained.
    $("script,link,meta,iframe").remove();
    $("*").each((i, e) => {
      for (const k of Object.keys(e.attribs || {}))
        if (/^on/i.test(k)) $(e).removeAttr(k);
    });
    $("[style]").each((i, e) => {
      let s = $(e).attr("style");
      s = s
        .replace(/opacity:\s*0(?:;|$)/g, "opacity:1;")
        .replace(/transform:\s*translateY\([^)]+\)/g, "transform:none");
      $(e).attr("style", s);
    });
    const main = $("main").first();
    const item = {
      route,
      finalUrl: tab.url(),
      title: $("title").text() || route,
      mainClass: main.attr("class") || "",
      html: main.length ? main.html() : $("body").html(),
      footer: $("footer").first().prop("outerHTML") || "",
      nav: $("nav").first().prop("outerHTML") || "",
    };
    const file = route === "/" ? "home" : route.slice(1).replaceAll("/", "__");
    await fs.writeFile(`reference/pages/${file}.json`, JSON.stringify(item));
    await fs.writeFile(`reference/pages/${file}.raw.html`, html);
    if (
      !route.startsWith("/hackathons/") ||
      manifest.filter((m) => m.route.startsWith("/hackathons/")).length < 2
    )
      await tab.screenshot({
        path: `reference/pages/${file}.png`,
        fullPage: true,
      });
    manifest.push({ route, file, title: item.title, finalUrl: item.finalUrl });
    console.log("Captured", route);
  } catch (e) {
    console.log("FAILED", route, e.message);
  } finally {
    await tab.close();
  }
}
while (queue.length) {
  const batch = [];
  while (queue.length && batch.length < 4) {
    const r = queue.shift();
    if (!visited.has(r)) {
      visited.add(r);
      batch.push(r);
    }
  }
  await Promise.all(batch.map(capture));
}
let css = "";
for (const url of styles) {
  let value = await (await context.request.get(url)).text();
  const refs = [...value.matchAll(/url\(([^)]+)\)/g)];
  for (const m of refs) {
    const raw = m[1].replace(/^["']|["']$/g, "");
    if (!raw.startsWith("data:")) {
      const local = await asset(new URL(raw, url).href);
      value = value.replaceAll(m[0], `url("${local}")`);
    }
  }
  css += "\n" + value;
}
await fs.writeFile("public/reference.css", css);
await fs.writeFile(
  "reference/asset-map.json",
  JSON.stringify(assetMap, null, 2),
);
await fs.writeFile(
  "reference/manifest.json",
  JSON.stringify(manifest, null, 2),
);
await page.goto("https://hackculture.io/", { waitUntil: "networkidle" });
await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(600);
await save("home-mobile");
await browser.close();
console.log(
  "COMPLETE",
  manifest.length,
  "pages",
  Object.keys(assetMap).length,
  "assets",
);
