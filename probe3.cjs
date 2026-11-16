const { chromium } = require("playwright");
const path = require("path");
(async () => {
  const br = await chromium.launch();
  const ctx = await br.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  await p.addInitScript(() => localStorage.setItem("benita-theme", "espresso"));
  await p.goto("file://" + path.join(process.cwd(), "dist/index.html"), { waitUntil: "load" });
  await p.waitForTimeout(2500);
  await p.evaluate(async () => {
    document.documentElement.style.scrollBehavior = "auto";
    for (let y = 0; y < document.body.scrollHeight; y += 260) {
      window.scrollTo({ top: y, behavior: "instant" });
      await new Promise((r) => setTimeout(r, 110));
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  });
  await p.waitForTimeout(1200);
  console.log(await p.evaluate(() =>
    [...document.querySelectorAll("[data-reveal]")]
      .filter((el) => parseFloat(getComputedStyle(el).opacity) < 0.65)
      .map((el) => ({ cls: (el.className || "").toString().slice(0, 90), txt: (el.textContent || "").trim().slice(0, 40), op: getComputedStyle(el).opacity, rect: el.getBoundingClientRect().toJSON() }))
  ));
  await br.close();
})();
