const { chromium } = require("playwright");
const path = require("path");

const URL = "file://" + path.join(process.cwd(), "dist/index.html");

const report = () => {
  const vw = document.documentElement.clientWidth;
  const reveals = [...document.querySelectorAll("[data-reveal]")];
  const words = [...document.querySelectorAll(".w-i")];
  const clipped = [...document.querySelectorAll("p,h1,h2,h3,li,span,div")]
    .filter((el) => {
      if (el.closest(".wm") || el.classList.contains("wm") || el.classList.contains("w-i")) return false;
      const cs = getComputedStyle(el);
      if (cs.overflow !== "hidden" && cs.overflowY !== "hidden") return false;
      if (el.style.gridTemplateRows) return false;
      return el.scrollHeight - el.clientHeight > 6 && el.clientHeight > 0;
    })
    .slice(0, 8)
    .map((el) => el.tagName + "." + (el.className || "").toString().slice(0, 50) + ` (${el.clientHeight}<${el.scrollHeight})`);
  return {
    vw,
    scrollW: document.documentElement.scrollWidth,
    overflowers: [...document.querySelectorAll("*")]
      .filter((el) => {
        const r = el.getBoundingClientRect();
        return (r.right > vw + 2 || r.left < -2) && getComputedStyle(el).position !== "fixed" && r.width > 4;
      })
      .slice(0, 8)
      .map((el) => el.tagName + "." + (el.className || "").toString().slice(0, 55) + ` L${Math.round(el.getBoundingClientRect().left)} R${Math.round(el.getBoundingClientRect().right)}`),
    revealHidden: reveals.filter((el) => parseFloat(getComputedStyle(el).opacity) < 0.65).length,
    revealTotal: reveals.length,
    wordsHidden: words.filter((el) => {
      const m = new DOMMatrixReadOnly(getComputedStyle(el).transform);
      return Math.abs(m.m42) > 5;
    }).length,
    wordsTotal: words.length,
    brokenImgs: [...document.images].filter((i) => !i.complete || i.naturalWidth === 0).length,
    imgTotal: document.images.length,
    displayFont: getComputedStyle(document.querySelector("h1")).fontFamily,
    bodyFont: getComputedStyle(document.body).fontFamily,
    fontLoaded: {
      cormorant: document.fonts.check('16px "Cormorant Garamond"'),
      playfair: document.fonts.check('16px "Playfair Display"'),
      manrope: document.fonts.check('16px "Manrope"'),
      inter: document.fonts.check('16px "Inter"'),
    },
    sections: [...document.querySelectorAll("header[id],section[id],footer[id]")].map((s) => `${s.id}:${Math.round(s.getBoundingClientRect().height)}`),
    clipped,
    pageH: Math.round(document.body.scrollHeight),
    stickyOK: getComputedStyle(document.querySelector("#process .lg\\:sticky") || document.body).position,
    stCount: window.__stCount,
  };
};

(async () => {
  const browser = await chromium.launch();
  for (const theme of ["espresso", "plum"]) {
    const ctx = await browser.newContext({ viewport: { width: 1512, height: 950 } });
    const page = await ctx.newPage();
    const errs = [];
    page.on("pageerror", (e) => errs.push("PAGEERROR " + e.message));
    page.on("console", (m) => m.type() === "error" && errs.push("CONSOLE " + m.text()));
    await page.addInitScript((t) => { try { localStorage.setItem("benita-theme", t); } catch (e) {} }, theme);
    await page.goto(URL, { waitUntil: "load" });
    await page.waitForTimeout(2600);
    await page.evaluate(() => { window.__stCount = document.querySelectorAll("[data-reveal]").length; });
    await page.evaluate(async () => {
      document.documentElement.style.scrollBehavior = "auto";
      for (let y = 0; y < document.body.scrollHeight; y += 300) {
        window.scrollTo({ top: y, behavior: "instant" });
        await new Promise((r) => setTimeout(r, 90));
      }
      window.scrollTo({ top: 0, behavior: "instant" });
    });
    await page.waitForTimeout(2000);
    const r = await page.evaluate(report);
    console.log(`\n===== ${theme.toUpperCase()} (desktop) =====`);
    console.log(JSON.stringify(r, null, 1));
    console.log("errors:", errs.length ? errs.slice(0, 6) : "none");
    await ctx.close();
  }

  // mobile
  for (const theme of ["espresso", "plum"]) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const page = await ctx.newPage();
    const errs = [];
    page.on("pageerror", (e) => errs.push("PAGEERROR " + e.message));
    await page.addInitScript((t) => { try { localStorage.setItem("benita-theme", t); } catch (e) {} }, theme);
    await page.goto(URL, { waitUntil: "load" });
    await page.waitForTimeout(2400);
    await page.evaluate(async () => {
      document.documentElement.style.scrollBehavior = "auto";
      for (let y = 0; y < document.body.scrollHeight; y += 280) {
        window.scrollTo({ top: y, behavior: "instant" });
        await new Promise((r) => setTimeout(r, 90));
      }
      window.scrollTo({ top: 0, behavior: "instant" });
    });
    await page.waitForTimeout(1600);
    const r = await page.evaluate(report);
    console.log(`\n===== ${theme.toUpperCase()} (mobile 390) =====`);
    console.log(JSON.stringify({ vw: r.vw, scrollW: r.scrollW, overflowers: r.overflowers, revealHidden: r.revealHidden, revealTotal: r.revealTotal, wordsHidden: r.wordsHidden, wordsTotal: r.wordsTotal, brokenImgs: r.brokenImgs, clipped: r.clipped, pageH: r.pageH, displayFont: r.displayFont }, null, 1));
    console.log("errors:", errs.length ? errs.slice(0, 6) : "none");
    await ctx.close();
  }

  await browser.close();
})();
