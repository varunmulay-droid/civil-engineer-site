import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const KEY = (process.env.PEXELS_API_KEY || "").trim();
const HEAD = { Authorization: KEY, "User-Agent": "civil-engineer-site/2.0" };

// Each slot tries its queries in order until one returns usable media.
const PHOTOS = {
  hero: { o: "portrait", q: ["modern concrete architecture building", "modern architecture building exterior", "architecture concrete"] },
  p1: { o: "landscape", q: ["modern villa construction architecture", "modern villa exterior", "luxury house architecture"] },
  p2: { o: "landscape", q: ["steel structure bridge infrastructure", "bridge infrastructure", "steel bridge"] },
  p3: { o: "landscape", q: ["luxury concrete architecture exterior", "concrete house architecture", "modern house"] },
  p4: { o: "landscape", q: ["modern commercial building glass facade", "office building glass", "modern building"] },
  before: { o: "landscape", q: ["old house renovation construction", "house renovation", "construction site house"] },
  after: { o: "landscape", q: ["modern renovated house exterior", "modern house exterior", "modern house"] },
};
const VIDEOS = {
  video: { o: "landscape", q: ["modern architecture building exterior", "architecture building", "city building"] },
  reel: { o: "landscape", q: ["construction site crane timelapse", "building construction site", "construction workers"] },
};

let cache = null, cacheAt = 0, lastTry = 0;
const status = { key: !!KEY, keyLength: KEY.length, errors: {}, photos: 0, videos: 0, checkedAt: null };

async function px(url) {
  const r = await fetch(url, { headers: HEAD, signal: AbortSignal.timeout(12000) });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
}
const scorePhoto = (p) => (p.width >= 3000 ? 5 : 2) + (p.width / p.height > 1.4 || p.height / p.width > 1.4 ? 4 : 0) + (p.height >= 2000 ? 2 : 0);
const scoreVideo = (v) => (v.duration >= 8 && v.duration <= 45 ? 5 : 0) + (v.width >= 1920 ? 3 : 1);

function pickFile(v) {
  const f = (v.video_files || []).filter((x) => x.file_type === "video/mp4" && x.width);
  return f.filter((x) => x.width >= 1280 && x.width <= 1920).sort((a, b) => b.width - a.width)[0] || f.sort((a, b) => a.width - b.width).pop();
}

async function load() {
  const out = {}; status.errors = {};
  await Promise.all([
    ...Object.entries(PHOTOS).map(async ([slot, s]) => {
      for (const q of s.q) {
        try {
          const { photos = [] } = await px(`https://api.pexels.com/v1/search?query=${encodeURIComponent(q)}&orientation=${s.o}&per_page=15`);
          const b = photos.sort((a, c) => scorePhoto(c) - scorePhoto(a))[0];
          if (b) { out[slot] = { src: b.src.large2x, tex: b.src.large, alt: b.alt || q, credit: b.photographer, link: b.url }; return; }
        } catch (e) { status.errors[slot] = String(e.message || e); }
      }
    }),
    ...Object.entries(VIDEOS).map(async ([slot, s]) => {
      for (const q of s.q) {
        try {
          const { videos = [] } = await px(`https://api.pexels.com/videos/search?query=${encodeURIComponent(q)}&orientation=${s.o}&size=medium&per_page=15`);
          const v = videos.sort((a, c) => scoreVideo(c) - scoreVideo(a))[0], f = v && pickFile(v);
          if (f) { out[slot] = { src: f.link, poster: v.image, credit: v.user?.name, link: v.url }; return; }
        } catch (e) { status.errors[slot] = String(e.message || e); }
      }
    }),
  ]);
  status.photos = Object.keys(out).filter((k) => PHOTOS[k]).length;
  status.videos = Object.keys(out).filter((k) => VIDEOS[k]).length;
  status.checkedAt = new Date().toISOString();
  return out;
}

async function get() {
  if (cache && Date.now() - cacheAt < 6 * 3600e3) return cache;
  if (Date.now() - lastTry < 20e3) return cache || {}; // throttle retries while failing
  lastTry = Date.now();
  const out = await load();
  if (Object.keys(out).length) { cache = out; cacheAt = Date.now(); } // never cache an empty result
  return out;
}

app.get("/healthz", (_, res) => res.send("ok"));
// Open /api/status in the browser to see whether the key is set and what Pexels answered.
app.get("/api/status", async (_, res) => { await get(); res.json(status); });
app.get("/api/photos", async (_, res) => {
  if (!KEY) return res.json({});
  const d = await get();
  res.set("Cache-Control", Object.keys(d).length ? "public, max-age=600" : "no-store").json(d);
});
// Same-origin image proxy so WebGL textures are never blocked by CORS.
app.get("/api/img", async (req, res) => {
  try {
    const u = new URL(String(req.query.u));
    if (u.hostname !== "images.pexels.com") return res.status(400).end();
    const r = await fetch(u, { headers: { "User-Agent": HEAD["User-Agent"] } });
    if (!r.ok) return res.status(502).end();
    res.set("Content-Type", r.headers.get("content-type") || "image/jpeg").set("Cache-Control", "public, max-age=604800");
    res.send(Buffer.from(await r.arrayBuffer()));
  } catch { res.status(400).end(); }
});
app.use(express.static(path.join(__dirname, "dist")));
app.get("*", (_, res) => res.sendFile(path.join(__dirname, "dist", "index.html")));
app.listen(process.env.PORT || 3000, () => console.log("listening", KEY ? "(Pexels key set)" : "(NO PEXELS_API_KEY)"));
