import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const KEY = process.env.PEXELS_API_KEY;

// Contextual queries (not generic "construction"), one per slot.
const SLOTS = {
  hero: { q: "modern concrete architecture building", orientation: "portrait" },
  p1: { q: "modern villa construction architecture", orientation: "landscape" },
  p2: { q: "steel structure bridge infrastructure", orientation: "landscape" },
  p3: { q: "luxury concrete architecture exterior", orientation: "landscape" },
  p4: { q: "modern commercial building glass facade", orientation: "landscape" },
  before: { q: "old house renovation construction", orientation: "landscape" },
  after: { q: "modern renovated house exterior", orientation: "landscape" },
};

let cache = null, cacheAt = 0;

// Simple scoring: landscape, resolution, not too busy (prefers wide images).
const score = (p) => (p.width >= 3000 ? 5 : 2) + (p.width / p.height > 1.4 ? 5 : 0) + (p.height >= 2000 ? 2 : 0);

async function load() {
  if (cache && Date.now() - cacheAt < 6 * 3600e3) return cache;
  const out = {};
  await Promise.all(Object.entries(SLOTS).map(async ([slot, s]) => {
    try {
      const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(s.q)}&orientation=${s.orientation}&per_page=15`;
      const r = await fetch(url, { headers: { Authorization: KEY } });
      if (!r.ok) return;
      const { photos = [] } = await r.json();
      const best = photos.sort((a, b) => score(b) - score(a))[0];
      if (best) out[slot] = {
        src: best.src.large2x, tex: best.src.large, alt: best.alt || s.q,
        credit: best.photographer, link: best.url,
      };
    } catch {}
  }));
  cache = out; cacheAt = Date.now();
  return out;
}

app.get("/healthz", (_, res) => res.send("ok"));
app.get("/api/photos", async (_, res) => {
  if (!KEY) return res.json({});
  res.set("Cache-Control", "public, max-age=3600").json(await load());
});
// Same-origin image proxy so WebGL textures are never blocked by CORS.
app.get("/api/img", async (req, res) => {
  try {
    const u = new URL(String(req.query.u));
    if (u.hostname !== "images.pexels.com") return res.status(400).end();
    const r = await fetch(u);
    if (!r.ok) return res.status(502).end();
    res.set("Content-Type", r.headers.get("content-type") || "image/jpeg").set("Cache-Control", "public, max-age=604800");
    res.send(Buffer.from(await r.arrayBuffer()));
  } catch { res.status(400).end(); }
});
app.use(express.static(path.join(__dirname, "dist")));
app.get("*", (_, res) => res.sendFile(path.join(__dirname, "dist", "index.html")));
app.listen(process.env.PORT || 3000, () => console.log("listening"));
