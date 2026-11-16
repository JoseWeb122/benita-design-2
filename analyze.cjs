const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const dir = "shots";
(async () => {
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".png")).sort();
  for (const f of files) {
    const img = sharp(path.join(dir, f));
    const { data, info } = await img.raw().ensureAlpha().toBuffer({ resolveWithObject: true });
    const st = await sharp(path.join(dir, f)).stats();
    // sample every 43rd pixel
    const seen = new Map();
    let diff = 0, n = 0;
    const bg = st.channels.slice(0, 3).map((c) => Math.round(c.mean));
    for (let i = 0; i < data.length; i += 4 * 43) {
      const r = data[i], g = data[i + 1], b = data[i + 2];
      const key = (r >> 4) + "," + (g >> 4) + "," + (b >> 4);
      seen.set(key, (seen.get(key) || 0) + 1);
      if (Math.abs(r - bg[0]) + Math.abs(g - bg[1]) + Math.abs(b - bg[2]) > 36) diff++;
      n++;
    }
    const top = [...seen.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([k, v]) => `${k}(${((v / n) * 100).toFixed(0)}%)`);
    console.log(
      `${f.padEnd(26)} ${String(info.width).padStart(5)}x${String(info.height).padEnd(6)} bg=rgb(${bg.join(",")}) ` +
      `detail=${((diff / n) * 100).toFixed(1)}% colors=${String(seen.size).padStart(4)} entropy=${st.channels[0].entropy?.toFixed?.(2) ?? "-"} top=${top.join(" ")}`
    );
  }
})();
