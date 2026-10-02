// Build-time import of public presentation markup. Runtime pages never execute remote code.
import fs from "node:fs/promises";
import * as cheerio from "cheerio";
const manifest = JSON.parse(
  await fs.readFile("reference/manifest.json", "utf8"),
);
const assets = JSON.parse(
  await fs.readFile("reference/asset-map.json", "utf8"),
);
await fs.mkdir("src/content/pages", { recursive: true });
function prepare(raw) {
  const $ = cheerio.load(raw);
  $("script,iframe,link,meta,noscript").remove();
  $("*").each((i, e) => {
    for (const attr of Object.keys(e.attribs || {})) {
      if (/^on/i.test(attr) || attr.startsWith("data-nextjs"))
        $(e).removeAttr(attr);
    }
  });
  $("img").each((i, e) => {
    const el = $(e);
    let src = el.attr("src");
    if (src) {
      const url = new URL(src, "https://hackculture.io").href;
      el.attr("src", assets[url] || src);
    }
    el.removeAttr("srcset").removeAttr("sizes");
  });
  $("a").each((i, e) => {
    let h = $(e).attr("href");
    if (h?.startsWith("https://hackculture.io/"))
      $(e).attr("href", h.slice(22));
    if (h?.startsWith("/hackathon/"))
      $(e).attr("href", h.replace("/hackathon/", "/hackathons/"));
  });
  $("[style]").each((i, e) => {
    let s = $(e).attr("style");
    s = s
      .replace(/opacity:\s*0(?:;|$)/g, "opacity:1;")
      .replace(/transform:\s*translateY\([^)]+\)/g, "transform:none")
      .replace(/filter:\s*blur\([^)]+\)/g, "filter:blur(0px)");
    $(e).attr("style", s);
  });
  return $;
}
const index = [];
for (const entry of [
  ...manifest.filter((p) => p.route !== "/my-programs"),
  { route: "/host", file: "host", source: "reference/host.html" },
  {
    route: "/auth/reset-password",
    file: "auth__reset-password",
    source: "reference/forgot-password.html",
  },
]) {
  const raw = await fs.readFile(
    entry.source || `reference/pages/${entry.file}.raw.html`,
    "utf8",
  );
  const $ = prepare(raw);
  const main = $("main").first();
  let root = main;
  while (root.parent().length && root.parent()[0]?.tagName !== "body")
    root = root.parent();
  const footer = root.find("footer").first().prop("outerHTML") || "";
  root
    .find("nav")
    .filter((i, e) => $(e).find('a[href="/"]').length > 0)
    .remove();
  root.find("footer").replaceWith('<div data-slot="site-footer"></div>');
  root.attr("id", "page-content");
  // Captured sticky state depends on scroll position; restore the initial viewport state.
  root.find('[data-state="closed"]').removeAttr("inert");
  if (entry.route === "/programs") {
    const card = root
      .find('a[href="/hackathons/code-for-communities-chandigarh"]')
      .first();
    card
      .parents()
      .filter((i, e) => /grid-cols/.test($(e).attr("class") || ""))
      .first()
      .attr("data-slot", "program-directory");
    root
      .find("button")
      .filter((i, e) => $(e).text().trim() === "View More")
      .parent()
      .remove();
  }
  const content = {
    route: entry.route,
    title: $("title").text() || entry.title || "HackCulture",
    html: root.prop("outerHTML"),
    footer,
  };
  await fs.writeFile(
    `src/content/pages/${entry.file}.json`,
    JSON.stringify(content),
  );
  index.push({ route: entry.route, file: entry.file, title: content.title });
}
const home = JSON.parse(
  await fs.readFile("src/content/pages/home.json", "utf8"),
);
await fs.writeFile(
  "src/content/footer.json",
  JSON.stringify({ html: home.footer }),
);
await fs.writeFile("src/content/routes.json", JSON.stringify(index, null, 2));
const programs = JSON.parse(
  await fs.readFile("reference/program-data.json", "utf8"),
);
function localAsset(url) {
  return (
    assets[url] ||
    Object.entries(assets).find(([key]) =>
      key.includes(encodeURIComponent(url)),
    )?.[1] ||
    url
  );
}
await fs.writeFile(
  "src/content/programs.json",
  JSON.stringify(
    programs.map((p) => ({
      slug: p.slug,
      name: p.name,
      organizer: p.organizer_name,
      type: p.type,
      mode: p.mode,
      start: p.start_datetime,
      end: p.end_datetime,
      featured: p.is_featured || false,
      cover: localAsset(p.branding?.cover_photo),
      logo: localAsset(p.branding?.logo),
      location:
        p.mode === "hybrid"
          ? "Hybrid"
          : p.mode === "online"
            ? "Online"
            : p.location?.name,
      participants: p.total_participants,
      open: p.is_registration_open,
    })),
    null,
    2,
  ),
);
const $programs = prepare(
  await fs.readFile("reference/pages/programs.raw.html", "utf8"),
);
const card = $programs('a[href="/hackathons/code-for-communities-chandigarh"]')
  .first()
  .prop("outerHTML");
await fs.writeFile(
  "src/content/program-card.json",
  JSON.stringify({ html: card }),
);
await fs.writeFile(
  "SITE_MAP.md",
  "# HackCulture public page inventory\n\nInspected 2026-09-30. All paths below have local Next.js routes. Program data is a capture of all 54 programs exposed by the paginated public API. Third-party destinations remain external. Authenticated account and organizer screens are not publicly inspectable.\n\n" +
    index.map((p) => `- \`${p.route}\` — ${p.title}`).join("\n") +
    "\n\n## Additional states and aliases\n\n- `/auth?mode=signup`: account creation\n- `/auth/reset-password`: password reset\n- `/profile/programs`: sign-in gate\n- `/hackathon/:slug`: redirects to `/hackathons/:slug`\n- `/clients`: redirects to `/our-clientele`\n- `/host-event`: redirects to `/host`\n- `/blog?category=hackathons`, `business`, `featured`: category filters\n- `/host`: three-step contact, organization, and program form\n",
);
console.log("Imported", index.length, "routes");
