const { chromium } = require("playwright");
const path = require("path");
(async () => {
  const br = await chromium.launch();
  const ctx = await br.newContext({ viewport: { width: 1200, height: 800 } });
  const p = await ctx.newPage();
  await p.addInitScript(() => localStorage.setItem("benita-theme", "plum"));
  await p.goto("file://" + path.join(process.cwd(), "dist/index.html"), { waitUntil: "load" });
  await p.waitForTimeout(2500);
  console.log(await p.evaluate(() => {
    const el = document.querySelector("h1 .w-i[style]");
    const t = document.createElement("div");
    t.style.webkitTextStroke = "1.2px var(--c-accent2)";
    t.style.color = "transparent";
    t.textContent = "x";
    document.body.appendChild(t);
    const cs = getComputedStyle(t);
    return {
      heroWordText: el ? el.textContent : null,
      heroStyleAttr: el ? el.getAttribute("style") : null,
      heroComputed: el ? getComputedStyle(el).webkitTextStrokeWidth + " | " + getComputedStyle(el).color : null,
      testComputed: cs.webkitTextStrokeWidth + " | " + cs.webkitTextStrokeColor + " | " + cs.color,
    };
  }));
  await br.close();
})();
