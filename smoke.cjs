const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");

const SHOTS = path.join(process.cwd(), "shots");
fs.mkdirSync(SHOTS, { recursive: true });
const log = [];
const note = (m) => { log.push(m); };

const wrap = async (label, fn) => {
  try { await fn(); } catch (e) { note(`!! ${label}: ${String(e.message).split("\n")[0]}`); }
};

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1512, height: 950 } });
  const errors = [];
  page.on("console", (m) => { if (m.type() === "error") errors.push("CONSOLE: " + m.text()); });
  page.on("pageerror", (e) => errors.push("PAGEERROR: " + e.message));

  await page.goto("file://" + path.join(process.cwd(), "dist/index.html"), { waitUntil: "load" });
  await page.waitForTimeout(3200);
  await page.screenshot({ path: `${SHOTS}/00-chooser.png` });

  await wrap("choose A", async () => {
    await page.locator("button.dc-panel", { hasText: "Espresso & Latte" }).first().click();
    await page.waitForTimeout(2000);
  });

  const shot = async (name, sel) => {
    await wrap(`shot ${name}`, async () => {
      const el = page.locator(sel).first();
      await el.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1500);
      await el.screenshot({ path: `${SHOTS}/${name}.png` });
    });
  };

  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1800);
  await page.screenshot({ path: `${SHOTS}/A-01-hero.png` });

  await shot("A-02-story", "#story");
  await shot("A-03-services", "#services");
  await shot("A-04-menu", "#menu");
  await shot("A-05-process", "#process");
  await shot("A-06-packages", "#packages");
  await shot("A-07-gallery", "#gallery");
  await shot("A-08-words", "#words");
  await shot("A-09-booking", "#booking");
  await shot("A-10-faq", "#faq");
  await shot("A-11-footer", "#contact");

  await wrap("menu add", async () => {
    await page.locator("#menu").scrollIntoViewIfNeeded();
    const meterBefore = (await page.locator("#menu .display").filter({ hasText: /^\d+\/\d+$/ }).first().textContent()) || "?";
    await page.locator("#menu button[aria-label^='Add']").nth(3).click();
    await page.waitForTimeout(600);
    const meterAfter = (await page.locator("#menu .display").filter({ hasText: /^\d+\/\d+$/ }).first().textContent()) || "?";
    note(`menu meter ${meterBefore} -> ${meterAfter}`);
    await page.locator("#menu .display", { hasText: /^The Late Bloomer$/ }).first().click();
    await page.waitForTimeout(900);
    await page.screenshot({ path: `${SHOTS}/A-12-menu-detail.png` });
  });

  await wrap("slider", async () => {
    const slider = page.locator('input[type=range][aria-label="Guest count"]').first();
    await slider.scrollIntoViewIfNeeded();
    await slider.fill("220");
    await slider.dispatchEvent("input");
    await page.waitForTimeout(1000);
    const total = await page.locator("#packages .sticky").getByText(/Estimated total/i).locator("xpath=following-sibling::*[1]").textContent();
    note("estimate @220 guests: " + total);
  });

  await wrap("booking flow", async () => {
    await page.locator("#booking").scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    const fut = new Date(Date.now() + 1000 * 60 * 60 * 24 * 96).toISOString().slice(0, 10);
    await page.locator("input[type=date]").fill(fut);
    await page.locator("#booking input[placeholder='Stonebridge Estate, 44 Vine Rd']").fill("Stonebridge Estate");
    await page.locator("#booking button:has-text('Continue')").click();
    await page.waitForTimeout(1100);
    await page.screenshot({ path: `${SHOTS}/A-13-booking-step2.png` });
    await page.locator("#booking button:has-text('Continue')").click();
    await page.waitForTimeout(1100);
    await page.locator("#booking input[placeholder='Amara Okafor']").fill("Amara Okafor");
    await page.locator("#booking input[placeholder='you@address.com']").fill("amara@example.com");
    await page.locator("#booking input[placeholder='(415) 555-0100']").fill("415 555 0100");
    await page.locator("#booking textarea").fill("Please build something around my grandmother's fig tree.");
    await page.locator("#booking label:has-text('I am happy')").click();
    await page.waitForTimeout(300);
    await page.screenshot({ path: `${SHOTS}/A-14-booking-details.png` });
    await page.locator("#booking button:has-text('Continue')").click();
    await page.waitForTimeout(1200);
    await page.screenshot({ path: `${SHOTS}/A-15-booking-review.png` });
    await page.locator("#booking button:has-text('Send the enquiry')").click();
    await page.waitForTimeout(1600);
    await page.screenshot({ path: `${SHOTS}/A-16-success.png` });
    const ref = await page.locator("#booking").getByText(/BNC-\d{4}/).first().textContent();
    note("reference: " + ref);
  });

  await wrap("reset", async () => {
    await page.locator("button:has-text('Plan another event')").click();
    await page.waitForTimeout(1400);
    note("after reset, booking form visible: " + (await page.locator("#booking input[type=date]").count()));
  });

  await wrap("theme B", async () => {
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(600);
    await page.locator("button[title='Plum & Rose']").click();
    await page.waitForTimeout(3000);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(2400);
    await page.screenshot({ path: `${SHOTS}/B-01-hero.png` });
    note("theme now: " + (await page.evaluate(() => document.documentElement.dataset.theme)));
  });

  await shot("B-02-story", "#story");
  await shot("B-03-services", "#services");
  await shot("B-04-menu", "#menu");
  await shot("B-05-process", "#process");
  await shot("B-06-packages", "#packages");
  await shot("B-07-gallery", "#gallery");
  await shot("B-08-words", "#words");
  await shot("B-09-booking", "#booking");
  await shot("B-10-faq", "#faq");
  await shot("B-11-footer", "#contact");

  await wrap("modal", async () => {
    await page.locator("#menu").scrollIntoViewIfNeeded();
    await page.locator("#menu article button").first().click();
    await page.waitForTimeout(1300);
    await page.screenshot({ path: `${SHOTS}/B-12-modal.png` });
    await page.keyboard.press("Escape");
  });

  const mob = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  mob.on("pageerror", (e) => errors.push("MOBILE PAGEERROR: " + e.message));
  await wrap("mobile", async () => {
    await mob.goto("file://" + path.join(process.cwd(), "dist/index.html"), { waitUntil: "load" });
    await mob.waitForTimeout(2800);
    const skip = mob.locator("button:has-text('Skip')");
    if (await skip.count()) await skip.click();
    await mob.waitForTimeout(2200);
    await mob.screenshot({ path: `${SHOTS}/M-01-hero.png` });
    await mob.locator("#menu").scrollIntoViewIfNeeded();
    await mob.waitForTimeout(1400);
    await mob.screenshot({ path: `${SHOTS}/M-02-menu.png` });
    await mob.locator("#packages").scrollIntoViewIfNeeded();
    await mob.waitForTimeout(1200);
    await mob.screenshot({ path: `${SHOTS}/M-03-packages.png` });
    await mob.evaluate(() => window.scrollTo(0, 0));
    await mob.waitForTimeout(600);
    await mob.locator("button[aria-label='Menu']").click();
    await mob.waitForTimeout(1000);
    await mob.screenshot({ path: `${SHOTS}/M-04-nav.png` });
  });

  note("--- console/page errors: " + errors.length + " ---");
  errors.slice(0, 20).forEach((e) => note(e));
  console.log(log.join("\n"));
  await browser.close();
})();
