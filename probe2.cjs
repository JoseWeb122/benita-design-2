const { chromium } = require("playwright");
const path = require("path");
(async () => {
  const br = await chromium.launch();
  const ctx = await br.newContext({ viewport: { width: 1512, height: 950 } });
  const p = await ctx.newPage();
  p.on("pageerror", (e) => console.log("PAGEERROR", e.message));
  await p.addInitScript(() => localStorage.setItem("benita-theme", "plum"));
  await p.goto("file://" + path.join(process.cwd(), "dist/index.html"), { waitUntil: "load" });
  await p.waitForTimeout(3000);
  console.log(await p.evaluate(() => {
    const words = [...document.querySelectorAll("h1 .w-i")].map((w) => ({
      t: w.textContent,
      stroke: getComputedStyle(w).webkitTextStrokeWidth,
      color: getComputedStyle(w).color,
      op: getComputedStyle(w).opacity,
      tf: getComputedStyle(w).transform,
    }));
    return words;
  }));
  // nav badge appears after adding a cocktail
  await p.locator("#menu").scrollIntoViewIfNeeded();
  await p.waitForTimeout(800);
  await p.locator("#menu button:has-text('Add to menu')").first().click();
  await p.waitForTimeout(700);
  const badge = p.locator("header button[title='Drinks added to your menu']");
  console.log("nav badge count:", await badge.count(), "text:", (await badge.textContent().catch(() => "n/a")));
  await p.evaluate(() => window.scrollTo({ top: 0 }));
  await p.waitForTimeout(700);
  await p.screenshot({ path: "shots/B-13-navbadge.png" });
  await br.close();
})();
