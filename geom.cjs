const { chromium } = require("playwright");
const path = require("path");
const URL = "file://" + path.join(process.cwd(), "dist/index.html");
const box = (p, sel, label) => p.locator(sel).first().boundingBox().then((b) => b && console.log(`  ${label.padEnd(22)} x=${Math.round(b.x)} y=${Math.round(b.y)} w=${Math.round(b.width)} h=${Math.round(b.height)}`));
const overlap = (a, b) => a && b && !(a.x + a.width < b.x || b.x + b.width < a.x || a.y + a.height < b.y || b.y + b.height < a.y);
(async () => {
  const br = await chromium.launch();
  for (const theme of ["espresso", "plum"]) {
    const ctx = await br.newContext({ viewport: { width: 1512, height: 950 } });
    const p = await ctx.newPage();
    await p.addInitScript((t) => localStorage.setItem("benita-theme", t), theme);
    await p.goto(URL, { waitUntil: "load" });
    await p.waitForTimeout(3000);
    console.log("\n==== " + theme.toUpperCase() + " HERO GEOMETRY ====");
    const h1 = await p.locator("h1").first().boundingBox();
    console.log("  h1 font-size:", await p.locator("h1").first().evaluate((e) => getComputedStyle(e).fontSize));
    await box(p, "h1", "h1");
    if (theme === "espresso") {
      await box(p, ".he-img", "image");
      const card = await p.locator(".he-card").first().boundingBox();
      const badge = await p.locator(".he-badge").first().boundingBox();
      const stats = await p.locator("header .grid.max-w-2xl").first().boundingBox();
      await box(p, ".he-card", "card");
      await box(p, ".he-badge", "seal");
      console.log("  stats box:", stats && `x=${Math.round(stats.x)} y=${Math.round(stats.y)} w=${Math.round(stats.width)} h=${Math.round(stats.height)}`);
      console.log("  OVERLAP card/stats:", overlap(card, stats), "| OVERLAP card/h1:", overlap(card, h1), "| OVERLAP badge/h1:", overlap(badge, h1));
      console.log("  card within viewport:", card && card.x >= 0 && card.x + card.width <= 1512, "| badge within:", badge && badge.x >= 0 && badge.x + badge.width <= 1512);
    } else {
      await box(p, ".hp-arch", "arch image");
      await box(p, ".hp-mini", "mini frame");
      const meta = await p.locator(".hp-meta").first().boundingBox();
      console.log("  meta box:", meta && `x=${Math.round(meta.x)} y=${Math.round(meta.y)} w=${Math.round(meta.width)}`);
      const mini = await p.locator(".hp-mini").first().boundingBox();
      console.log("  OVERLAP mini/h1:", overlap(mini, h1), "| mini within viewport:", mini && mini.x >= 0 && mini.x + mini.width <= 1512);
      console.log("  stroke word:", await p.locator("h1 .w-i[style]").first().evaluate((e) => getComputedStyle(e).webkitTextStrokeWidth + " / color:" + getComputedStyle(e).color).catch(() => "n/a"));
    }
    // nav overlap check
    await box(p, "header.fixed", "navbar");
    console.log("  h1 top below navbar:", h1 && h1.y > 90);
    await ctx.close();
  }
  await br.close();
})();
