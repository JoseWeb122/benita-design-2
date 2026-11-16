const { chromium } = require("playwright");
const path = require("path");
const URL = "file://" + path.join(process.cwd(), "dist/index.html");
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1512, height: 950 } });
  const p = await ctx.newPage();
  p.on("pageerror", (e) => console.log("PAGEERROR", e.message));
  await p.addInitScript(() => { try { localStorage.setItem("benita-theme", "espresso"); } catch (e) {} });
  await p.goto(URL, { waitUntil: "load" });
  await p.waitForTimeout(2500);
  const dock = p.locator("button[aria-label='Switch design direction']");
  console.log("dock count:", await dock.count(), "visible:", await dock.isVisible());
  await dock.hover();
  await p.waitForTimeout(800);
  const panelBtns = p.locator("button[title]");
  console.log("panel buttons:", await panelBtns.count());
  for (let i = 0; i < (await panelBtns.count()); i++) {
    const el = panelBtns.nth(i);
    console.log(" ", i, await el.getAttribute("title"), "visible:", await el.isVisible(), "box:", JSON.stringify(await el.boundingBox()));
  }
  await p.locator("button[title='Plum & Rose']").click({ timeout: 5000 }).catch((e) => console.log("click fail:", e.message.split("\n")[0]));
  await p.waitForTimeout(2500);
  console.log("theme now:", await p.evaluate(() => document.documentElement.dataset.theme));
  await b.close();
})();
