import fs from "node:fs/promises";
import { load } from "cheerio";
const assets = JSON.parse(
  await fs.readFile("reference/asset-map.json", "utf8"),
);
const screens = {};
for (const [key, file] of Object.entries({
  overview: "registration-redirect",
  resources: "dashboard-resources",
  team: "dashboard-team",
  submissions: "dashboard-submissions",
  events: "dashboard-events",
  finale: "dashboard-finale",
})) {
  let raw;
  try {
    raw = await fs.readFile(`reference/accounts/student-${file}.html`, "utf8");
  } catch {
    continue;
  }
  const dom = load(raw);
  const main = dom("main");
  const root = main.parent();
  root.find("nav").first().remove();
  root.children("div.h-14").remove();
  root.find("script,iframe,link,meta,noscript,style").remove();
  root.find("*").each((_, e) => {
    for (const a of Object.keys(e.attribs || {})) {
      if (/^on/i.test(a) || a.startsWith("data-next")) dom(e).removeAttr(a);
    }
  });
  root.find("img").each((_, e) => {
    const el = dom(e);
    const url = new URL(el.attr("src"), "https://hackculture.io").href;
    const local = assets[url];
    if (!local) console.log("Missing asset", url);
    el.attr("src", local || el.attr("src"));
    el.removeAttr("srcset").removeAttr("sizes");
  });
  main.attr("id", "page-content");
  root
    .children("div")
    .filter((_, e) => (dom(e).attr("class") || "").includes("w-64"))
    .attr("data-dashboard-sidebar", "true");
  root.find("button").each((_, e) => {
    const el = dom(e),
      t = el.text().trim();
    const targets = [
      ["Overview", "overview"],
      ["Manage Team", "team"],
      ["Submissions", "submissions"],
      ["Events", "events"],
      ["Resources", "resources"],
      ["Phases", "overview"],
      ["Grand Finale", "finale"],
      ["Submission Phase", "submissions"],
      ["Read more", "description"],
    ];
    const found = targets.find(([label]) => t.startsWith(label));
    if (found) el.attr("data-action", found[1]);
    else if (el.find(".lucide-copy").length) el.attr("data-action", "copy");
    else if (
      el.find(".lucide-menu,.lucide-chevron-left,.lucide-panel-left-close")
        .length
    )
      el.attr("data-action", "toggle-sidebar");
  });
  root
    .find("button")
    .filter((_, e) => dom(e).find(".lucide-x").length > 0)
    .attr("data-action", "toggle-sidebar");
  root.find("a").each((_, e) => {
    const el = dom(e);
    const txt = el.text();
    if (txt.includes("Back to My Programs")) el.attr("href", "/my-events");
    if (txt.includes("Program Details"))
      el.attr("href", "/hackathons/code-for-communities-chandigarh");
  });
  screens[key] = dom
    .html(root)
    .replaceAll("6abea73f7df5...", "__REGISTRATION_SHORT__")
    .replaceAll("6abea73f7df5…", "__REGISTRATION_SHORT__");
}
await fs.writeFile(
  "src/content/accounts/dashboard-screens.json",
  JSON.stringify(screens, null, 2),
);
const seeds = {};
for (const role of ["student", "professional"]) {
  const files = [`${role}-exploration-api.json`, `${role}-dashboard-api.json`];
  let found;
  for (const f of files) {
    try {
      const a = JSON.parse(
        await fs.readFile(`reference/accounts/${f}`, "utf8"),
      );
      found = a.find((x) => x.path === "/api/v1/my-hackathons")?.body;
      if (found) break;
    } catch {}
  }
  if (!found) {
    console.log("No registration seed for", role);
    continue;
  }
  seeds[role] = found.map((r) => ({
    id: r.hackathon_registration_id,
    slug: r.hackathon_slug,
    name: r.hackathon_name,
    registeredAt: r.registered_at,
    answers: {},
    status: "registered",
  }));
}
await fs.writeFile(
  "src/content/accounts/registrations.json",
  JSON.stringify(seeds, null, 2),
);
console.log("Imported dashboard screens:", Object.keys(screens));
